
export default function ToggleSwitchComponent({
    label,
    isOn,
    setIsOn,
} : Readonly<{
    label: string,
    isOn: boolean,
    setIsOn: (isOn: boolean) => void,
}>
) {

    const handleToggle = () => {
        setIsOn(!isOn);
    };
    
    return (
        <div className="flex items-center space-x-4">
          {/* Label */}
          <span className="text-gray-700 font-medium">{label}</span>
    
          {/* Toggle Switch */}
          <div
            className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isOn ? "bg-green-500" : "bg-gray-300"
            }`}
            onClick={handleToggle}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                isOn ? "translate-x-6" : ""
              }`}
            />
          </div>
        </div>
    );
}