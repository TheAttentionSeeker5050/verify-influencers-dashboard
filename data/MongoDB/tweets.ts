import mongoose from "mongoose";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Tweet = {
    tweet_id: string;
    creation_date: Date;
    text: string;
    twitter_handle: string; // taken from the user {} object's username field
    // language: string;
    favorite_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
    views: number;
    timestamp: number;
};

export function MapTweets(tweets: any): Tweet[] {
    return tweets.map((tweet: any) => {
        return {
            tweet_id: tweet.tweet_id,
            creation_date: tweet.creation_date,
            text: tweet.text,
            twitter_handle: tweet.twitter_handle,
            favorite_count: tweet.favorite_count,
            retweet_count: tweet.retweet_count,
            reply_count: tweet.reply_count,
            quote_count: tweet.quote_count,
            views: tweet.views,
            timestamp: tweet.timestamp
        };
    });
}

export const tweetItemSchema = new mongoose.Schema({
    tweet_id: {
        type: String,
        required: true
    },
    creation_date: Date,
    text: String,
    twitter_handle: String,
    favorite_count: Number,
    retweet_count: Number,
    reply_count: Number,
    quote_count: Number,
    views: Number,
    timestamp: Number,
    parsedToClaim: {
        type: Boolean,
        default: false
    }
});

// make a tweet schema, with the following components
// userHandle
// tweets: list of the tweets that are returned from the twitter api
export const tweetSchema = new mongoose.Schema({
    userHandle: String,
    tweets: {
        type: [tweetItemSchema],
        required: true,
        unique: true
    }
});