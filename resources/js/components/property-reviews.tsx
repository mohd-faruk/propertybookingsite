import type { Property } from '@/types';

type PropertyReviewsProps = {
    reviews?: Property['reviews'] | null;
    compact?: boolean;
};

export default function PropertyReviews({
    reviews,
    compact = false,
}: PropertyReviewsProps) {
    const average = reviews?.avg;
    const total = reviews?.total ?? 0;

    if (average === undefined || total === 0) {
        return <p className="text-sm text-[#738178]">No reviews yet</p>;
    }

    return (
        <p
            className={`inline-flex items-center gap-1.5 text-sm text-[#40554b] ${compact ? 'text-xs' : ''}`}
            aria-label={`Rated ${average.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'review' : 'reviews'}`}
        >
            <span aria-hidden="true" className="text-[#a34f32]">
                ★
            </span>
            <span className="font-semibold text-[#263b33]">
                {average.toFixed(1)}
            </span>
            <span className="text-[#738178]">
                ({total} {total === 1 ? 'review' : 'reviews'})
            </span>
        </p>
    );
}
