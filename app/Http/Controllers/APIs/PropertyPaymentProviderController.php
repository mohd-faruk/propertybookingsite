<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use App\Services\GuestyService;
use Illuminate\Http\JsonResponse;

class PropertyPaymentProviderController extends Controller
{
    public function __construct(
        private GuestyService $guestyService,
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(string $listingId): JsonResponse
    {
        $data = $this->guestyService->getPaymentProvider($listingId);

        return response()->json($data);
    }
}
