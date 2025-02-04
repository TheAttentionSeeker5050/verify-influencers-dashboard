

export default function ResearchProgressModalComponent({
    researchProgressModalIsOpen,
    researchProgressStringStack,
}: Readonly<{
    researchProgressModalIsOpen: boolean;
    researchProgressStringStack: string[];
}>) {

    // console.log("researchProgressStringStack", researchProgressStringStack);
    return (<section className={`${!researchProgressModalIsOpen && "hidden"} 
        absolute top-0 left-0 right-0 bottom-0 w-full h-full 
        z-50 bg-black bg-opacity-30 flex items-center justify-center px-12 py-16`}>
            <div className="border-2 bg-slate-500 w-full h-full p-4 rounded-lg">
                Loading...

                {researchProgressStringStack.map((progressString, index) => (
                    <div key={index} className="text-white text-sm">{progressString}</div>
                ))}
            </div>
        </section>);
}