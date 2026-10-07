<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstantReservationRequest;
use App\Services\GuestyService;
use Illuminate\Http\JsonResponse;

class InstantReservationController extends Controller
{
    public function __construct(
        private GuestyService $guestyService,
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(InstantReservationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $listingId = $data['listingId'];
        unset($data['listingId']);

        $response = $this->guestyService->createInstantReservation($data['quoteId'], $data);
        $this->guestyService->forgetAvailability($listingId);

        return response()->json($response);
    }
}
