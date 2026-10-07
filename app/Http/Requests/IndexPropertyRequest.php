<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexPropertyRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'checkIn' => ['required_with:checkOut', 'date', 'date_format:Y-m-d'],
            'checkOut' => ['required_with:checkIn', 'date', 'date_format:Y-m-d', 'after:checkIn'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'cursor' => ['sometimes', 'string'],
        ];
    }
}
