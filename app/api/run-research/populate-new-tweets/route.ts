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
    let tweets: any[] = [];
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

    try {
        while (true) {
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

            // add it to the tweets array
            tweets = tweets.concat(result.results);

            // if there is no continuation token, break
            if (!continuationToken) {
                break;
            }
        }

    } catch (error) {
        console.error("Error: ", error);
        return Response.json({ message: "Failed to fetch tweets" }, { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return Response.json({ message: "Tweets successfully fetched" }, { status: 200, headers: { "Content-Type": "application/json" } });
}