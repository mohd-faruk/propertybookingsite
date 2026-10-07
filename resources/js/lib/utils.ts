import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amount?: number | null, currency?: string | null) {
    if (amount == null || !currency) {
        return 'Price unavailable';
    }

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toLocaleString('en-US')} ${currency}`;
    }
}
