import { useState } from 'react';
import type { FormEvent } from 'react';
import GuestInfoForm from './guest-info-form';
import RatePlanCard from './rate-plan-card';
import type { GuestInfo, QuoteRatePlan } from './types';

type RatePlanStepProps = {
    ratePlans: QuoteRatePlan[];
    selectedRatePlanId?: string;
    guestInfo: GuestInfo;
    onSelectRatePlan: (id: string) => void;
    onGuestInfoChange: (guestInfo: GuestInfo) => void;
    onNext: (event: FormEvent<HTMLFormElement>) => void;
    onPrevious: () => void;
};

export default function RatePlanStep({
    ratePlans,
    selectedRatePlanId,
    guestInfo,
    onSelectRatePlan,
    onGuestInfoChange,
    onNext,
    onPrevious,
}: RatePlanStepProps) {
    const [selectionError, setSelectionError] = useState(false);

    function submitNext(event: FormEvent<HTMLFormElement>) {
        if (!selectedRatePlanId) {
            event.preventDefault();
            setSelectionError(true);
            return;
        }

        onNext(event);
    }

    return (
        <section aria-labelledby="rate-plans-heading">
            <h2
                id="rate-plans-heading"
                className="text-xl font-semibold text-[#17372e]"
            >
                Available rate plans
            </h2>
            <p className="mt-2 text-sm text-[#738178]">
                Choose one rate plan. Expand a plan to review its price
                breakdown and nightly rates.
            </p>

            {ratePlans.length === 0 ? (
                <div className="mt-5 rounded-md border border-[#d8e0d9] bg-white p-5">
                    <p className="text-sm text-[#586a62]">
                        No rate plans are available for these dates and guest
                        details.
                    </p>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="mt-4 rounded-md border border-[#d8e0d9] px-5 py-3 text-sm font-semibold text-[#40554b] transition hover:bg-[#f3f6f2]"
                    >
                        Previous
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-5 grid gap-4">
                        {ratePlans.map((plan, index) => (
                            <RatePlanCard
                                key={plan.ratePlan._id}
                                plan={plan}
                                index={index}
                                selected={
                                    selectedRatePlanId === plan.ratePlan._id
                                }
                                onSelect={(id) => {
                                    onSelectRatePlan(id);
                                    setSelectionError(false);
                                }}
                            />
                        ))}
                    </div>
                    {selectionError && (
                        <p role="alert" className="mt-4 text-sm text-[#a33425]">
                            Select a rate plan before continuing.
                        </p>
                    )}
                    <GuestInfoForm
                        guestInfo={guestInfo}
                        onChange={onGuestInfoChange}
                        onSubmit={submitNext}
                        onBack={onPrevious}
                    />
                </>
            )}
        </section>
    );
}
