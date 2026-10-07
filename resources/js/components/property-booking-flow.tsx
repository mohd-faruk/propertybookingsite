import { format } from 'date-fns';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { DateRange } from 'react-day-picker';
import type { Property } from '@/types';
import type { AvailableDate } from './property-availability-calendar';
import DatesAndGuestsStep from './property-booking/dates-and-guests-step';
import PaymentStep from './property-booking/payment-step';
import RatePlanStep from './property-booking/rate-plan-step';
import {
    initialGuestCounts,
    initialGuestInfo,
    isRecord,
    isReservationQuote,
} from './property-booking/types';
import type {
    GuestCounts,
    GuestInfo,
    QuoteRatePlan,
    ReservationQuote,
} from './property-booking/types';

type PropertyBookingFlowProps = {
    property: Property;
    availableDates: AvailableDate[];
    timeZone?: string;
};

type BookingPhase = 1 | 2 | 3;

function getCsrfToken() {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content;
}

function getResponseMessage(value: unknown) {
    return isRecord(value) && typeof value.message === 'string'
        ? value.message
        : undefined;
}

export default function PropertyBookingFlow({
    property,
    availableDates,
    timeZone,
}: PropertyBookingFlowProps) {
    const [phase, setPhase] = useState<BookingPhase>(1);
    const [range, setRange] = useState<DateRange>();
    const [guests, setGuests] = useState<GuestCounts>(initialGuestCounts);
    const [coupon, setCoupon] = useState('');
    const [guestInfo, setGuestInfo] = useState<GuestInfo>(initialGuestInfo);
    const [quote, setQuote] = useState<ReservationQuote>();
    const [selectedRatePlanId, setSelectedRatePlanId] = useState<string>();
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const [quoteError, setQuoteError] = useState<string>();
    const guestsCount =
        guests.numberOfAdults +
        guests.numberOfChildren +
        guests.numberOfInfants;

    function clearQuote() {
        setQuote(undefined);
        setSelectedRatePlanId(undefined);
        setQuoteError(undefined);
    }

    function updateGuestCount(field: keyof GuestCounts, value: string) {
        setGuests((current) => ({
            ...current,
            [field]: value === '' ? 0 : Number(value),
        }));
        clearQuote();
    }

    async function requestQuote(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (
            !range?.from ||
            !range.to ||
            !property._id ||
            guests.numberOfAdults < 1
        ) {
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setQuoteError(
                'We could not verify your session. Refresh the page and try again.',
            );
            return;
        }

        setIsSubmittingQuote(true);
        clearQuote();

        try {
            const response = await fetch('/api/reservation-quote', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    listingId: property._id,
                    checkInDateLocalized: format(range.from, 'yyyy-MM-dd'),
                    checkOutDateLocalized: format(range.to, 'yyyy-MM-dd'),
                    guestsCount,
                    numberOfGuests: guests,
                    ...(coupon.trim() ? { coupons: coupon.trim() } : {}),
                }),
            });

            let result: unknown;
            try {
                result = await response.json();
            } catch {
                throw new Error(
                    `We could not read the quote response (HTTP ${response.status}).`,
                );
            }

            if (!response.ok) {
                throw new Error(
                    getResponseMessage(result) ||
                        `Your quote request failed (HTTP ${response.status}).`,
                );
            }
            if (!isReservationQuote(result)) {
                throw new Error(
                    'The booking service returned an unexpected quote response. Please try again.',
                );
            }

            setQuote(result);
            setPhase(2);
        } catch (cause) {
            setQuoteError(
                cause instanceof TypeError
                    ? 'We could not connect to the booking service. Please try again.'
                    : cause instanceof Error
                      ? cause.message
                      : 'Your quote request could not be completed. Please try again.',
            );
        } finally {
            setIsSubmittingQuote(false);
        }
    }

    function continueToPayment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedRatePlanId || !quote) {
            return;
        }

        setPhase(3);
    }

    const selectedRatePlan: QuoteRatePlan | undefined =
        quote?.rates.ratePlans.find(
            (plan) => plan.ratePlan._id === selectedRatePlanId,
        );

    return (
        <section>
            <ol
                aria-label="Booking progress"
                className="mb-8 grid grid-cols-3 gap-3"
            >
                {(['Stay details', 'Rate and guest', 'Payment'] as const).map(
                    (label, index) => {
                        const step = (index + 1) as BookingPhase;
                        const current = phase === step;
                        const complete = phase > step;

                        return (
                            <li
                                key={label}
                                aria-current={current ? 'step' : undefined}
                                className={`border-b-2 pb-3 text-sm ${
                                    current || complete
                                        ? 'border-[#a34f32] font-semibold text-[#17372e]'
                                        : 'border-[#d8e0d9] text-[#738178]'
                                }`}
                            >
                                <span className="mr-2">{step}.</span>
                                {label}
                            </li>
                        );
                    },
                )}
            </ol>

            {phase === 1 && (
                <DatesAndGuestsStep
                    property={property}
                    availableDates={availableDates}
                    timeZone={timeZone}
                    range={range}
                    guests={guests}
                    coupon={coupon}
                    isSubmitting={isSubmittingQuote}
                    error={quoteError}
                    onRangeChange={(nextRange) => {
                        setRange(nextRange);
                        clearQuote();
                    }}
                    onGuestCountChange={updateGuestCount}
                    onCouponChange={(nextCoupon) => {
                        setCoupon(nextCoupon);
                        clearQuote();
                    }}
                    onNext={requestQuote}
                />
            )}

            {phase === 2 && quote && (
                <RatePlanStep
                    ratePlans={quote.rates.ratePlans}
                    selectedRatePlanId={selectedRatePlanId}
                    guestInfo={guestInfo}
                    onSelectRatePlan={setSelectedRatePlanId}
                    onGuestInfoChange={setGuestInfo}
                    onNext={continueToPayment}
                    onPrevious={() => setPhase(1)}
                />
            )}

            {phase === 3 && quote && selectedRatePlan && property._id && (
                <PaymentStep
                    listingId={property._id}
                    quoteId={quote._id}
                    ratePlan={selectedRatePlan}
                    guestInfo={guestInfo}
                    onPrevious={() => setPhase(2)}
                />
            )}
        </section>
    );
}
