
export default function ResearchProgressModalComponent({
    researchProgressModalIsOpen,
    messageResearchStatus,
    setResearchProgressModalIsOpen,
}: Readonly<{
    researchProgressModalIsOpen: boolean;
    messageResearchStatus: string;
    setResearchProgressModalIsOpen: (value: boolean) => void;
}>) {

    return (<section 
        className={`${!researchProgressModalIsOpen && "hidden"} 
        
        absolute top-0 left-0 right-0 bottom-0 w-full h-full 
        z-50 bg-black bg-opacity-30 flex  px-12 py-16`}>
            <div className="border-2 bg-slate-500 w-full h-full p-4 rounded-lg">
                <div className="text-white text-lg font-bold">
                    Researching... Please wait
                </div>

                
                <div className="text-white text-sm">{messageResearchStatus}</div>;
                <div className="flex justify-end h-full items-end py-12">
                    <button onClick={() => setResearchProgressModalIsOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg ">
                        X
                    </button>
                </div>
            </div>
        </section>);
}