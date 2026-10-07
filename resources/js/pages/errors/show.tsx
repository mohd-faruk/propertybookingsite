import { Head, Link } from '@inertiajs/react';

type ErrorPageProps = {
    status: number;
    message: string;
};

export default function ErrorPage({ status, message }: ErrorPageProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[#f3f6f2] text-[#172923]">
            <Head title={`${status} - Something went wrong`} />
            <main className="flex flex-1 items-center justify-center px-5 py-16">
                <section
                    aria-labelledby="error-title"
                    className="w-full max-w-xl rounded-md border border-[#d9e1db] bg-white p-8 text-center shadow-[0_8px_24px_rgba(24,52,42,0.06)] sm:p-12"
                >
                    <p className="text-sm font-semibold tracking-[0.2em] text-[#a34f32]">
                        ERROR {status}
                    </p>
                    <h1
                        id="error-title"
                        className="mt-4 text-2xl font-semibold text-[#17372e] sm:text-3xl"
                    >
                        We couldn&apos;t complete your request
                    </h1>
                    <p className="mt-4 leading-7 text-[#586a62]">{message}</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#a34f32] px-5 text-sm font-semibold text-white transition hover:bg-[#873e27]"
                        >
                            Try again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#9eafa3] px-5 text-sm font-semibold text-[#263b33] transition hover:bg-[#f3f6f2]"
                        >
                            Go to home
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
