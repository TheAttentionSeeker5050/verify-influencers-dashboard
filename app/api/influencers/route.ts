import getPrismaClient from "@/config/prisma-client";
import { buildInfluencerDTO } from "@/data/SQL/influencers.sqldata";


export async function GET() {
    // initiate the Postgres client
    const pgClient = getPrismaClient();

    if (!pgClient) return Response.json({ message: "Failed to connect to the database" }, { status: 500 });

    // get all influencers with relation names category.name
    const influencers = await pgClient.influencer.findMany({
        include: {
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    // disconnect the client
    await pgClient.$disconnect();

    const mappedInfluencers = influencers.map(influencer => {
        return buildInfluencerDTO(influencer);
    });
    
    return Response.json({ message: "Success", data: mappedInfluencers });
}


