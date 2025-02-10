/* eslint-disable @typescript-eslint/no-explicit-any */


import getPrismaClient from "@/config/prisma-client";
import prompts from "@/LLM/prompts.json";

// On this step of the process we have the tweets parsed to claims, which are stored into our SQL database. What we want to do here is cross reference the claims against medical journals or just the internet in case not specific medical journals are specified. Then we will give it a score based on the number of verified claims that turned out to be true. The verification will be done through an AI agent and it will return either verified, questionable or debunked for each of the claims. After that what we will do is calculate the score using a hard coded calculation. Then within the claims table change verification status from pending to verified, questionable or debunked.
// Rank profiles by their influence scores to identify the top 50.
export async function POST(request: Request) {
    const formData = await request.formData();

    const influencerId = formData.get("influencer-id");
    
    if (!influencerId || typeof influencerId !== "string") {
        return Response.json({ message: "Influencer ID is required" }, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // We will get the connection to the database getClient
    const pgClient = await getPrismaClient();
    
    try {
        // first get influencer data (we will need this for follower count)
        const influencer = await pgClient.influencer.findUnique({
            where: {
                twitterHandle: influencerId
            }
        });

        if (!influencer) {
            return Response.json({ message: "Influencer not found" }, { status: 404, headers: { "Content-Type": "application/json" } });
        }

        // get the claims table data, filter by influencerId and verification status as not pending
        const claimsFromDB = await pgClient.claim.findMany({
            where: {
                influencerId: influencerId,
                // verificationStatus:  "pending"              
            }
        })
            .then((claims) => {
                return claims.map((claim) => {
                    return {
                        claim: claim.claim,
                        id: claim.id
                    };
                });
            });

        // if there are no claims, we can return a message and 200
        if (!claimsFromDB.length) {
            return Response.json({ message: "No claims need to be verified" }, { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const prompt = formData.get("verify-with-scientific-journals") ? prompts["verify-influencer-claim-with-medical-journals"].replace("{{claims}}", JSON.stringify(claimsFromDB)).replace("{{medical_journals}}", formData.get("verify-with-scientific-journals") as string) : 
        prompts["verify-influencer-claim"].replace("{{claims}}", JSON.stringify(claimsFromDB));
        
        // get the response from the AI
        // Make the API call to OpenAI to generate the claims
        if (!process.env.OPEN_AI_URL || !process.env.OPEN_AI_API_KEY || !process.env.OPEN_AI_PROJECT_ID || !process.env.OPEN_AI_ORG_ID) {
            return Response.json({ message: "OpenAI environment variables are not set" }, { status: 500, headers: { "Content-Type": "application/json" } });
        }

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
                        content: "You are a fact-checker reviewing claims made by an influencer. Please verify the following claims."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 600
            })
        });

        
        
        const openAiData = await openAiResponse.json();

        
        const newClaimsVerificationStatuses = JSON.parse(openAiData.choices[0].message.content);

        // we change the verification statuses of the claims in the database
        // We run this in a transaction to ensure that all updates are successful and we can do it in bulk
        await pgClient.$transaction(newClaimsVerificationStatuses.map((claim: any) => {
            return pgClient.claim.update({
                where: {
                    id: claim.id
                },
                data: {
                    verificationStatus: claim.newVerificationStatus
                }
            });
        }));

        // To calculate the trust score we need to count the total claims, verified claims and questionable claims. these can be donde as individual queries using the count function
        const totalClaimsCount : number = await pgClient.claim.count({
            where: {
                influencerId: influencerId
            }
        });

        const verifiedClaimsCount : number = await pgClient.claim.count({
            where: {
                influencerId: influencerId,
                verificationStatus: "verified"
            }
        });

        const questionableClaimsCount : number = await pgClient.claim.count({
            where: {
                influencerId: influencerId,
                verificationStatus: "questionable"
            }
        });

        // calculate the trust score, questionable counts as half a verified claim
        const trustScore : number = ((verifiedClaimsCount + (questionableClaimsCount*0.5)) / totalClaimsCount) * 100;

        // get the influencer with the highest followers count and calculate the influence score
        const influencerWithMostFollowers = await pgClient.influencer.findFirst({
            orderBy: {
                followersCount: "desc"
            }
        }).then((influencer) => {
            return influencer?.followersCount as number;
        });

        const trustScoreInfluenceCorrected : number = influencer.followersCount ? (Math.log10(influencer.followersCount + 1)/Math.log10(influencerWithMostFollowers + 1)) * trustScore : 0; // We add 1 to the followers count to avoid division by 0

        // Here’s why we correcting for level of influence:

        // Taking the logarithm of the follower count makes it scale better across large and small influencers.
        // Multiplying by Trust Score ensures that more reliable influencers get a higher Influence Score.

        // get the influence score of the influencer to compare it with the new trust score and determine the trend
        const newTrend : string = influencer.trustScore && trustScoreInfluenceCorrected < influencer.trustScore ? "down" : "up"; // This ensures that in case there was not trend before, it will be considered as up because the trust score is now higher than 0

        // This transaction changes the trust score and influence score in the database
        await pgClient.influencer.update({
            where: {
                twitterHandle: influencerId
            },
            data: {
                trustScore: trustScoreInfluenceCorrected,
                trendDirection: newTrend
            }
        });

        // now run another transaction to update the influencer ranks in descending order of trust score
        const influencers = await pgClient.influencer.findMany({
            orderBy: {
                trustScore: "desc"
            }
        });

        await pgClient.$transaction(influencers.map((influencer, index) => {
            return pgClient.influencer.update({
                where: {
                    twitterHandle: influencer.twitterHandle
                },
                data: {
                    rank: index + 1
                }
            });
        }));

    } catch (error) {
        console.error(error);
        return Response.json({ message: "Error analyzing claims" }, { status: 500, headers: { "Content-Type": "application/json" } });
    }
    
    return Response.json({ message: "Claims were analyzed" }, { status: 200, headers: { "Content-Type": "application/json" } });
}