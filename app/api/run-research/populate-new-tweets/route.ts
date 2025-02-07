/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import getMongooseClient from "@/config/mongoose-client";
import { MapTweets, tweetSchema } from "@/data/MongoDB/tweets";
import { GET_USER_CONTINUATION_TWEETS, GET_USER_TWEETS, TWITTER_API_URL } from "@/TwitterAPI/constants";
import { formatTwitterHandleNoArrobase } from "@/utils/string-formatters";


export async function POST(request: Request) {

    const formData = await request.formData();

    const influencerId : string = formData.get("influencer-id")?.toString() ?? "";

    if (!influencerId) {
        return Response.json({ message: "Influencer ID not provided" }, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // get the date of the last tweet in the database
    const timeRange : string = formData.get("time-range")?.toString() ?? 'last-week';

    // possible cases, last-week, last-month, last-year, all-time
    // set the start date based on the time range
    const startDate : Date = new Date();
    switch (timeRange) {
        case 'last-week':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'last-month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'last-year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        case 'all-time':
            startDate.setFullYear(startDate.getFullYear() - 100);
            break;
        default:
            return Response.json({ message: "Invalid time range" }, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // make a get request to get the user's tweets, influencerId is user handle from twitter
    let url;
    let tweets: Array<object> = [];
    let continuationToken = "";
    let response;
    let result;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.TWITTER_API_KEY ?? "",
            'x-rapidapi-host': process.env.TWITTER_API_HOST ?? ""
        }
    };

    
    // connect to mongo db
    const mongoClient = getMongooseClient();
    if (!mongoClient) {
        return Response.json({ message: "Failed to connect to database" }, { status: 500, headers: { "Content-Type": "application/json" } });
    }        
    try {
        
        // attempt to get the tweet schema from the database
        // having the same user handle as influencerId
        const tweetModel = mongoClient.model("tweets", tweetSchema);

        const influencerTweetsFromDB = await tweetModel.findOne({ userHandle: influencerId });

        // get the last date from the influencer tweets from the database. They are ordered by creation date in descending order
        const lastDate = influencerTweetsFromDB?.tweets[influencerTweetsFromDB.tweets.length - 1]?.creation_date ?? null;
        
        while (true) {
            console.log("iteration");
            if (!continuationToken) {
                url = `${TWITTER_API_URL}${GET_USER_TWEETS}?username=${formatTwitterHandleNoArrobase(influencerId)}&limit=40&include_replies=false&include_pinned=false`;
            } else {
                url = `${TWITTER_API_URL}${GET_USER_CONTINUATION_TWEETS}?username=${formatTwitterHandleNoArrobase(influencerId)}&limit=40&include_replies=false&include_pinned=false&continuation_token=${continuationToken}`;
            }

            // make a fetch get request to the twitter api
            response = await fetch(url, options);

            result = await response.json();

            // url encode result.continuation_token
            continuationToken = encodeURIComponent(result.continuation_token);

            // get the last tweet timestamp
            const lastTweetTimestamp = result.results[result.results.length - 1].creation_date;

            // if te last tweet timestamp on the fetched requests is less than the start date from request body, break
            if (new Date(lastTweetTimestamp) < startDate || new Date(lastTweetTimestamp).toString() === "Invalid Date") {
                break;
            }

            // if date of the last tweet in the database is greater than the last tweet timestamp from the fetched tweets, break. This saves api calls
            if (lastDate && new Date(lastTweetTimestamp) < new Date(lastDate)) {
                break;
            }

            // add it to the tweets array at the end
            tweets = tweets.concat(result.results);

            // if there is no continuation token, break
            if (!continuationToken) {
                break;
            }
        }

        // if the influencer tweets are already in the database, update the tweets
        if (influencerTweetsFromDB) {
            // make sure that the tweets are unique, meaning that the tweets that have the same property tweet_id are not added

            // declare a new tweets array
            let newTweetArray = influencerTweetsFromDB.tweets;

            // add the new tweets to the new tweet array only if the tweet_id is not already in the array
            tweets.forEach((tweet: any) => {
                if (!newTweetArray.some((t) => t.tweet_id === tweet.tweet_id)) {
                    // Add the tweet to the new tweet array
                    newTweetArray.push(tweet);
                }
            });

            // if newTweetArray and influencerTweetsFromDB.tweets have the same length, then there are no new tweets
            if (newTweetArray.length === influencerTweetsFromDB.tweets.length) {
                return Response.json({ message: "No new tweets" }, { status: 200, headers: { "Content-Type": "application/json" } });
            }


            // order the tweets by creation date
            newTweetArray.sort((a: any, b: any) => {
                if (new Date(a.creation_date).toString() === "Invalid Date") {
                    return -1;
                }
                
                return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime();
            });

            // update the tweets in the database
            await tweetModel.updateOne({ userHandle: influencerId }, { tweets: newTweetArray });
        } else {
            await tweetModel.create({ userHandle: influencerId, tweets: MapTweets(tweets) });
        }

    } catch (error) {
        console.error("Error: ", error);
        return Response.json({ message: "Failed to fetch tweets" }, { status: 500, headers: { "Content-Type": "application/json" } });
    } 
    
        
    

    return Response.json({ message: "Tweets successfully fetched" }, { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function GET() {
    // just get the tweets from @dreades that are in the mongo database
    // connect to mongo db
    const mongoClient = getMongooseClient();
    if (!mongoClient) {
        return Response.json({ message: "Failed to connect to database" }, { status: 500, headers: { "Content-Type": "application/json" } });
    }

    try {

        const tweetModel = mongoClient.model("tweets", tweetSchema);

        const influencerTweetsFromDB = await tweetModel.findOne({ userHandle: "@dreades" });

        return Response.json({ tweets: influencerTweetsFromDB }, { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error: ", error);
        return Response.json({ message: "Failed to fetch tweets" }, { status: 500, headers: { "Content-Type": "application/json" } });
    }
}