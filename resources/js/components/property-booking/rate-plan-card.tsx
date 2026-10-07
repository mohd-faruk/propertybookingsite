import { formatPrice } from '@/lib/utils';
import type { QuoteRatePlan } from './types';

type RatePlanCardProps = {
    plan: QuoteRatePlan;
    index: number;
    selected: boolean;
    onSelect: (id: string) => void;
};

function formatPolicy(policy?: string) {
    return policy?.replaceAll('_', ' ') || 'Cancellation details unavailable';
}

export default function RatePlanCard({
    plan,
    index,
    selected,
    onSelect,
}: RatePlanCardProps) {
    const money = plan.ratePlan.money;
    const total =
        typeof money?.subTotalPrice === 'number'
            ? money.subTotalPrice + (money.totalTaxes ?? 0)
            : undefined;
    const currency = money?.currency;
    const planId = plan.ratePlan._id;

    return (
        <article
            className={`rounded-md border bg-white p-5 sm:p-6 ${
                selected
                    ? 'border-[#a34f32] ring-1 ring-[#a34f32]'
                    : 'border-[#d8e0d9]'
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                    <input
                        type="radio"
                        name="selectedRatePlan"
                        value={planId}
                        checked={selected}
                        required
                        onChange={() => onSelect(planId)}
                        className="mt-1 accent-[#a34f32]"
                    />
                    <span>
                        <span className="block font-semibold text-[#17372e]">
                            {plan.ratePlan.name || `Rate plan ${index + 1}`}
                        </span>
                        <span className="mt-1 block text-sm text-[#738178] capitalize">
                            {formatPolicy(plan.ratePlan.cancellationPolicy)}
                        </span>
                    </span>
                </label>
                <p className="text-lg font-semibold text-[#a34f32]">
                    {formatPrice(total, currency)}
                    <span className="ml-1 text-xs font-normal text-[#738178]">
                        total
                    </span>
                </p>
            </div>

            <details className="mt-4 border-t border-[#e5ebe5] pt-3">
                <summary className="cursor-pointer text-sm font-medium text-[#40554b]">
                    Price and rate details
                </summary>
                <div className="mt-3 text-sm">
                    <h3 className="font-medium text-[#17372e]">
                        Price breakdown
                    </h3>
                    {money?.invoiceItems && money.invoiceItems.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                            {money.invoiceItems.map((item, itemIndex) => (
                                <li
                                    key={`${item.title}-${itemIndex}`}
                                    className="flex justify-between gap-4 text-[#586a62]"
                                >
                                    <span>{item.title || 'Charge'}</span>
                                    <span>
                                        {formatPrice(
                                            item.amount,
                                            item.currency || currency,
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2 text-[#738178]">
                            Itemized charges are not available.
                        </p>
                    )}
                </div>
            </details>
        </article>
    );
}
