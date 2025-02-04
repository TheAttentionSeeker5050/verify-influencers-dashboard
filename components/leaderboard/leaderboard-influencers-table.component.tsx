

import { InfluencerDTO } from '@/data/SQL/influencers.sqldata';
import { formatFollowerOrClaimsCount, formatPercentage, formatTrendDirectionToSignalNumber } from '@/utils/string-formatters';
import { formatTrustScoreColor } from '@/utils/tailwind-style-formatters';
import Image from 'next/image';
import Link from 'next/link';

// import font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

// url utilities
import { getNewUrlWithSortOrderAndSortBy } from '@/utils/url-utilities';

function TrendDirectionIconComponent({ trendDirection }: Readonly<{ trendDirection: string | null }>) {
    const trendDirectionSignal: number = formatTrendDirectionToSignalNumber(trendDirection);

    if (trendDirectionSignal === 1) {
        return <FontAwesomeIcon icon={faArrowTrendUp} className='text-emerald-500' />
    } else if (trendDirectionSignal === -1) {
        return <FontAwesomeIcon icon={faArrowTrendDown} className='text-red-500' />
    } else {
        return <>N/A</>;
    }
}

function TrustScorePercentageComponent({ trustScore }: Readonly<{ trustScore: number | null }>) {
    // use a different text color based on the trust score value
    const trustScoreColorStyle = formatTrustScoreColor(trustScore);

    return (
        <td className={`px-2 py-3 font-semibold text-lg
        ${trustScoreColorStyle}`}>{formatPercentage(trustScore)}</td>
    );
}

// This is a single component to display the arrow up or down in the table header when we choose a specific order
function SortOrderArrowUpOrDownIconComponent({ sortOrder, sortBy, parentColumn }: Readonly<{ sortOrder: string, sortBy: string, parentColumn: string }>) {
    // if it is not being sorted by the parent column, dont display any arrows
    if (sortBy !== parentColumn) {
        return null;
    }
    if (sortOrder === 'asc') {
        return <FontAwesomeIcon icon={faArrowDown} className='text-emerald-600' />
    } else if (sortOrder === 'desc') {
        return <FontAwesomeIcon icon={faArrowUp} className='text-emerald-600' />
    } else return null;
}

export default function LeaderboardInfluencersTableComponent({
    influenceersList,
    sortOrder,
    sortBy,
    filterByCategory
}: Readonly<{ 
    influenceersList: InfluencerDTO[],
    sortOrder: string,
    sortBy: string,
    filterByCategory: string
}>) {

    
    return (
        <table className="w-full table-auto">
            <thead className='bg-slate-600 text-slate-300'>
                <tr className='*:px-2 *:py-3 *:text-left *:font-normal hover:*:bg-slate-500'> 
                    <th className='rounded-tl-lg' id='rank'>
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'rank')}>
                            Rank <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='rank' />
                        </Link>
                    </th>
                    <th className=''>
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'influencer-name')}>
                            Influencer
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='influencer-name' />
                        </Link>
                    </th>
                    <th className='hidden sm:table-cell '>
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'category')}>
                            Category
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='category' />
                        </Link>
                    </th>
                    <th className=''>
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'trust-score')}>
                            Trust Score
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='trust-score' />
                        </Link>
                    </th>
                    <th className="hidden sm:table-cell ">
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'trend-direction')}>
                            Trend
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='trend-direction' />
                        </Link>
                    </th>
                    <th className='rounded-tr-lg sm:rounded-tr-none ' >
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'followers-count')}>
                            Followers
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='followers-count' />
                        </Link>
                    </th>
                    <th className="hidden sm:table-cell sm:rounded-tr-lg ">
                        <Link href={getNewUrlWithSortOrderAndSortBy(sortOrder, sortBy, filterByCategory, 'verified-claims-count')}>
                            Verified Claims
                            <SortOrderArrowUpOrDownIconComponent sortOrder={sortOrder} sortBy={sortBy} parentColumn='verified-claims-count' />
                        </Link>
                    </th>
                </tr>
            </thead>
            <tbody className=''>
                {influenceersList ? influenceersList.map((influencer: InfluencerDTO, index: number) => {
                    return (
                        <tr key={influencer.twitterHandle} className={`bg-slate-800 rounded-md ${influenceersList.length > index + 1 && "border-b-2"}`}>
                            <td className='px-2 py-3'>{influencer.rank}</td>
                            <td className='px-2 py-3'>
                            <Link href={`/influencer/${influencer.twitterHandle}`} className='flex items-center gap-2'>
                                <Image src={"/images/profile-picture.png"} alt={influencer.name} width={50} height={50} className='rounded-full sm:size-8 size-6' />
                                {influencer.name}
                            </Link>
                            </td>
                            <td className='px-2 py-3 hidden sm:table-cell'>{influencer.category}</td>
                            <TrustScorePercentageComponent trustScore={influencer.trustScore} />
                            <td className='px-2 py-3 hidden sm:table-cell'>
                                <TrendDirectionIconComponent trendDirection={influencer.trendDirection} />
                            </td>
                            <td className='px-2 py-3'>{formatFollowerOrClaimsCount(influencer.followersCount)}</td>
                            <td className={`px-2 py-3 hidden sm:table-cell`}>{formatFollowerOrClaimsCount(influencer.verifiedClaimsCount)}</td>
                        </tr>
                    );
                }) : <tr>
                        <td colSpan={7} className='px-2 py-3'>
                            No influencers found
                        </td>
                    </tr>}
            </tbody>
        </table>
    )
}