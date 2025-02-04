import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackToDashboardComponent() {
    return (
        <Link href="/" className={`text-emerald-500`} >
            {/* add font awesome arrow key left */}
            <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer mr-2" />
            <span>Go Back to Dashboard</span>
        </Link>
    );
}