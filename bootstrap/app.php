<?php

use App\Exceptions\GuestyServiceException;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (Throwable $e, Request $request) {
            if (
                $e instanceof ValidationException ||
                $e instanceof AuthenticationException ||
                $e instanceof HttpResponseException
            ) {
                return null;
            }

            $status = match (true) {
                $e instanceof GuestyServiceException => $e->statusCode(),
                $e instanceof HttpExceptionInterface => $e->getStatusCode(),
                default => 500,
            };

            if ($request->expectsJson() || $request->is('api/*')) {
                if ($e instanceof GuestyServiceException) {
                    return response()->json([
                        'message' => $e->getMessage(),
                    ], $status);
                }

                return null;
            }

            $message = match (true) {
                $e instanceof GuestyServiceException => $e->getMessage(),
                $status === 403 => 'You do not have permission to view this page.',
                $status === 404 => 'The page or property you are looking for could not be found.',
                $status === 419 => 'Your session has expired. Refresh the page and try again.',
                $status === 429 => 'Too many requests. Please wait a moment and try again.',
                $status >= 500 => 'Something went wrong on our end. Please try again later.',
                default => 'We could not complete your request. Please try again.',
            };

            return Inertia::render('errors/show', [
                'status' => $status,
                'message' => $message,
            ])->toResponse($request)->setStatusCode($status);
        });
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
