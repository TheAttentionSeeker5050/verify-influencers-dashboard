export default function LoadingWheelModalComponent({
    loadingWheelModalIsOpen,
}: Readonly<{
    loadingWheelModalIsOpen: boolean;
}>) {


    return (<div className={`${!loadingWheelModalIsOpen && "hidden"}
    `}>Loading...</div>);
}