export type GuestCounts = {
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfInfants: number;
    numberOfPets: number;
};

export type GuestInfo = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

export type QuoteInvoiceItem = {
    title?: string;
    amount?: number;
    currency?: string;
};

export type QuoteDay = {
    date?: string;
    price?: number;
    currency?: string;
};

export type QuoteMoney = {
    currency?: string;
    subTotalPrice?: number;
    totalTaxes?: number;
    invoiceItems?: QuoteInvoiceItem[];
};

export type QuoteRatePlan = {
    inquiryId?: string;
    days?: QuoteDay[];
    ratePlan: {
        _id: string;
        name?: string;
        cancellationPolicy?: string;
        money?: QuoteMoney;
    };
};

export type ReservationQuote = {
    _id: string;
    rates: {
        ratePlans: QuoteRatePlan[];
    };
};

export const initialGuestCounts: GuestCounts = {
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfInfants: 0,
    numberOfPets: 0,
};

export const initialGuestInfo: GuestInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
};

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isQuoteRatePlan(value: unknown): value is QuoteRatePlan {
    return (
        isRecord(value) &&
        isRecord(value.ratePlan) &&
        typeof value.ratePlan._id === 'string' &&
        (value.days === undefined || Array.isArray(value.days))
    );
}

export function isReservationQuote(value: unknown): value is ReservationQuote {
    return (
        isRecord(value) &&
        typeof value._id === 'string' &&
        isRecord(value.rates) &&
        Array.isArray(value.rates.ratePlans) &&
        value.rates.ratePlans.every(isQuoteRatePlan)
    );
}

export function getRatePlanTotal(plan: QuoteRatePlan) {
    const money = plan.ratePlan.money;
    if (typeof money?.subTotalPrice !== 'number') {
        return undefined;
    }

    return money.subTotalPrice + (money.totalTaxes ?? 0);
}

export function getPaymentProviderId(value: unknown): string | undefined {
    if (!isRecord(value)) {
        return undefined;
    }

    for (const key of ['providerId', 'paymentProviderId', '_id', 'id']) {
        if (typeof value[key] === 'string') {
            return value[key];
        }
    }

    for (const key of ['paymentProvider', 'provider', 'data']) {
        const providerId = getPaymentProviderId(value[key]);
        if (providerId) {
            return providerId;
        }
    }

    return undefined;
}
