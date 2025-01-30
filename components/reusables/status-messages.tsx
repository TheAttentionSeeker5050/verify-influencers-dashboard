"use client";

import { useEffect, useState } from "react";

export function AppStatusMessagesWithCustomStateComponent({
    successMessage = null,
    errorMessage = null,
    timeout = 3000,
}: Readonly<{
    successMessage?: string | null;
    errorMessage?: string | null;
    timeout?: number;
}>) {

    const [successMessageState, setSuccessMessageState] = useState<string | null>(successMessage);
    const [errorMessageState, setErrorMessageState] = useState<string | null>(errorMessage);

    useEffect(() => {
        if (successMessage || errorMessage) {
            // If there is a success message or error message, set the state            
            setTimeout(() => {
                setSuccessMessageState(null);
                setErrorMessageState(null);
            }, timeout);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return AppStatusMessagesComponent({
        successMessage: successMessageState,
        errorMessage: errorMessageState
    });
}

export function AppStatusMessagesComponent({
    successMessage = null,
    errorMessage = null,
}: Readonly<{
    successMessage?: string | null;
    errorMessage?: string | null;
}>) {
    return (<section id="status-messages-section" className="flex flex-col gap-3">
    {successMessage && (
        <div className="p-4 bg-emerald-200 text-emerald-700 rounded-md">{successMessage}</div>
    )}
    {!successMessage && errorMessage && (
        <div className="p-4 bg-red-200 text-red-700 rounded-md">{errorMessage}</div>
    )}
</section>)
}