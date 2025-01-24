
// format string separated by '-' to string separated by ' ' and capitalize the first letter of each word
export const formatKebabCaseToTitleLabel = (category: string) => {
    return category.toLowerCase().split('-').map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
}

// format the twitter handle to always include the "@" symbol
export const formatTwitterHandle = (twitterHandle?: string) => {
    const decodedTwitterHandle = decodeURIComponent(twitterHandle || "");
    
    if (!decodedTwitterHandle) return "";
    return decodedTwitterHandle.startsWith("@") ? decodedTwitterHandle : `@${decodedTwitterHandle}`
}

// have the numbers be formatted after 1500 to be in the format of 2K, 2.5K, 3K, 4.2M, etc. always include a + sign and round down to the nearest 1 decimal place
export function formatFollowerOrClaimsCount(followerCount: number | null) : string {
    if (followerCount === null || followerCount < 0) return "N/A";
    if (followerCount < 1500) return `${followerCount}`;
    if (followerCount < 1000000 - 0.1) return `${(followerCount / 1000).toFixed(1)}K+`; // we want to substract 0.1 to avoid rounding up
    return `${(followerCount / 1000000 - 0.1).toFixed(1)}M+`;
}

// Have the numbers be formatted after 1500 to be in the format of 2K, 2.5K, 3K, 4.2M, etc. always include a + sign and round down to the nearest 1 decimal place and always include the $ sign at the beginning
export function formatYearlyRevenue(revenue: number | null ) : string {
    if (revenue === null || revenue < 0) return "N/A";
    if (revenue < 1500) return `$${revenue}`;
    if (revenue < 1000000) return `$${(revenue / 1000 - 0.1).toFixed(1)}K+`;
    return `$${(revenue / 1000000 - 0.1).toFixed(1)}M+`;
}


// format the percentage to 0 decimal places and always include the % sign at the end
// Percentages are stored from 0 to 100 in the database
export function formatPercentage(percentage: number | null) : string {
    if (percentage === null) return "N/A";

    if (percentage < 0 || percentage > 100) return "N/A";
    return `${percentage.toFixed(0)}%`
}