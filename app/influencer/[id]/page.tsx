
import InfluencerClaimSectionComponent from "@/components/influencer-details/claims-filters";
import ClaimsListSectionComponent from "@/components/influencer-details/claims-list";
import InfluencerStatsSectionComponent from "@/components/influencer-details/influencer-stats-cards";
import BackToDashboardComponent from "@/components/reusables/go-back-to-dashboard-button";
import getPrismaClient from "@/config/prisma-client";
import { formatTwitterHandle } from "@/utils/string-formatters";
import Image from "next/image";
import { notFound } from "next/navigation";

// get id from params
export default async function InfluencerDetailsPage({ 
    params
 }: Readonly<{
    params: Promise<{ id: string }>;
 }>) {
    // get twitter handle from params
    const twitterHandle:string = formatTwitterHandle((await params).id);

    // we are going to use the id and the prisma orm to get the influencer details
    // first call the prisma singleton client
    const pgClient = await getPrismaClient();

    // get influencer details using id twitter handle
    // include the influencer claims and the category name for both the influencer and the claims. in the influencer the claims is an array of claims called Claim[] and the category name on both is category.name
    const influencer = await pgClient.influencer.findUnique({
        where: {
            twitterHandle: twitterHandle
        },
        include: {
            Claim: {
                include: {
                    category: {
                        select: {
                            name: true
                        },
                    },
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    // if influencer is not found return 404 page
    if (!influencer) {
        notFound();
    }

    return (
        <main id="influencer-page" className="p-4 min-h-screen max-w-4xl mx-auto gap-3">
            <div className="">
                <BackToDashboardComponent/>
            </div>
            <Image src={"/images/profile-picture.png"} alt={influencer.name} width={50} height={50} className="rounded-full"/>
            <h1 className="text-3xl font-bold">
                {influencer.name}
            </h1>
            <p className="">
                {influencer.description}
            </p>

            <InfluencerStatsSectionComponent/>
            <InfluencerClaimSectionComponent twitterHandle={twitterHandle}/>

            <ClaimsListSectionComponent claimList={influencer.Claim}/>
        </main>
    );
}