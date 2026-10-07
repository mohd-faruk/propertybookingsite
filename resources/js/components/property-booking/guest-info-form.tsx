import type { FormEvent } from 'react';
import type { GuestInfo } from './types';

type GuestInfoFormProps = {
    guestInfo: GuestInfo;
    onChange: (guestInfo: GuestInfo) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
};

export default function GuestInfoForm({
    guestInfo,
    onChange,
    onSubmit,
    onBack,
}: GuestInfoFormProps) {
    function updateField(field: keyof GuestInfo, value: string) {
        onChange({ ...guestInfo, [field]: value });
    }

    return (
        <form
            onSubmit={onSubmit}
            className="mt-6 rounded-md border border-[#d8e0d9] bg-white p-5 sm:p-6"
        >
            <h3 className="text-lg font-semibold text-[#17372e]">
                Guest information
            </h3>
            <p className="mt-2 text-sm text-[#738178]">
                Enter the lead guest’s contact details to continue.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-[#40554b]">
                    First name
                    <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        maxLength={100}
                        value={guestInfo.firstName}
                        onChange={(event) =>
                            updateField('firstName', event.target.value)
                        }
                        className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                    />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-[#40554b]">
                    Last name
                    <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        maxLength={100}
                        value={guestInfo.lastName}
                        onChange={(event) =>
                            updateField('lastName', event.target.value)
                        }
                        className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                    />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-[#40554b]">
                    Email
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        maxLength={255}
                        value={guestInfo.email}
                        onChange={(event) =>
                            updateField('email', event.target.value)
                        }
                        className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                    />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-[#40554b]">
                    Phone number
                    <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        required
                        minLength={7}
                        maxLength={30}
                        value={guestInfo.phone}
                        onChange={(event) =>
                            updateField('phone', event.target.value)
                        }
                        className="w-full rounded-md border border-[#d8e0d9] px-3 py-2 text-[#17372e] outline-none focus:border-[#a34f32]"
                    />
                </label>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-md border border-[#d8e0d9] px-5 py-3 text-sm font-semibold text-[#40554b] transition hover:bg-[#f3f6f2]"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-[#a34f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#873e27]"
                >
                    Next
                </button>
            </div>
        </form>
    );
}
