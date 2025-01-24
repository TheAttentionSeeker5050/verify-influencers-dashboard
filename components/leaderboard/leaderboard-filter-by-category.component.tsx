'use client'
 
import { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { formatKebabCaseToTitleLabel } from '@/utils/stringFormatters';

export default function LeaderboardFilterByCategoryComponent() {
    // redirect to the new URL
    const router = useRouter();

    // because we want to save lines of code we will do make a list of the categories and map list items and handleSortChange function to each of them
    const categoryList = ['all', 'nutrition', 'fitness', 'medicine', 'mental-health']

    
    const handleFilterChange = (e: MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLSelectElement>) => {
        // add or change the query parameter in the URL to the value of the selected option, the query parameter is 'filter-by-category'
        const url = new URL(window.location.href);
        url.searchParams.set('filter-by-category', e.currentTarget.value);

        router.push(url.toString())
    }
 
    return (<>
            <ul id="leaderboard-filter-section__filter-by-category" className="sm:flex flex-row gap-2 hidden">
                {categoryList.map((category) => {
                    return <li key={category}>
                        <button type='button' onClick={handleFilterChange} value={category} key={category}>
                            {formatKebabCaseToTitleLabel(category)}
                        </button>
                    </li>
                })}
            </ul>
            <select onChange={handleFilterChange} className='sm:hidden block'>
                {categoryList.map((category) => {
                    return <option value={category} key={category}>
                        {formatKebabCaseToTitleLabel(category)}
                    </option>
                })}
            </select>
        </>
    )
}