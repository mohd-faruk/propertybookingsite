<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationQuoteRequest;
use App\Services\GuestyService;
use Illuminate\Http\JsonResponse;

class ReservationQuoteController extends Controller
{
    public function __construct(
        private GuestyService $guestyService,
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreReservationQuoteRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Assuming you have a method in GuestyService to create a reservation quote
        $quote = $this->guestyService->createQuote($validated);

        return response()->json($quote);
    }
}
