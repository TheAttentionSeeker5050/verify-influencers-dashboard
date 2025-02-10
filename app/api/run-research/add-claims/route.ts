import getMongooseClient from "@/config/mongoose-client";
import getPrismaClient from "@/config/prisma-client";
import { tweetSchema } from "@/data/MongoDB/tweets";

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
        // get all the tweets of the influencer using mongoose client
        const tweetModel = mongoClient.model("tweets", tweetSchema);
        const tweets = ((await tweetModel.findOne({ userHandle: influencerId }))?.tweets ?? []).filter((tweet) => !tweet.parsedToClaim);

        // if not tweets are found to parse to claims return a 200 and go to next step, as they may already be parsed
        if (tweets.length === 0) {
            return Response.json({ message: "No tweets found for this influencer" }, { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // map the tweets into an array of individual string text from tweets
        const tweetTextArray = tweets.map((tweet) => {
            return tweet.text;
        });

        // Make a second OpenAI api call to cross validate if the claims are already present in the database
        // First make a call to the database to get all the claims for the influencer, map them to an array of strings
        const claimsFromDB = await pgClient.claim.findMany({
            where: {
                influencerId: influencerId
            }
        }).then((claims) => {
            return claims.map((claim) => claim.claim);
        });

        if (tweetTextArray.length === 0) {
            return Response.json({ message: "No tweets found for this influencer" }, { status: 404, headers: { "Content-Type": "application/json" } });
        }

        // call the AI model to convert each of the tweet into a claim
        // OpenAI API call
        if (!process.env.OPEN_AI_URL || !process.env.OPEN_AI_API_KEY || !process.env.OPEN_AI_PROJECT_ID || !process.env.OPEN_AI_ORG_ID) {
            return Response.json({ message: "OpenAI environment variables are not set" }, { status: 500, headers: { "Content-Type": "application/json" } });
        }

        // Make the API call to OpenAI to generate the claims
        const openAiResponse = await fetch(process.env.OPEN_AI_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPEN_AI_API_KEY}`,
                "OpenAI-Organization": process.env.OPEN_AI_ORG_ID,
                "OpenAI-Project": process.env.OPEN_AI_PROJECT_ID,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that extracts health-related claims from social media posts and categorizes them into Nutrition, Fitness, Medicine, or Mental Health."
                    },
                    {
                        role: "user",
                        content: `Extract unique health-related claims from the following tweets. Return a JSON 2D array where each entry consists of a claim and its category (Nutrition, Fitness, Medicine, Mental Health). \n
                        If a tweet does not contain a health-related claim, exclude it. \n
                        ----------------------------- \n
                        A health related claims has the following characteristics: \n
                        - It is a statement that can be verified or refuted \n
                        - It is related to health, fitness, nutrition or mental health \n
                        - It is a statement that can be categorized into one of the following categories: Nutrition, Fitness, Medicine, Mental Health \n
                        - It is a statement that is not a question, and is measurable, verifiable, or refutable \n
                        - Can confirm, affirm or deny a statement, tyhe health effects of a habit or food, or the effects of a treatment \n
                        ----------------------------- \n
                        Also filter out the claims that are already present in the ClaimsFromDB argument, this means that if a claim is simmilar to the ones in the database exlude it from the output of this prompt. \n 
                        ----------------------------- \n
                        Tweets: ${JSON.stringify(tweetTextArray)} \n
                        Claims already existent Database (ClaimsFromDB): ${JSON.stringify(claimsFromDB)}`
                    }
                ],
                max_tokens: 600
            })
        });
        
        const openAiData = await openAiResponse.json();
        
        // Ensure response is in the expected 2D array format of keys claim and category
        let individualClaimsArray: { claim: string, category: string }[] = [];

        if (openAiData.choices?.[0]?.message?.content) {
            try {
                individualClaimsArray = await JSON.parse(openAiData.choices?.[0]?.message?.content.replace(/```json|```/g, ""));
            } catch (error) {
                console.error("Error parsing AI response:", error);
                return Response.json({ message: "Error processing AI response" }, { status: 500 });
            }
        }

        await Promise.all(individualClaimsArray.map(async (claim) => {
            // Save the claim to the database
            await pgClient.claim.create({
                data: {
                    influencerId: influencerId,
                    claim: claim.claim,
                    verificationStatus: "pending",
                    categoryId: claim.category,
                }
            });
        }));

        // Update the tweets in the mongo database to have the parsedToClaim field set to true
        Promise.all(tweets.map(async (tweet) => {
            // This will select the tweet that has the tweet_id that matches the tweet_id of the tweet in the array, then set the parsedToClaim field to true
            await tweetModel.updateOne({ "tweets.tweet_id": tweet.tweet_id }, { $set: { "tweets.$.parsedToClaim": true } });
        }));
    } catch (error) {
        console.error("Error", error);
    } finally {

        // disconnect the clients
        await pgClient.$disconnect();
    }
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}