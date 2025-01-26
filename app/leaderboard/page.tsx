import LeaderboardSortComponent from "@/components/leaderboard/leaderboard-sort.component";
import LeaderboardFilterByCategoryComponent from "@/components/leaderboard/leaderboard-filter-by-category.component";
import LeaderboardInfluencersTableComponent from "@/components/leaderboard/leaderboard-influencers-table.component";
import { headers } from "next/headers";
import Link from "next/link";
import BackToDashboardComponent from "@/components/reusables/go-back-to-dashboard-button";


export default async function LeaderboardPage({
    searchParams,
  }: Readonly<{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }>) {
    const filterByCategory = (await searchParams)["filter-by-category"];
    const sortBy = (await searchParams)["sort-by"];

    // Fetch data from the API route
    const host = (await headers()).get('host'); // Gets the request's host header
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'; // Dev = http, Prod = https

    const url = `${protocol}://${host}/api/influencers?filter-by-category=${filterByCategory}&sort-by=${sortBy}`;

    let data = [];
    
    try{
        const response = await fetch(url);
        
        data = await response.json();
    } catch (error) {}

    return (<main>
        <BackToDashboardComponent />
        <h1 className="">Influencer Trust Leaderboard</h1>
        <p className=""> 
            Real time rankings of health influencers based on scientific accuracy, credibility and transparency, updated daily using AI-powered systems
        </p>

        <section id="leaderboard-higlights-stats-section" className="flex flex-col gap-4 justify-between sm:flex-col">
            <div className="flex flex-row" id="leaderboard-higlights-stats-section__active-users">
                <div className="">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="">1,234</span>
                    <span className="">Active Users</span>
                </div>
            </div>

            <div className="flex flex-row" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="">25,431</span>
                    <span className="">Claims Verified</span>
                </div>
            </div>

            <div className="flex flex-row" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="">85.17%</span>
                    <span className="">Average Trust Score</span>
                </div>
            </div>
        </section>

        <section id="leaderboard-filter-section" className="flex flex-row gap-4 justify-between flex-wrap">
            <LeaderboardFilterByCategoryComponent/>
            <LeaderboardSortComponent />
        </section>

        <section id="leaderboard-table-section">
            {
                data.data ?  
                <LeaderboardInfluencersTableComponent influenceersList={data.data || []}/> : 
                <div className="">No influencers found</div>
            }
        </section>
    </main>);
}