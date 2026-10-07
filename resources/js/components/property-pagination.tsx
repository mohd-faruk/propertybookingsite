import { Link, usePage } from '@inertiajs/react';

type PropertyPaginationProps = {
    total: number;
    nextCursor?: string | null;
};

export default function PropertyPagination({
    total,
    nextCursor,
}: PropertyPaginationProps) {
    const { url } = usePage();
    const queryString = url.split('?')[1] ?? '';
    const query = new URLSearchParams(queryString);

    if (nextCursor) {
        query.set('cursor', nextCursor);
    } else {
        query.delete('cursor');
    }

    return (
        <nav
            aria-label="Property pages"
            className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8e0d9] pt-5"
        >
            <p className="text-sm text-[#586a62]">
                {total} {total === 1 ? 'property' : 'properties'} found
            </p>
            {nextCursor && (
                <Link
                    href={`/properties?${query.toString()}`}
                    preserveScroll
                    className="inline-flex min-h-10 items-center gap-2 border border-[#9eafa3] px-4 text-sm font-medium text-[#263b33] transition-colors hover:bg-[#e7eee8]"
                >
                    Next page
                    <span aria-hidden="true">→</span>
                </Link>
            )}
        </nav>
    );
}
