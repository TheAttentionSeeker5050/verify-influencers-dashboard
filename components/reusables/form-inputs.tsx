
export function PrimaryTextInput({
    value, onChange, placeholder, className, name
}: Readonly<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    className?: string;
    name: string;
}>) {
    return (
        <input type="text" value={value} onChange={onChange} name={name} placeholder={placeholder} className={`bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700 ${className}`}/>
    )
}

export function PrimaryTextArea({
    value, onChange, placeholder, className, name, rowSize, resizable
}: Readonly<{
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    className?: string;
    name: string;
    rowSize?: number;
    resizable?: boolean;
}>) {
    if (!rowSize) rowSize = 3;
    if (!resizable) resizable = false;

    // This is to check if the form is static or has a dynamic onChange function and state value
    const isStaticForm = !onChange;

    return (isStaticForm ?
        <textarea name={name} placeholder={placeholder} className={`bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700 ${className}`} rows={rowSize} style={{resize: resizable ? "both" : "none"}}></textarea>
        :
        <textarea value={value} onChange={onChange} name={name} placeholder={placeholder} className={`bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700 ${className}`} rows={rowSize} style={{resize: resizable ? "both" : "none"}}></textarea>)
}