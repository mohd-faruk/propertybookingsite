<?php

namespace App\Exceptions;

use RuntimeException;

class GuestyServiceException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly int $statusCode,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, previous: $previous);
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }
}
