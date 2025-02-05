export type Tweet = {
    tweet_id: string;
    creation_date: Date;
    text: string;
    twitter_handle: string; // taken from the user {} object's username field
    language: string;
    favorite_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
    views: number;
    timestamp: number;
};