

import { InfluencerDTO } from '@/data/SQL/influencers.sqldata';
import Link from 'next/link';


export default function LeaderboardInfluencersTableComponent({ data }: { data: InfluencerDTO[] }) {
    const influenceersList = data;
    
    return (
        <table className="">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Influencer</th>
                    <th >Category</th>
                    <th>Trust Score</th>
                    <th className="hidden sm:table-cell">Trend</th>
                    <th >Followers</th>
                    <th className="hidden sm:table-cell">Verified Claims</th>
                </tr>
            </thead>
            <tbody>
                {influenceersList.map((influencer: InfluencerDTO) => {
                    return (
                        <tr key={influencer.twitterHandle}>
                            <td>{influencer.rank}</td>
                            <td>
                            <Link href={`/influencer/${influencer.twitterHandle}`} >
                                {influencer.name}
                            </Link>
                            </td>
                            <td >{influencer.category}</td>
                            <td>{influencer.trustScore}</td>
                            <td className="hidden sm:table-cell">{influencer.trendDirection}</td>
                            <td>{influencer.followersCount}</td>
                            <td className="hidden sm:table-cell">{influencer.verifiedClaimsCount}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}