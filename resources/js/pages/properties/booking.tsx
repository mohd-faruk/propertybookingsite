import { Head, Link, WhenVisible } from '@inertiajs/react';
import PropertyBookingFlow from '@/components/property-booking-flow';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import type { AvailableDate } from '@/components/property-availability-calendar';
import type { Property } from '@/types';

type PropertyBookingProps = {
    property: Property;
    availableDates: AvailableDate[];
};

export default function PropertyBooking({
    property,
    availableDates,
}: PropertyBookingProps) {
    const title = property.nickname || 'Property booking';

    return (
        <div className="flex min-h-screen flex-col bg-[#f3f6f2] text-[#172923]">
            <Head title={`Book ${title}`} />
            <SiteHeader />

            <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
                <Link
                    href={`/properties/${encodeURIComponent(property._id ?? '')}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#53665e] hover:text-[#193c32]"
                >
                    <span aria-hidden="true">←</span>
                    Back to property
                </Link>
                <div className="mt-6">
                    <h1 className="text-3xl font-semibold text-[#17372e]">
                        Book {title}
                    </h1>
                    {property.address?.full && (
                        <p className="mt-2 text-sm text-[#738178]">
                            {property.address.full}
                        </p>
                    )}
                </div>

                <section className="mt-8 border-t border-[#d8e0d9] py-8 lg:py-10">
                    <WhenVisible
                        data="availableDates"
                        fallback={
                            <div
                                className="h-80 animate-pulse rounded-md bg-[#e5ebe5]"
                                aria-label="Loading availability"
                            />
                        }
                    >
                        <PropertyBookingFlow
                            property={property}
                            availableDates={availableDates}
                            timeZone={property.timezone}
                        />
                    </WhenVisible>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
