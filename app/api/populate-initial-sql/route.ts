import getPrismaClient from "@/config/prisma-client";
import InfluentialAccounts from "../../../LLM/influential-accounts.json";
export async function POST() {
    // We will get the connection to the database getClient

    const client = getPrismaClient();

    // create categories nutrition, fitness, medicine, mental health
    await client.category.createMany({
        data: [
            { name: "Nutrition" },
            { name: "Fitness" },
            { name: "Medicine" },
            { name: "Mental Health" }
        ]
    });

    // now add Influencers, their names and twitter handles are located in ../../LLM/influencial-accounts.json
    const influentialAccountsArray = InfluentialAccounts as Array<{ name: string, twitterHandle: string }>;
    
    await client.influencer.createMany({
        data: influentialAccountsArray
    });
    

    // return success message
    return Response.json({ message: "Success" });
}