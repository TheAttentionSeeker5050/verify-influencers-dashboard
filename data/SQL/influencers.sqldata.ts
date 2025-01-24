import { Influencer } from "@prisma/client";

export type InfluencerDTO = {
    id: number;
    rank: number | null;
    name: string;
    description: string | null;
    twitterHandle: string;
    category: string | null;
    trustScore: number | null;
    trendDirection: string | null;
    followersCount: number | null;
    verifiedClaimsCount: number | null;
    yearlyRevenue: number | null;
    recommendedProducts: string | null;
}

// builder function to convert the Prisma model to the DTO
export function buildInfluencerDTO(influencer: Influencer): InfluencerDTO {
    return {
        id: influencer.id,
        rank: influencer.rank,
        name: influencer.name,
        twitterHandle: influencer.twitterHandle,
        category: influencer.category?.name,
        description: influencer.description,
        trustScore: influencer.trustScore,
        trendDirection: influencer.trendDirection,
        followersCount: influencer.followersCount,
        verifiedClaimsCount: influencer.verifiedClaimsCount,
        yearlyRevenue: influencer.yearlyRevenue,
        recommendedProducts: influencer.recommendedProducts
    }
}