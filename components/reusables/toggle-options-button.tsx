export default function ToggleOptionButtonComponent({
    title, subTitle, currentStateOptions, onClickSelectionAction, selectionButtonOption, className
}: Readonly<{
    title: string;
    subTitle?: string;
    currentStateOptions: string | string[]; // This is the current state option, if it matches the button option, we will change the button style
    // currentStateOptionArray?: string[]; // This is the current state option, if it matches the button option, we will change the button style
    onClickSelectionAction: (selectOption: string) => void; // we will pass this function to the onClick event
    selectionButtonOption: string; // This is the value we will compare the current state option with
    className?: string;
}>) {

    const comparisonFunction = () => {
        // first, if currentStateOption is an array, we will check if the selectionButtonOption is included in the array
        if (Array.isArray(currentStateOptions)) {
            return currentStateOptions.includes(selectionButtonOption);
        } else if (typeof currentStateOptions === "string") {
            return currentStateOptions === selectionButtonOption;
        }

        return false;
    }
    return (
        <button type="button" id="research-focus-specific-influencer" 
            onClick={() => onClickSelectionAction(selectionButtonOption)}
            className={`grow ${className}  p-4 text-white flex flex-col items-center justify-center gap-2 rounded-md border-2 ${ comparisonFunction() ? "border-teal-400 bg-teal-950 hover:bg-teal-900": "border-slate-300 bg-gray-800 hover:bg-gray-700"}`}>
            <p>{title}</p>
            {subTitle && <p className="text-sm text-slate-400">{subTitle}</p>}
        </button>
    )
}