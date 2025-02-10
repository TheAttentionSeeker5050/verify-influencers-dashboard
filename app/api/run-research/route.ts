
// Rank profiles by their influence scores to identify the top 50.
export async function POST(request: Request) {
    const formData = await request.formData();

    const influencerId = formData.get("influencer-id");
    
    if (!influencerId || typeof influencerId !== "string") {
        return Response.json({ message: "Influencer ID is required" }, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // We will get the connection to the database getClient
    const pgClient = getPrismaClient();

    // get the tweets of the influencer
    const mongoClient = getMongooseClient();
    
    try {
        // first get influencer data (we will need this for follower count)
        const influencer = await pgClient.influencer.findUnique({
            where: {
                id: influencerId
            }
        });

        if (!influencer) {
            return Response.json({ message: "Influencer not found" }, { status: 404, headers: { "Content-Type": "application/json" } });
        }

        // get the claims table data, filter by influencerId and verification status as not pending
        const claims = await pgClient.claim.findMany({
            where: {
                influencerId,
                verificationStatus: {
                    not: "pending"
                }
            }
        });

        // if there are no claims, we can return a message and 200
        if (!claims.length) {
            return Response.json({ message: "No claims need to be verified" }, { status: 200, headers: { "Content-Type": "application/json" } });
        }
        

    } catch (error) {

    }
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}