import LeaderboardFilterByCategoryComponent from "@/components/leaderboard/leaderboard-filter-by-category.component";
import LeaderboardInfluencersTableComponent from "@/components/leaderboard/leaderboard-influencers-table.component";
import { headers } from "next/headers";
import BackToDashboardComponent from "@/components/reusables/go-back-to-dashboard-button";
import { AppStatusMessagesWithCustomStateComponent } from "@/components/reusables/status-messages";

// Fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCircleCheck, faChartColumn } from "@fortawesome/free-solid-svg-icons";

export default async function LeaderboardPage({
    searchParams,
  }: Readonly<{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }>) {
    
    const filterByCategory = (await searchParams)["filter-by-category"]?.toString() ?? 'all';
    const sortBy = (await searchParams)["sort-by"]?.toString() ?? 'rank';
    const sortOrder = (await searchParams)["sort-order"]?.toString() ?? 'asc';

    // Fetch data from the API route
    const host = (await headers()).get('host'); // Gets the request's host header
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'; // Dev = http, Prod = https

    const url = `${protocol}://${host}/api/influencers?filter-by-category=${filterByCategory}&sort-by=${sortBy}&sort-order=${sortOrder}`;

    let data = [];
    let errorMessage : string = '';
    
    try{
        const response = await fetch(url);
        
        data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An error occurred';
    }

    return (<main id="leaderboard-page" className="p-4 min-h-screen max-w-4xl mx-auto flex flex-col gap-3">


        <BackToDashboardComponent />
        <h1 className="text-2xl font-bold">
            Influencer Trust Leaderboard
        </h1>

        <p className=""> 
            Real time rankings of health influencers based on scientific accuracy, credibility and transparency, updated daily using AI-powered systems
        </p>

        {errorMessage &&
            <AppStatusMessagesWithCustomStateComponent errorMessage={errorMessage} />
        }

        <section id="leaderboard-higlights-stats-section" className="flex flex-col gap-4 justify-stretch sm:flex-row">
            <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 p-4 border-2 border-slate-400 rounded-lg grow" id="leaderboard-higlights-stats-section__active-users">
                <div className="text-emerald-500 text-2xl row-span-full col-start-auto col-end-2 self-center">
                    <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="">1,234</span>
                <span className="">Active Users</span>
            </div>

            <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 p-4 border-2 border-slate-400 rounded-lg grow" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="text-emerald-500 text-2xl row-span-full col-start-auto col-end-2 self-center">
                    <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <span className="">25,431</span>
                <span className="">Claims Verified</span>
            </div>

            <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 p-4 border-2 border-slate-400 rounded-lg grow" id="leaderboard-higlights-stats-section__claims-verified">
                <div className="text-emerald-500 text-2xl row-span-full col-start-auto col-end-2 self-center">
                    <FontAwesomeIcon icon={faChartColumn} />
                </div>
                <span className="">85.17%</span>
                <span className="">Average Trust Score</span>
            </div>
        </section>

        <section id="leaderboard-filter-section" className="flex flex-row gap-4 justify-between flex-wrap">
            <LeaderboardFilterByCategoryComponent selectedCategory={filterByCategory} />
        </section>

        <section id="leaderboard-table-section">
            {
                data.data ?  
                <LeaderboardInfluencersTableComponent influenceersList={data.data || []} sortBy={sortBy} sortOrder={sortOrder} filterByCategory={filterByCategory}
                /> : 
                <div className="">No influencers found</div>
            }
        </section>
    </main>);
}