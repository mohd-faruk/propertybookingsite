<?php

namespace App\Http\Controllers;

use App\Services\GuestyService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PropertyBookingController extends Controller
{
    public function __construct(
        private GuestyService $guestyService,
    ) {}

    /**
     * Display the booking page for a property.
     */
    public function __invoke(string $id): InertiaResponse
    {
        $property = Cache::remember("guesty:listing-property-details-{$id}", now()->addMinutes(10), fn () => $this->guestyService->getListing($id));

        return Inertia::render('properties/booking', [
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
