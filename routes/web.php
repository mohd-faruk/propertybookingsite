<?php

use App\Http\Controllers\APIs\InstantReservationController;
use App\Http\Controllers\APIs\PropertyPaymentProviderController;
use App\Http\Controllers\APIs\ReservationQuoteController;
use App\Http\Controllers\PropertyBookingController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('properties/{id}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('properties/{id}/booking', PropertyBookingController::class)->name('properties.booking');

Route::prefix('api')->group(function () {
    Route::get('payment-provider/{listingId}', PropertyPaymentProviderController::class);
    Route::post('reservation-quote', ReservationQuoteController::class);
    Route::post('instant-reservation', InstantReservationController::class);
});
