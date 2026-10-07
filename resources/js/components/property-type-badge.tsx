type PropertyTypeBadgeProps = {
    propertyType?: string | null;
};

function formatPropertyType(propertyType: string) {
    return propertyType
        .toLowerCase()
        .split(/[_ ]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function PropertyTypeBadge({
    propertyType,
}: PropertyTypeBadgeProps) {
    if (!propertyType) {
        return null;
    }

    return (
        <span className="inline-flex max-w-full items-center border border-[#c9d5cc] bg-[#edf2ed] px-2.5 py-1 text-xs font-medium text-[#40554b]">
            {formatPropertyType(propertyType)}
        </span>
    );
}
