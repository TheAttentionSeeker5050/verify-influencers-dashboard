


export default function InfluencerClaimSectionComponent({ twitterHandle} : Readonly<{ twitterHandle: string }>) {

    return (
        <section id="influencer-claims-section">
            <form method="GET" action={`/influencer/${twitterHandle}`}>
                <div className="form-group">
                    <input name="q" type="text" placeholder="Search claims..." />
                </div>

                <div className="form-group">
                    <label htmlFor="categories">Categories</label>
                    <select name="categories" id="categories">
                        <option value="all">All Categories</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Mental Health">Mental Health</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="verification-status">Verification Status</label>
                    <select name="verification-status" id="verification-status">
                        <option value="all">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="questionable">Questionable</option>
                        <option value="debunked">Debunked</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="sort-by">Sort By</label>
                    <select name="sort-by" id="sort-by">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                        <option value="higher-trust-score">Higher Trust Score</option>
                        <option value="lower-trust-score">Lower Trust Score</option>
                    </select>
                </div>

                <button type="submit">Search</button>
            </form>
        </section>
    );
}