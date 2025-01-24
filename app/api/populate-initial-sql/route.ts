import getPrismaClient from "@/config/prisma-client";
import InfluentialAccounts from "../../../LLM/influential-accounts.json";
export async function POST() {
    // We will get the connection to the database getClient

    const pgClient = getPrismaClient();

    // create categories nutrition, fitness, medicine, mental health
    await pgClient.category.createMany({
        data: [
            { name: "Nutrition" },
            { name: "Fitness" },
            { name: "Medicine" },
            { name: "Mental Health" }
        ]
    });

    // now add Influencers, their names and twitter handles are located in ../../LLM/influencial-accounts.json
    const influentialAccountsArray = InfluentialAccounts as Array<{ name: string, twitterHandle: string }>;
    
    // create the influencers only if the twitter handle is unique
    await pgClient.influencer.createMany({
        data: influentialAccountsArray
    });
    
    // close the client
    await pgClient.$disconnect();

    // return success message
    return Response.json({ message: "Success" });
}