<?php

namespace App\Services;

use App\Exceptions\GuestyServiceException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GuestyService
{
    private string $cacheKey;

    private string $apiBaseUrl;

    private string $tokenUrl;

    public function __construct()
    {
        $this->cacheKey = 'guesty:access-token';
        $this->apiBaseUrl = rtrim(config()->string('services.guesty.base_url'), '/').'/'.config()->string('services.guesty.prefix', 'api');
        $this->tokenUrl = rtrim(config()->string('services.guesty.base_url'), '/').'/oauth2/token';
    }

    private function getListingfields(string $fields): string
    {
        $defaultFields = [
            '_id',
            'type',
            'nickname',
            'propertyType',
            'title',
            'accommodates',
            'address.full',
            'bathrooms',
            'beds',
            'picture.thumbnail',
            'prices.basePrice',
            'prices.currency',
            'reviews',
            $fields,
        ];

        return implode(' ', $defaultFields);
    }

    /**
     * @param  array<string, string>  $query
     * @return array<string, mixed>
     */
    public function getListings(array $query = []): array
    {
        $query['fields'] = $this->getListingFields($query['fields'] ?? '');
        $response = $this->errorHandler(fn () => $this->request()->get('/listings', $query)->throw());

        return $this->decode($response);
    }

    /**
     * @param  array<string, string>  $query
     * @return array<string, mixed>
     */
    public function getListing(string $listingId, array $query = []): array
    {
        $response = $this->errorHandler(fn () => $this->request()
            ->get('/listings/'.rawurlencode($listingId), $query)
            ->throw());

        return $this->decode($response);
    }

    /**
     * @return array<string, mixed>
     */
    public function getPaymentProvider(string $listingId): array
    {
        $response = $this->errorHandler(fn () => $this->request()
            ->get('/listings/'.rawurlencode($listingId).'/payment-provider')
            ->throw());

        return $this->decode($response);
    }

    /**
     * @return array<string, mixed>
     */
    public function getAvailability(string $listingId, string $from, string $to): array
    {
        $response = $this->errorHandler(fn () => $this->request()
            ->get('/listings/'.rawurlencode($listingId).'/calendar', [
                'from' => $from,
                'to' => $to,
            ])
            ->throw());

        return $this->decode($response);
    }

    /**
     * @return array<string, mixed>
     */
    public function getCachedAvailability(string $listingId, string $from, string $to): array
    {
        return Cache::remember(
            "guesty:property-availability:{$listingId}",
            now()->addMinutes(5),
            fn () => $this->getAvailability($listingId, $from, $to),
        );
    }

    public function forgetAvailability(string $listingId): void
    {
        Cache::forget("guesty:property-availability:{$listingId}");
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createQuote(array $data): array
    {
        $coupon = $data['coupons'] ?? null;
        $data = [
            'listingId' => $data['listingId'],
            'checkInDateLocalized' => $data['checkInDateLocalized'],
            'checkOutDateLocalized' => $data['checkOutDateLocalized'],
            'guestsCount' => $data['guestsCount'] ?? 1,
            'numberOfGuests' => [
                'numberOfAdults' => $data['numberOfGuests']['numberOfAdults'] ?? 1,
                'numberOfChildren' => $data['numberOfGuests']['numberOfChildren'] ?? 0,
                'numberOfInfants' => $data['numberOfGuests']['numberOfInfants'] ?? 0,
                'numberOfPets' => $data['numberOfGuests']['numberOfPets'] ?? 0,
            ],
        ];
        if (is_string($coupon) && trim($coupon) !== '') {
            $data['coupons'] = trim($coupon);
        }
        $response = $this->errorHandler(fn () => $this->request(retryOnTransientFailures: false)
            ->post('/reservations/quotes', $data)
            ->throw());

        return $this->decode($response);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createInstantReservation(string $quoteId, array $data): array
    {
        $response = $this->errorHandler(fn () => $this->request(retryOnTransientFailures: false)
            ->post('reservations/quotes/'.rawurlencode($quoteId).'/instant', $data)
            ->throw());

        return $this->decode($response);
    }

    private function request(bool $retryOnTransientFailures = true): PendingRequest
    {
        return Http::baseUrl($this->apiBaseUrl)
            ->acceptJson()
            ->withToken($this->accessToken())
            ->timeout(config()->integer('services.guesty.api_timeout'))
            ->retry(
                3,
                fn ($attempt, $exception) => 1000 * pow(2, $attempt),
                function ($exception, $request) use ($retryOnTransientFailures) {
                    if ($exception instanceof RequestException && $exception->response->status() === 401) {
                        $request->withToken($this->accessToken(true));

                        return true;
                    }

                    return $retryOnTransientFailures &&
                        ($exception instanceof ConnectionException ||
                        ($exception instanceof RequestException &&
                        in_array($exception->response->status(), [500, 502, 503, 408, 429])));
                },
            );
    }

    private function accessToken(bool $forceRefresh = false): string
    {
        $token = Cache::string($this->cacheKey, '');
        if ($token !== '' && ! $forceRefresh) {
            return $token;
        }

        $clientId = config()->string('services.guesty.client_id', '');
        $clientSecret = config()->string('services.guesty.client_secret', '');
        if ($clientId === '' || $clientSecret === '') {
            throw new GuestyServiceException(
                'Property services are temporarily unavailable. Please try again later.',
                503,
            );
        }

        $response = $this->errorHandler(fn () => Http::asForm()
            ->acceptJson()
            ->timeout(config()->integer('services.guesty.api_timeout'))
            ->post($this->tokenUrl, [
                'grant_type' => 'client_credentials',
                'scope' => config()->string('services.guesty.scope', 'booking_engine:api'),
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
            ])
            ->throw());
        $token = $response->json('access_token');
        Cache::put($this->cacheKey, $token, max(1, (int) $response->json('expires_in') - 300));

        return $token;
    }

    /**
     * @return array<string, mixed>
     *
     * @throws \UnexpectedValueException
     */
    private function decode(Response $response): array
    {
        $payload = $response->json();

        if (! is_array($payload)) {
            throw new \UnexpectedValueException('Guesty API response was not a JSON object or array.');
        }

        return $payload;
    }

    /**
     * @param  \Closure(): mixed  $callback
     *
     * @throws GuestyServiceException
     */
    private function errorHandler(\Closure $callback): mixed
    {
        try {
            return $callback();
        } catch (RequestException $e) {
            if ($e->response->clientError()) {
                if ($e->response->status() === 404) {
                    throw new GuestyServiceException(
                        'The requested property or resource could not be found.',
                        404,
                        previous: $e,
                    );
                }
            }
            if ($e->response->serverError()) {
                throw new GuestyServiceException(
                    'Property services are temporarily unavailable. Please try again later.',
                    503,
                    $e,
                );
            }
            throw new GuestyServiceException(
                'We could not complete your request. Please review your details and try again.',
                502,
                $e,
            );
        } catch (ConnectionException $e) {
            throw new GuestyServiceException(
                'Property services are temporarily unavailable. Please try again later.',
                503,
                $e,
            );
        }
    }
}
