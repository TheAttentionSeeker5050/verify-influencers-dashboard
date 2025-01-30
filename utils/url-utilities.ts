
// this function will return the url of the leaderboard page with the new sort order and sort by, this is used within the table column headers
export function getNewUrlWithSortOrderAndSortBy(currentSortOrder: string, currentSortBy: string, filterByCategory: string, parentColumn: string): string {
    // the logic is, if the parent column is different from the current sort by column, then we will sort by the parent column in ascending order
    // if the parent column is the same as the current sort by column, then we will toggle the sort order
    if (parentColumn !== currentSortBy) {
        return `/leaderboard?filter-by-category=${filterByCategory}&sort-by=${parentColumn}&sort-order=asc`;
    }

    if (currentSortOrder === 'asc') {
        return `/leaderboard?filter-by-category=${filterByCategory}&sort-by=${parentColumn}&sort-order=desc`;
    } else if (currentSortOrder === 'desc') {
        return `/leaderboard?filter-by-category=${filterByCategory}&sort-by=${parentColumn}&sort-order=asc`;
    }

    return "/leaderboard";
}