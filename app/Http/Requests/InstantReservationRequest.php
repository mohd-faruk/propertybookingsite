<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class InstantReservationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'listingId' => ['required', 'string', 'max:255'],
            'quoteId' => ['required', 'string', 'max:255'],
            'ratePlanId' => ['required', 'string', 'max:255'],
            'ccToken' => ['required', 'string', 'max:512'],
            'guest.firstName' => ['required', 'string', 'max:100'],
            'guest.lastName' => ['required', 'string', 'max:100'],
            'guest.email' => ['required', 'email', 'max:255'],
            'guest.phone' => ['required', 'string', 'min:7', 'max:30'],
        ];
    }
}
