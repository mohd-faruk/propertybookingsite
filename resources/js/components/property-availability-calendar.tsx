import { format, startOfMonth } from 'date-fns';
import type { CSSProperties } from 'react';
import { DayPicker, TZDate, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';

export type AvailableDate = {
    date: string;
    minNights: number;
    maxNights: number;
    status: 'available' | 'unavailable' | 'reserved' | 'booked';
};

type PropertyAvailabilityCalendarProps = {
    availableDates: AvailableDate[];
    selected?: DateRange;
    onSelect?: (range: DateRange | undefined) => void;
    timeZone?: string;
    readOnly?: boolean;
};

export default function PropertyAvailabilityCalendar({
    availableDates,
    selected,
    onSelect,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    readOnly = false,
}: PropertyAvailabilityCalendarProps) {
    const availabilityByDate = new Map(
        availableDates.map((availableDate) => [
            availableDate.date,
            availableDate,
        ]),
    );
    const dates = availableDates
        .map((availableDate) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(availableDate.date)) {
                return null;
            }
            const [year, month, day] = availableDate.date
                .split('-')
                .map(Number);
            const date = TZDate.tz(timeZone, year, month - 1, day);
            return date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
                ? date
                : null;
        })
        .filter((date): date is TZDate => date !== null)
        .sort((first, second) => first.getTime() - second.getTime());
    const startAvailability =
        selected?.from && !selected.to
            ? availabilityByDate.get(format(selected.from, 'yyyy-MM-dd'))
            : undefined;
    const firstAvailability = dates[0]
        ? availabilityByDate.get(format(dates[0], 'yyyy-MM-dd'))
        : undefined;
    const stayRules = startAvailability ?? firstAvailability;

    if (dates.length === 0) {
        return (
            <p className="mt-4 text-sm text-[#738178]">
                Availability is not currently listed.
            </p>
        );
    }

    return (
        <DayPicker
            mode="range"
            selected={
                readOnly
                    ? (selected ?? { from: undefined, to: undefined })
                    : selected
            }
            onSelect={readOnly ? undefined : onSelect}
            timeZone={timeZone}
            noonSafe
            excludeDisabled
            disabled={(date) => {
                return (
                    availabilityByDate.get(format(date, 'yyyy-MM-dd'))
                        ?.status !== 'available'
                );
            }}
            min={stayRules?.minNights}
            max={stayRules?.maxNights}
            startMonth={startOfMonth(dates[0])}
            endMonth={startOfMonth(dates[dates.length - 1])}
            modifiers={{
                available: (date) =>
                    availabilityByDate.get(format(date, 'yyyy-MM-dd'))
                        ?.status === 'available',
            }}
            modifiersClassNames={{
                available: 'font-semibold text-[#1d6b45]',
            }}
            style={
                {
                    '--rdp-accent-color': '#a34f32',
                    '--rdp-accent-background-color': '#f3e5df',
                    '--rdp-day_button-border-radius': '4px',
                } as CSSProperties
            }
        />
    );
}
