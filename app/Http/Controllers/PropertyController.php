<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexPropertyRequest;
use App\Services\GuestyService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PropertyController extends Controller
{
    public function __construct(
        private GuestyService $guestyService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(IndexPropertyRequest $request): InertiaResponse
    {
        $query = $request->validated();
        $queryString = $query ? json_encode($query) : null;
        $cacheKey = 'guesty:listing-properties'.($queryString ? ':'.md5($queryString) : '');

        $properties = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($query) {
            return $this->guestyService->getListings($query);
        });

        return Inertia::render('properties/index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): InertiaResponse
    {
        $property = Cache::remember("guesty:listing-property-details-{$id}", now()->addMinutes(10), fn () => $this->guestyService->getListing($id));

        return Inertia::render('properties/show', [
            'property' => $property,
            'availableDates' => Inertia::defer(function () use ($id, $property) {
                $timezone = $property['timezone'] ?? config()->string('app.timezone');
                $today = now($timezone);

                return $this->guestyService->getCachedAvailability(
                    $id,
                    $today->format('Y-m-d'),
                    $today->copy()->addMonths(6)->format('Y-m-d'),
                );
            }),
        ]);
    }
}
