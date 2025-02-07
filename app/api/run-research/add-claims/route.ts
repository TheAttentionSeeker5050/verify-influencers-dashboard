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
        const tweets = (await tweetModel.findOne({ userHandle: influencerId }))?.tweets ?? [];

        // map the tweets into an array of individual string text from tweets
        const tweetTextArray = tweets.map((tweet) => {
            return tweet.text;
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
                        content: `Extract unique health-related claims from the following tweets. Return a JSON 2D array where each entry consists of a claim and its category (Nutrition, Fitness, Medicine, Mental Health). If a tweet does not contain a health-related claim, exclude it. Tweets: ${JSON.stringify(tweetTextArray)}`
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

        console.log("Individual claims first element", individualClaimsArray[0]);

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

        // console.log("Tweets", tweets[0]);
        // Influencer prisma schema
        // model Claim {
        //     id                 Int        @id @default(autoincrement())
        //     influencer         Influencer @relation(fields: [influencerId], references: [id])
        //     influencerId       Int
        //     claim              String
        //     tweetId            String
        //     verificationStatus String
        //     category           Category   @relation(fields: [categoryId], references: [id])
        //     categoryId         Int // this category is different from the category of the influencer
        //     createdAt          DateTime   @default(now())
        //     updatedAt          DateTime   @updatedAt
        //     aiAnalysis         String?
        //     trustScore         Float?
        //     claimSource        String?
        //   }
    } catch (error) {
        console.error("Error", error);
    } finally {

        // disconnect the clients
        await pgClient.$disconnect();
    }
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}