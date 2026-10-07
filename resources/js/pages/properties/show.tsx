import { Head, Link, WhenVisible } from '@inertiajs/react';
import { useState } from 'react';
import PropertyAvailabilityCalendar, {
    type AvailableDate,
} from '@/components/property-availability-calendar';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import PropertyReviews from '@/components/property-reviews';
import PropertyTypeBadge from '@/components/property-type-badge';
import type { Property } from '@/types';
import { formatPrice } from '@/lib/utils';

type PropertyShowProps = {
    property: Property;
    availableDates: AvailableDate[];
};

const descriptionSections = [
    ['space', 'The space'],
    ['access', 'Guest access'],
    ['neighborhood', 'The neighborhood'],
    ['transit', 'Getting around'],
] as const;

function amenityLabel(amenity: string) {
    return amenity
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

type ReadMoreTextProps = {
    text: string;
    limit?: number;
};

function ReadMoreText({ text, limit = 260 }: ReadMoreTextProps) {
    const [expanded, setExpanded] = useState(false);
    const canExpand = text.length > limit;

    return (
        <>
            <p
                className={`mt-4 leading-7 whitespace-pre-line text-[#40554b] ${
                    canExpand && !expanded ? 'line-clamp-4' : ''
                }`}
            >
                {text}
            </p>
            {canExpand && (
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                    className="mt-2 text-sm font-semibold text-[#a34f32] underline underline-offset-2 hover:text-[#873e27]"
                >
                    Read {expanded ? 'less' : 'more'}
                </button>
            )}
        </>
    );
}

function AmenityList({ amenities }: { amenities: string[] }) {
    const [expanded, setExpanded] = useState(false);
    const visibleAmenities = expanded ? amenities : amenities.slice(0, 8);

    return (
        <>
            <ul className="mt-4 flex flex-wrap gap-2">
                {visibleAmenities.map((amenity) => (
                    <li
                        key={amenity}
                        className="rounded-full border border-[#d8e0d9] bg-white px-3 py-1.5 text-sm text-[#40554b]"
                    >
                        {amenityLabel(amenity)}
                    </li>
                ))}
            </ul>
            {amenities.length > 8 && (
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                    className="mt-3 text-sm font-semibold text-[#a34f32] underline underline-offset-2 hover:text-[#873e27]"
                >
                    Read {expanded ? 'less' : 'more'}
                </button>
            )}
        </>
    );
}

export default function PropertyShow({
    property,
    availableDates,
}: PropertyShowProps) {
    const title = property.nickname || 'Property details';

    return (
        <div className="flex min-h-screen flex-col bg-[#f3f6f2] text-[#172923]">
            <Head title={title} />
            <SiteHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8 sm:pt-8">
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#53665e] hover:text-[#193c32]"
                    >
                        <span aria-hidden="true">←</span>
                        All properties
                    </Link>
                </div>

                <section className="mx-auto max-w-7xl px-5 pt-5 pb-12 sm:px-8 sm:pt-7">
                    {(property.picture?.regular ??
                        property.picture?.thumbnail) && (
                        <div className="aspect-[16/9] max-h-[620px] overflow-hidden rounded-md bg-[#dfe7df]">
                            <img
                                src={
                                    property.picture.regular ??
                                    property.picture.thumbnail
                                }
                                alt={title}
                                className="h-full w-full object-cover"
                                fetchPriority="high"
                            />
                        </div>
                    )}

                    <div className="grid gap-10 border-b border-[#d8e0d9] py-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 lg:py-10">
                        <div>
                            <h1 className="text-3xl leading-tight font-semibold text-[#17372e] sm:text-4xl">
                                {title}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <PropertyTypeBadge
                                    propertyType={property.propertyType}
                                />
                                <PropertyReviews reviews={property.reviews} />
                            </div>
                            {property.address?.full && (
                                <p className="mt-3 text-sm leading-relaxed text-[#586a62]">
                                    {property.address.full}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-[#d8e0d9] pt-5 lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                            <span className="text-sm text-[#738178]">
                                Base price
                            </span>
                            <p className="text-2xl font-semibold text-[#a34f32]">
                                {formatPrice(
                                    property.prices?.basePrice,
                                    property.prices?.currency,
                                )}
                            </p>
                        </div>
                    </div>

                    <dl className="grid grid-cols-3 border-b border-[#d8e0d9] py-6 text-center sm:py-7">
                        <div className="px-2">
                            <dd className="text-xl font-semibold text-[#17372e]">
                                {property.accommodates ?? '—'}
                            </dd>
                            <dt className="mt-1 text-xs text-[#738178] sm:text-sm">
                                Guests
                            </dt>
                        </div>
                        <div className="border-r border-[#d8e0d9] px-2">
                            <dd className="text-xl font-semibold text-[#17372e]">
                                {property.beds ?? '—'}
                            </dd>
                            <dt className="mt-1 text-xs text-[#738178] sm:text-sm">
                                Beds
                            </dt>
                        </div>
                        <div className="border-r border-[#d8e0d9] px-2">
                            <dd className="text-xl font-semibold text-[#17372e]">
                                {property.bathrooms ?? '—'}
                            </dd>
                            <dt className="mt-1 text-xs text-[#738178] sm:text-sm">
                                Bathrooms
                            </dt>
                        </div>
                    </dl>

                    <div className="grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-10">
                        {property.publicDescription?.summary?.trim() && (
                            <section className="lg:col-span-2">
                                <h2 className="text-xl font-semibold text-[#17372e]">
                                    About the property
                                </h2>
                                <ReadMoreText
                                    text={property.publicDescription.summary}
                                />
                            </section>
                        )}

                        {descriptionSections.map(([field, heading]) => {
                            const description =
                                property.publicDescription?.[field]?.trim();
                            if (!description) {
                                return null;
                            }

                            return (
                                <section key={field}>
                                    <h2 className="text-xl font-semibold text-[#17372e]">
                                        {heading}
                                    </h2>
                                    <ReadMoreText text={description} />
                                </section>
                            );
                        })}

                        {(property.terms?.minNights !== undefined ||
                            property.terms?.maxNights !== undefined ||
                            property.defaultCheckInTime ||
                            property.defaultCheckOutTime ||
                            property.timezone) && (
                            <section>
                                <h2 className="text-xl font-semibold text-[#17372e]">
                                    Stay details
                                </h2>
                                <dl className="mt-4 space-y-3 text-sm">
                                    {property.terms?.minNights !==
                                        undefined && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-[#738178]">
                                                Minimum stay
                                            </dt>
                                            <dd className="font-medium text-[#17372e]">
                                                {property.terms.minNights}{' '}
                                                {property.terms.minNights === 1
                                                    ? 'night'
                                                    : 'nights'}
                                            </dd>
                                        </div>
                                    )}
                                    {property.terms?.maxNights !==
                                        undefined && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-[#738178]">
                                                Maximum stay
                                            </dt>
                                            <dd className="font-medium text-[#17372e]">
                                                {property.terms.maxNights}{' '}
                                                {property.terms.maxNights === 1
                                                    ? 'night'
                                                    : 'nights'}
                                            </dd>
                                        </div>
                                    )}
                                    {property.defaultCheckInTime && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-[#738178]">
                                                Check-in
                                            </dt>
                                            <dd className="font-medium text-[#17372e]">
                                                {property.defaultCheckInTime}
                                            </dd>
                                        </div>
                                    )}
                                    {property.defaultCheckOutTime && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-[#738178]">
                                                Check-out
                                            </dt>
                                            <dd className="font-medium text-[#17372e]">
                                                {property.defaultCheckOutTime}
                                            </dd>
                                        </div>
                                    )}
                                    {property.timezone && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-[#738178]">
                                                Local time zone
                                            </dt>
                                            <dd className="text-right font-medium text-[#17372e]">
                                                {property.timezone}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </section>
                        )}

                        {property.amenities &&
                            property.amenities.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-semibold text-[#17372e]">
                                        Amenities
                                    </h2>
                                    <AmenityList
                                        amenities={property.amenities}
                                    />
                                </section>
                            )}
                    </div>

                    <section className="grid gap-8 border-t border-[#d8e0d9] py-8 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:py-10">
                        <div className="h-full rounded-md border border-[#d8e0d9] bg-white p-5 sm:p-6">
                            <h2 className="text-xl font-semibold text-[#17372e]">
                                Availability
                            </h2>
                            <p className="mt-2 text-sm text-[#738178]">
                                Available dates are shown in the property’s
                                local time zone
                                {property.timezone
                                    ? ` (${property.timezone})`
                                    : ''}
                                .
                            </p>
                            <WhenVisible
                                data="availableDates"
                                fallback={
                                    <div
                                        className="mt-5 h-80 animate-pulse rounded-md bg-[#e5ebe5]"
                                        aria-label="Loading availability"
                                    />
                                }
                            >
                                <div className="mt-5 rounded-md bg-white p-5 sm:p-6">
                                    <PropertyAvailabilityCalendar
                                        availableDates={availableDates}
                                        timeZone={property.timezone}
                                        readOnly
                                    />
                                </div>
                            </WhenVisible>
                        </div>

                        <div className="flex h-full flex-col rounded-md border border-[#d8e0d9] bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-[#17372e]">
                                Ready to book your stay?
                            </h2>
                            <p className="mt-2 text-sm text-[#738178]">
                                Choose your dates and guest details to see
                                available rates and the full quote.
                            </p>
                            <Link
                                href={`/properties/${encodeURIComponent(property._id ?? '')}/booking`}
                                className="mt-5 inline-flex w-fit rounded-md bg-[#a34f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#873e27]"
                            >
                                Book this property
                            </Link>
                        </div>
                    </section>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
