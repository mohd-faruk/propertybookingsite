export default function SiteFooter() {
    return (
        <footer className="border-t border-[#d8e0d9] bg-[#fbfcf9]">
            <div className="mx-auto max-w-7xl px-5 py-5 text-sm text-[#617168] sm:px-8">
                &copy; {new Date().getFullYear()} Property collection
            </div>
        </footer>
    );
}
