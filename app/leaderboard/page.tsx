import LeaderboardSortComponent from "@/components/leaderboard/leaderboard-sort.component";
import LeaderboardFilterByCategoryComponent from "@/components/leaderboard/leaderboard-filter-by-category.component";
import LeaderboardInfluencersTableComponent from "@/components/leaderboard/leaderboard-influencers-table.component";
import { headers } from "next/headers";
import Link from "next/link";


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

    const response = await fetch(url, {
        cache: 'no-store',
    });

    const data = await response.json();

    return (<main>
        <Link href="/" >
            Go Back to Dashboard
        </Link>
        <h1 className="bg-yellow-300">Influencer Trust Leaderboard</h1>
        <p className="bg-zinc-300"> 
            Real time rankings of health influencers based on scientific accuracy, credibility and transparency, updated daily using AI-powered systems
        </p>

        <section id="leaderboard-higlights-stats-section" className="flex flex-col gap-4 bg-red-100 justify-between sm:flex-col">
            <div className="flex flex-row" id="leaderboard-higlights-stats-section__active-users">
                <div className="bg-blue-500">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="bg-purple-500">1,234</span>
                    <span className="bg-red-500">Active Users</span>
                </div>
            </div>

            <div className="flex flex-row" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="bg-yellow-500">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="bg-purple-300">25,431</span>
                    <span className="bg-emerald-500">Claims Verified</span>
                </div>
            </div>

            <div className="flex flex-row" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="bg-cyan-500">
                    Icon
                </div>
                <div className="flex flex-col">
                    <span className="bg-orange-800">85.17%</span>
                    <span className="bg-fuchsia-500">Average Trust Score</span>
                </div>
            </div>
        </section>

        <section id="leaderboard-filter-section" className="flex flex-row gap-4 justify-between flex-wrap">
            <LeaderboardFilterByCategoryComponent/>
            <LeaderboardSortComponent />
        </section>

        <section id="leaderboard-table-section">
            <LeaderboardInfluencersTableComponent data={data.data} />
        </section>
    </main>);
}