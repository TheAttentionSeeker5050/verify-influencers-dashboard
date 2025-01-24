'use client'
 
import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { formatKebabCaseToTitleLabel } from '@/utils/stringFormatters';

export default function LeaderboardSortComponent() {
    // redirect to the new URL
    const router = useRouter();

    const sortOptionsList = ['rank-descending', 'rank-ascending', 'trust-score-descending', 'trust-score-ascending', 'followers-descending', 'followers-ascending', 'verified-claims-descending','verified-claims-ascending'];
    
    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {

        // add or change the query parameter in the URL to the value of the selected option, the query parameter is 'sorted-by'
        const url = new URL(window.location.href)
        url.searchParams.set('sorted-by', e.target.value)


        router.push(url.toString())
    }
 
    return (
        <div id="leaderboard-filter-section__sort-by-dropdown">
            <select onChange={handleSortChange}>
                {sortOptionsList.map((option, index) => (
                    <option key={index} value={option}>
                        {formatKebabCaseToTitleLabel(option)}
                    </option>
                ))}
            </select>
        </div>
    )
}