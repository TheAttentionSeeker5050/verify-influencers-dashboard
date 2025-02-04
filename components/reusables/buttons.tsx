export function PrimaryColorActionButton({
    title, action, className, disabled, buttonType
}: Readonly<{
    title: string;
    action?: () => void;
    className?: string;
    disabled?: boolean;
    buttonType?: "button" | "submit" | "reset";
}>) {
    if (!buttonType) buttonType = "button";
    return (
        <button type={buttonType}
        onClick={action} className={`py-1 px-2 text-white rounded-md border-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:pointer-none disabled:border-0 ${className}`} disabled={disabled}>
            <p>{title}</p>
        </button>
    )
}