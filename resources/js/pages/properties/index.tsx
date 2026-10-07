import { router, Head, Link, usePage } from '@inertiajs/react';
import { format, isAfter, isValid, parseISO } from 'date-fns';
import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import PropertyPagination from '@/components/property-pagination';
import PropertyReviews from '@/components/property-reviews';
import PropertyTypeBadge from '@/components/property-type-badge';
import type { ListingResponse } from '@/types';
import { formatPrice } from '@/lib/utils';

type PropertiesPageProps = {
    properties: ListingResponse;
};

function readDate(value: string | null) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return undefined;
    }

    const date = parseISO(value);

    return isValid(date) && format(date, 'yyyy-MM-dd') === value
        ? date
        : undefined;
}

export default function PropertiesIndex({ properties }: PropertiesPageProps) {
    const { url } = usePage();
    const currentQuery = new URLSearchParams(url.split('?')[1] ?? '');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
        from: readDate(currentQuery.get('checkIn')),
        to: readDate(currentQuery.get('checkOut')),
    }));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const hasCompleteRange =
        dateRange?.from &&
        dateRange.to &&
        isAfter(dateRange.to, dateRange.from);
    const hasPartialRange = Boolean(dateRange?.from) !== Boolean(dateRange?.to);

    function searchProperties(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (hasPartialRange || (dateRange?.from && !hasCompleteRange)) {
            return;
        }

        router.get(
            '/properties',
            dateRange?.from && dateRange.to
                ? {
                      checkIn: format(dateRange.from, 'yyyy-MM-dd'),
                      checkOut: format(dateRange.to, 'yyyy-MM-dd'),
                  }
                : {},
            { preserveScroll: true },
        );
        setIsCalendarOpen(false);
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Head title="Properties" />
            <SiteHeader />
            <main className="flex-1 bg-[#f3f6f2] text-[#172923]">
                <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
                    <h1 className="mb-6 text-2xl font-semibold text-[#17372e]">
                        Properties
                    </h1>

                    <form
                        onSubmit={searchProperties}
                        className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                        <div className="relative w-full sm:max-w-md">
                            <span className="mb-1.5 block text-sm font-medium text-[#40554b]">
                                Check-in and check-out
                            </span>
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded={isCalendarOpen}
                                onClick={() =>
                                    setIsCalendarOpen((isOpen) => !isOpen)
                                }
                                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-[#9eafa3] bg-white px-4 text-left text-sm text-[#263b33] hover:bg-[#f8faf8] focus-visible:ring-2 focus-visible:ring-[#a34f32] focus-visible:outline-none"
                            >
                                <span>
                                    {dateRange?.from
                                        ? format(dateRange.from, 'MMM d, yyyy')
                                        : 'Add check-in'}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="text-[#738178]"
                                >
                                    →
                                </span>
                                <span>
                                    {dateRange?.to
                                        ? format(dateRange.to, 'MMM d, yyyy')
                                        : 'Add check-out'}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="text-lg text-[#738178]"
                                >
                                    ▦
                                </span>
                            </button>
                            {isCalendarOpen && (
                                <div
                                    role="dialog"
                                    aria-label="Choose check-in and check-out dates"
                                    className="absolute top-full left-0 z-30 mt-2 max-w-[calc(100vw-2.5rem)] rounded-md border border-[#d9e1db] bg-white p-3 shadow-[0_12px_32px_rgba(24,52,42,0.16)]"
                                >
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        defaultMonth={dateRange?.from}
                                        min={1}
                                        numberOfMonths={1}
                                        style={
                                            {
                                                '--rdp-accent-color': '#a34f32',
                                                '--rdp-accent-background-color':
                                                    '#f3e5df',
                                                '--rdp-day_button-border-radius':
                                                    '4px',
                                            } as CSSProperties
                                        }
                                    />
                                    <div className="flex justify-between border-t border-[#e5eae6] pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDateRange(undefined)
                                            }
                                            className="px-2 py-1 text-sm font-medium text-[#586a62] underline underline-offset-2 hover:text-[#17372e]"
                                        >
                                            Clear dates
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsCalendarOpen(false)
                                            }
                                            className="px-2 py-1 text-sm font-semibold text-[#a34f32] hover:text-[#873e27]"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={
                                hasPartialRange ||
                                Boolean(dateRange?.from && !hasCompleteRange)
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#a34f32] px-6 text-sm font-semibold text-white transition hover:bg-[#873e27] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Search
                        </button>
                    </form>

                    {properties.results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {properties.results.map((property, index) => (
                                <article
                                    key={`${property._id ?? 'property'}-${index}`}
                                    className="overflow-hidden rounded-md border border-[#d9e1db] bg-white shadow-[0_8px_24px_rgba(24,52,42,0.06)]"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-[#e4eae4]">
                                        {property.picture?.thumbnail && (
                                            <Link
                                                href={`/properties/${property._id}`}
                                            >
                                                <img
                                                    src={
                                                        property.picture
                                                            .thumbnail
                                                    }
                                                    alt={
                                                        property.nickname ?? ''
                                                    }
                                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        )}
                                    </div>

                                    <div className="space-y-4 p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 space-y-2">
                                                <h2 className="text-lg leading-snug font-semibold text-[#17372e]">
                                                    <Link
                                                        href={`/properties/${property._id}`}
                                                    >
                                                        {property.nickname ??
                                                            property.title ??
                                                            'Property'}
                                                    </Link>
                                                </h2>
                                                <PropertyTypeBadge
                                                    propertyType={
                                                        property.propertyType
                                                    }
                                                />
                                            </div>
                                            <p className="shrink-0 text-base font-semibold text-[#a34f32]">
                                                {formatPrice(
                                                    property.prices
                                                        ?.basePrice ?? null,
                                                    property.prices?.currency ??
                                                        null,
                                                )}{' '}
                                                / Night
                                            </p>
                                        </div>

                                        <p className="text-sm leading-relaxed text-[#586a62]">
                                            {property.address?.full}
                                        </p>

                                        <PropertyReviews
                                            reviews={property.reviews}
                                            compact
                                        />

                                        <dl className="grid grid-cols-3 border-t border-[#e5eae6] pt-4 text-sm">
                                            <div>
                                                <dt className="text-xs text-[#738178]">
                                                    Guests
                                                </dt>
                                                <dd className="mt-1 font-medium text-[#263b33]">
                                                    {property.accommodates ??
                                                        '—'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs text-[#738178]">
                                                    Beds
                                                </dt>
                                                <dd className="mt-1 font-medium text-[#263b33]">
                                                    {property.beds ?? '—'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs text-[#738178]">
                                                    Bathrooms
                                                </dt>
                                                <dd className="mt-1 font-medium text-[#263b33]">
                                                    {property.bathrooms ?? '—'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="border-t border-[#d8e0d9] py-8 text-sm text-[#586a62]">
                            No properties found.
                        </p>
                    )}

                    <PropertyPagination
                        total={properties.pagination.total}
                        nextCursor={properties.pagination.cursor.next}
                    />
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
