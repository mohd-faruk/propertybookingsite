<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReservationQuoteRequest extends FormRequest
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
            'checkInDateLocalized' => ['required', 'date_format:Y-m-d'],
            'checkOutDateLocalized' => ['required', 'date_format:Y-m-d', 'after:checkInDateLocalized'],
            'guestsCount' => ['required', 'integer', 'min:1', 'max:50'],
            'numberOfGuests' => ['sometimes', 'array'],
            'numberOfGuests.numberOfAdults' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'numberOfGuests.numberOfChildren' => ['sometimes', 'integer', 'min:0', 'max:50'],
            'numberOfGuests.numberOfInfants' => ['sometimes', 'integer', 'min:0', 'max:50'],
            'numberOfGuests.numberOfPets' => ['sometimes', 'integer', 'min:0', 'max:50'],
            'coupons' => ['sometimes', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $data = $validator->getData();
            $guests = $data['numberOfGuests'] ?? [];
            $count = (int) ($guests['numberOfAdults'] ?? 1)
                + (int) ($guests['numberOfChildren'] ?? 0)
                + (int) ($guests['numberOfInfants'] ?? 0);

            if ($count !== (int) $data['guestsCount']) {
                $validator->errors()->add(
                    'guestsCount',
                    'The guest count must match the number of adults, children, and infants.',
                );
            }
        });
    }
}
