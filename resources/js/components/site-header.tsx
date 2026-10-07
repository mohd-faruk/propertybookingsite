import { Link } from '@inertiajs/react';

export default function SiteHeader() {
    return (
        <header className="border-b border-[#d8e0d9] bg-[#fbfcf9]">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-5 sm:px-8"
            >
                <Link
                    href="/"
                    className="text-sm font-medium text-[#53665e] transition-colors hover:text-[#193c32]"
                >
                    Home
                </Link>
                <Link
                    href="/properties"
                    className="text-sm font-semibold text-[#193c32] transition-colors hover:text-[#a34f32]"
                >
                    Property collection
                </Link>
            </nav>
        </header>
    );
}
