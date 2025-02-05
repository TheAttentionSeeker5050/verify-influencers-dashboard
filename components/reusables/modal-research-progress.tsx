import { useEffect } from "react";


export default function ResearchProgressModalComponent({
    researchProgressModalIsOpen,
    messageResearchStatus,
}: Readonly<{
    researchProgressModalIsOpen: boolean;
    messageResearchStatus: string;
}>) {

    // console.log("researchProgressStringStack", researchProgressStringStack);

    // useEffect(() => {
    // }, [researchProgressStringStack]);

    return (<section className={`${!researchProgressModalIsOpen && "hidden"} 
        absolute top-0 left-0 right-0 bottom-0 w-full h-full 
        z-50 bg-black bg-opacity-30 flex items-center justify-center px-12 py-16`}>
            <div className="border-2 bg-slate-500 w-full h-full p-4 rounded-lg">
                <div className="text-white text-lg font-bold">
                    Researching... Please wait
                </div>

                
                <div className="text-white text-sm">{messageResearchStatus}</div>;
            </div>
        </section>);
}