
import { formatPercentage } from "@/utils/stringFormatters";
import { Claim } from "@prisma/client";
import Link from "next/link";


export default function ClaimsListSectionComponent({claimList} : Readonly<{ claimList: Claim[] }>) {

    return (
        <section id="influencer-claim-list-section" className="">
            <h2>Claims</h2>
            {
                claimList.map((claim) => {
                    return (<div key={claim.id}>
                        <div>
                            <span>
                                {formatPercentage(claim.trustScore)}
                            </span>
                            <span>
                                Trust Score
                            </span>
                        </div>
                        <p>
                            <span>{claim.verificationStatus}</span>
                            <span>Icon</span>
                        </p>
                        <h3>{claim.claim}</h3>
                        <Link href={claim.claimSource || "#"}>
                            View Source <span>Icon</span>
                        </Link>
                        <h4>AI Analysis</h4>
                        <p>{claim.aiAnalysis}</p>
                    </div>)
                })
            }

            <p>Showing 10 claims per page</p>
        </section>
    );
}