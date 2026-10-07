import { differenceInCalendarDays, format } from 'date-fns';
import type { FormEvent } from 'react';
import type { DateRange } from 'react-day-picker';
import type { Property } from '@/types';
import PropertyAvailabilityCalendar, {
    type AvailableDate,
} from '../property-availability-calendar';
import type { GuestCounts } from './types';

type DatesAndGuestsStepProps = {
    property: Property;
    availableDates: AvailableDate[];
    range?: DateRange;
    guests: GuestCounts;
    coupon: string;
    isSubmitting: boolean;
    error?: string;
    timeZone?: string;
    onRangeChange: (range: DateRange | undefined) => void;
    onGuestCountChange: (field: keyof GuestCounts, value: string) => void;
    onCouponChange: (coupon: string) => void;
    onNext: (event: FormEvent<HTMLFormElement>) => void;
};

export default function DatesAndGuestsStep({
    property,
    availableDates,
    range,
    guests,
    coupon,
    isSubmitting,
    error,
    timeZone,
    onRangeChange,
    onGuestCountChange,
    onCouponChange,
    onNext,
}: DatesAndGuestsStepProps) {
    const nights =
        range?.from && range.to
            ? differenceInCalendarDays(range.to, range.from)
            : 0;
    const guestsCount =
        guests.numberOfAdults +
        guests.numberOfChildren +
        guests.numberOfInfants;
    const exceedsCapacity =
        typeof property.accommodates === 'number' &&
        guestsCount > property.accommodates;

    return (
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-12">
            <div>
                <h2 className="text-xl font-semibold text-[#17372e]">
                    Select your stay dates
                </h2>
                <p className="mt-2 text-sm text-[#738178]">
                    Choose available check-in and check-out dates, then enter
                    your guest details to see available rates.
                </p>
                <div className="mt-5">
                    <PropertyAvailabilityCalendar
                        availableDates={availableDates}
                        selected={range}
                        timeZone={timeZone}
                        onSelect={onRangeChange}
                    />
                </div>
            </div>

            <form
                onSubmit={onNext}
                className="h-fit rounded-md border border-[#d8e0d9] bg-white p-5 sm:p-6"
            >
                <h2 className="text-xl font-semibold text-[#17372e]">
                    Stay details
                </h2>
                <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-[#738178]">Check-in</dt>
                        <dd className="text-right font-medium text-[#17372e]">
                            {range?.from
                                ? format(range.from, 'PPP')
                                : 'Select a date'}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-[#738178]">Check-out</dt>
                        <dd className="text-right font-medium text-[#17372e]">
                            {range?.to
                                ? format(range.to, 'PPP')
                                : 'Select a date'}
                        </dd>
                    </div>
                    {nights > 0 && (
                        <div className="flex justify-between gap-4">
                            <dt className="text-[#738178]">Nights</dt>
                            <dd className="font-medium text-[#17372e]">
                                {nights}
                            </dd>
                        </div>
                    )}
                </dl>

                <div className="mt-5 grid gap-4 border-t border-[#e5ebe5] pt-5 sm:grid-cols-2">
                    {(
                        [
                            ['numberOfAdults', 'Adults', 1],
                            ['numberOfChildren', 'Children', 0],
                            ['numberOfInfants', 'Infants', 0],
                            ['numberOfPets', 'Pets', 0],
                        ] as const
                    ).map(([field, label, min]) => (
                        <label
                            key={field}
                            className="grid gap-1.5 text-sm font-medium text-[#40554b]"
                        >
                            {label}
                            <input
                                type="number"
                                min={min}
                                step={1}
                                required={field === 'numberOfAdults'}
                                value={guests[field]}
                                onChange={(event) =>
                                    onGuestCountChange(
                                        field,
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                            />
                        </label>
                    ))}
                </div>

                <label className="mt-4 grid gap-1.5 text-sm font-medium text-[#40554b]">
                    Coupon code
                    <input
                        type="text"
                        maxLength={255}
                        value={coupon}
                        onChange={(event) => onCouponChange(event.target.value)}
                        className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                    />
                </label>

                <p className="mt-3 text-xs text-[#738178]">
                    {guestsCount} {guestsCount === 1 ? 'guest' : 'guests'}
                    {guests.numberOfPets > 0
                        ? ` and ${guests.numberOfPets} ${guests.numberOfPets === 1 ? 'pet' : 'pets'}`
                        : ''}
                </p>

                {exceedsCapacity && (
                    <p className="mt-3 text-sm text-[#a33425]">
                        This property accommodates up to {property.accommodates}{' '}
                        guests.
                    </p>
                )}
                {error && (
                    <p role="alert" className="mt-3 text-sm text-[#a33425]">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={
                        !range?.from ||
                        !range.to ||
                        !property._id ||
                        isSubmitting ||
                        nights < 1 ||
                        guests.numberOfAdults < 1 ||
                        exceedsCapacity
                    }
                    className="mt-5 w-full rounded-md bg-[#a34f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#873e27] disabled:cursor-not-allowed disabled:bg-[#b9c4bc]"
                >
                    {isSubmitting ? 'Getting quote…' : 'Next'}
                </button>
            </form>
        </section>
    );
}
