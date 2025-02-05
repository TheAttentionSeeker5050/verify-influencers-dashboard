import getPrismaClient from "@/config/prisma-client";
import { formatTwitterHandle } from "@/utils/string-formatters";

// This post request will take details from the twitter API and update the influencer's details in the database. The following attributes are modifier: followersCount, trendDirection
export async function GET(request: Request) {

    // get the request slug id from the request
    // we use pop, it won't modify the url and it will return the last element of the array, which is our slug id (twitter handle)
    const twitterHandle = formatTwitterHandle(request.url.split("/").pop());

    if (!twitterHandle) return Response.json({ message: "Twitter handle not found" }, { status: 404 }); // this is not strictly necessary due to the route confuguration, but I dont like the linting errors so I added it in

    // initiate the Postgres client
    const pgClient = getPrismaClient();

    if (!pgClient) return Response.json({ message: "Failed to connect to the database" }, { status: 500 });

    // make a get request to the twitter API to get the influencer's details
    const url = `https://twitter154.p.rapidapi.com/user/details?username=${twitterHandle}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.TWITTER_API_KEY ?? "",
            'x-rapidapi-host': process.env.TWITTER_API_HOST ?? ""
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        // get the influencer's entry on the database
        const influencer = await pgClient.influencer.findUnique({
            where: {
                twitterHandle: twitterHandle
            }
        });

        let trendDirection = "";

        // we need to get the influencer's current follower count to determine the trend direction
        if (!!influencer?.followersCount && !!result?.follower_count) {
            trendDirection = influencer.followersCount < result.follower_count ? "up" : "down";
        }

        // if no influencer is found, return an error
        if (!influencer) return Response.json({ message: "Influencer not found" }, { status: 404 });

        // update the influencer's details
        await pgClient.influencer.update({
            where: {
                twitterHandle: twitterHandle
            },
            data: {
                followersCount: result.follower_count,
                trendDirection: trendDirection || influencer.trendDirection
            }
        }).catch(error => {
            return Response.json({ message: "Failed to update influencer" }, { status: 500 });
        });

    } catch (error) {
        console.error("Error: ", error);
    } finally {
        // disconnect the client
        console.log("Disconnecting client");
        await pgClient.$disconnect();
    }

    return Response.json({ message: "Success", data: "This is the update-from-twitter-details route" });
}