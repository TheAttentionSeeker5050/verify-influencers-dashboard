import getPrismaClient from "@/config/prisma-client";
import { buildInfluencerDTO } from "@/data/SQL/influencers.sqldata";


export async function GET() {
    // initiate the Postgres client
    const pgClient = getPrismaClient();

    if (!pgClient) return Response.json({ message: "Failed to connect to the database" }, { status: 500 });

    try {
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

        // if no influencers are found
        if (influencers.length === 0) return Response.json({ message: "Influencers list is empty" }, { status: 404 });

        const mappedInfluencers = influencers.map(influencer => {
            return buildInfluencerDTO(influencer);
        });
        
        return Response.json({ message: "Success", data: 
            mappedInfluencers
         });
    } catch (error) {
        return Response.json({ message: "Error while getting the list of influencers", error: error }, { status: 500 });
    } finally {
        // disconnect the client
        await pgClient.$disconnect();
    }

}


