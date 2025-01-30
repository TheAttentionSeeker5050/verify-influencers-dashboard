import getPrismaClient from "@/config/prisma-client";


export async function GET(request: Request) {
    // get the query parameter from the q query string
    const url : URL = new URL(request.url)
    const influencerNameStr : string = url.searchParams.get('q') ?? '';

    // if no infleuncer name is provided, dont do anything for the moment because we will return the first 10 influencers in the database

    // initiate the Postgres client
    const pgClient = getPrismaClient();

    if (!pgClient) return Response.json({ message: "Failed to connect to the database" }, { status: 500 });

    // inside a try catch block attempt to find the influencers by name, or twitter handle that partially matches the influencerNameStr
    try {
        // if no string is provided, return the first 10 influencers
        // only include in the response the name, id, twitterHandle
        if (influencerNameStr === '') {
            const influencers = await pgClient.influencer.findMany({
                take: 10,
                select: {
                    id: true,
                    name: true,
                    twitterHandle: true
                }
            });


            // if no influencers are found
            if (influencers.length === 0) return Response.json({ message: "Influencers list is empty", data: [] }, { status: 200 });

            return Response.json({ message: "Success", data: influencers });
        } else {
            // filter by name or twitter handle partial match no more than 10 influencers and not case sensitive
            const influencers = await pgClient.influencer.findMany({
                take: 10,
                where: {
                    OR: [
                        {
                            name: {
                                contains: influencerNameStr,
                                mode: 'insensitive'
                            }
                        },
                        {
                            twitterHandle: {
                                contains: influencerNameStr,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    twitterHandle: true
                }
            });

            // if no influencers are found
            if (influencers.length === 0) return Response.json({ message: "No influencers found", data: [] }, { status: 200 });

            return Response.json({ message: "Success", data: influencers }, { status: 200 });
        }
    } catch (error) {
        return Response.json({ message: "Error while getting the list of influencers", error: error }, { status: 500 });
    } finally {
        // disconnect the client
        await pgClient.$disconnect();
    }

}