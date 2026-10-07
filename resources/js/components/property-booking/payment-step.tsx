import { loadScript } from '@guestyorg/tokenization-js';
import type { GuestyTokenizationV3Namespace } from '@guestyorg/tokenization-js';
import type {
    GuestyTokenizationV3SubmitPayload,
    PaymentMethod,
} from '@guestyorg/tokenization-js';
import { useEffect, useId, useRef, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import type { GuestInfo, QuoteRatePlan } from './types';
import { getPaymentProviderId, getRatePlanTotal, isRecord } from './types';

type PaymentStepProps = {
    listingId: string;
    quoteId: string;
    ratePlan: QuoteRatePlan;
    guestInfo: GuestInfo;
    onPrevious: () => void;
};

type ApiError = {
    message?: unknown;
};

type Tokenizer = Omit<GuestyTokenizationV3Namespace, 'submit'> & {
    submit: (
        payload: GuestyTokenizationV3SubmitPayload,
    ) => Promise<PaymentMethod>;
};

function isApiError(value: unknown): value is ApiError {
    return isRecord(value) && 'message' in value;
}

async function readJson(response: Response) {
    try {
        return (await response.json()) as unknown;
    } catch {
        throw new Error(
            `The booking service returned an unreadable response (HTTP ${response.status}).`,
        );
    }
}

function getCsrfToken() {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content;
}

export default function PaymentStep({
    listingId,
    quoteId,
    ratePlan,
    guestInfo,
    onPrevious,
}: PaymentStepProps) {
    const containerId = useId();
    const tokenizerRef = useRef<Tokenizer | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>();
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);
    const [verificationPending, setVerificationPending] = useState(false);
    const [challengeResult, setChallengeResult] =
        useState<Record<string, unknown>>();
    const amount = getRatePlanTotal(ratePlan);
    const currency = ratePlan.ratePlan.money?.currency;

    useEffect(() => {
        let cancelled = false;
        let tokenizer: Tokenizer | null = null;

        async function initialize() {
            try {
                const providerResponse = await fetch(
                    `/api/payment-provider/${encodeURIComponent(listingId)}`,
                    {
                        headers: { Accept: 'application/json' },
                    },
                );
                const provider = await readJson(providerResponse);
                if (!providerResponse.ok) {
                    const message =
                        isApiError(provider) &&
                        typeof provider.message === 'string'
                            ? provider.message
                            : `Could not load the payment provider (HTTP ${providerResponse.status}).`;
                    throw new Error(message);
                }

                const providerId = getPaymentProviderId(provider);
                if (!providerId) {
                    throw new Error(
                        'The payment provider response did not include a provider ID.',
                    );
                }

                const sdk = await loadScript<'v3'>({ version: 'v3' });
                if (!sdk) {
                    throw new Error(
                        'The payment form is only available in a browser.',
                    );
                }
                if (cancelled) {
                    return;
                }

                // The package's v3 declaration only types submit() without its documented payload overload.
                tokenizer = sdk as Tokenizer;
                tokenizerRef.current = tokenizer;
                await sdk.render({
                    containerId,
                    providerId,
                    paymentMethod: 'card',
                    showAddressToggle: true,
                    styles: {
                        colorText: '#17372e',
                        colorTextError: '#a33425',
                        colorPlaceholder: '#738178',
                        colorBorder: '#d8e0d9',
                        colorBorderFocus: '#a34f32',
                        colorFormBackground: '#ffffff',
                        colorInputBackground: '#ffffff',
                        borderRadius: 4,
                        inputHeight: 44,
                        inputPadding: 12,
                    },
                });
                if (!cancelled) {
                    setIsReady(true);
                }
            } catch (cause) {
                if (!cancelled) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Could not initialize the secure payment form.',
                    );
                }
            }
        }

        void initialize();

        return () => {
            cancelled = true;
            tokenizerRef.current = null;
            if (tokenizer) {
                void Promise.resolve()
                    .then(() => tokenizer?.destroy())
                    .catch((cause: unknown) => {
                        console.error(
                            'Failed to remove the Guesty payment form.',
                            cause,
                        );
                    });
            }
        };
    }, [containerId, listingId]);

    async function submitPayment() {
        const tokenizer = tokenizerRef.current;
        if (!tokenizer || amount === undefined || !currency) {
            setError(
                'Payment details are unavailable. Return to rate plans and select a valid quote.',
            );
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setError(
                'We could not verify your session. Refresh the page and try again.',
            );
            return;
        }

        setIsSubmitting(true);
        setError(undefined);

        try {
            const token = await tokenizer.submit({
                apiVersion: 'v3',
                listingId,
                quoteId,
                amount,
                currency,
                guest: {
                    firstName: guestInfo.firstName,
                    lastName: guestInfo.lastName,
                    email: guestInfo.email,
                    phone: guestInfo.phone,
                },
                method: 'verify_no_3ds',
            });

            if (!token._id) {
                throw new Error(
                    'The payment service did not return a payment token.',
                );
            }

            const response = await fetch('/api/instant-reservation', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    quoteId,
                    ratePlanId: ratePlan.ratePlan._id,
                    ccToken: token._id,
                    guest: {
                        firstName: guestInfo.firstName,
                        lastName: guestInfo.lastName,
                        email: guestInfo.email,
                        phone: guestInfo.phone,
                    },
                }),
            });

            const result = await readJson(response);
            if (!response.ok) {
                const message =
                    isApiError(result) && typeof result.message === 'string'
                        ? result.message
                        : `Payment could not be completed (HTTP ${response.status}).`;
                throw new Error(message);
            }
            if (!isRecord(result)) {
                throw new Error(
                    'The booking service returned an unexpected payment response.',
                );
            }

            if (isRecord(result.threeDSChallenge)) {
                setChallengeResult(
                    await tokenizer.handle3DSChallenge({
                        threeDSChallenge: result.threeDSChallenge,
                    }),
                );
                setVerificationPending(true);
                setPaymentSubmitted(true);
                return;
            }

            if (
                typeof result.status === 'string' &&
                ['FAILED', 'DECLINED', 'CANCELLED'].includes(
                    result.status.toUpperCase(),
                )
            ) {
                throw new Error(
                    typeof result.message === 'string'
                        ? result.message
                        : 'The payment was not approved. Try another payment method.',
                );
            }

            setPaymentSubmitted(true);
        } catch (cause) {
            setError(
                cause instanceof TypeError
                    ? 'We could not connect to the payment service. Please try again.'
                    : cause instanceof Error
                      ? cause.message
                      : 'Payment could not be completed. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="mx-auto max-w-2xl">
            <h2 className="text-xl font-semibold text-[#17372e]">Payment</h2>
            <p className="mt-2 text-sm text-[#738178]">
                Your card details are entered securely in Guesty’s hosted form.
                Enable billing address details and select a country before
                entering a state or region when required.
            </p>

            <div className="mt-5 rounded-md border border-[#d8e0d9] bg-white p-5 sm:p-6">
                <div className="flex justify-between gap-4 border-b border-[#e5ebe5] pb-4">
                    <span className="text-sm text-[#586a62]">
                        {ratePlan.ratePlan.name || 'Selected rate plan'}
                    </span>
                    <span className="font-semibold text-[#17372e]">
                        {formatPrice(amount, currency)}
                    </span>
                </div>
                <div
                    id={containerId}
                    className="mt-5 min-h-24"
                    aria-label="Secure payment form"
                />
                {!isReady && !error && (
                    <p role="status" className="mt-3 text-sm text-[#738178]">
                        Loading secure payment form…
                    </p>
                )}
                {error && (
                    <p role="alert" className="mt-3 text-sm text-[#a33425]">
                        {error}
                    </p>
                )}
                {verificationPending ? (
                    <p role="status" className="mt-4 text-sm text-[#8b4c17]">
                        3-D Secure verification completed. The booking cannot be
                        confirmed until the server-side payment verification
                        endpoint is configured. Do not retry this payment.
                        {challengeResult &&
                            ' Verification result is retained for this session.'}
                    </p>
                ) : paymentSubmitted ? (
                    <p role="status" className="mt-4 text-sm text-[#40554b]">
                        The payment service accepted the booking request.
                        Reservation confirmation is pending.
                    </p>
                ) : (
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <button
                            type="button"
                            onClick={onPrevious}
                            disabled={isSubmitting}
                            className="rounded-md border border-[#d8e0d9] px-5 py-3 text-sm font-semibold text-[#40554b] transition hover:bg-[#f3f6f2] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => void submitPayment()}
                            disabled={
                                !isReady ||
                                isSubmitting ||
                                amount === undefined ||
                                !currency
                            }
                            className="rounded-md bg-[#a34f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#873e27] disabled:cursor-not-allowed disabled:bg-[#b9c4bc]"
                        >
                            {isSubmitting ? 'Processing payment…' : 'Pay now'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
