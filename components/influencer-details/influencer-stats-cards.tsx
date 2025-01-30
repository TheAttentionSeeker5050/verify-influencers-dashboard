import { formatFollowerOrClaimsCount, formatPercentage, formatYearlyRevenue } from "@/utils/string-formatters";

export default function InfluencerStatsSectionComponent() {
    return (
        <section id="influencer-stats-section">
            <div id="influencer-stats-section__card__trust-score">
                <span>Trust Score</span>
                <span>{formatPercentage(89)}</span>
                <span>Based  on {formatFollowerOrClaimsCount(127)} verified claims</span>
                <span>Icon</span>
            </div>

            <div id="influencer-stats-section__card__yearly-revenue">
                <span>Yearly Revenue</span>
                <span>{formatYearlyRevenue(5000000)}</span>
                <span>Estimated Earnings</span>
                <span>Icon</span>
            </div>
            <div id="influencer-stats-section__card__num-recommended-products">
                <span>Number of Recommended Products</span>
                <span>{1}</span>
                <span>Recommended Products</span>
                <span>Icon</span>
            </div>

            <div id="influencer-stats-section__card__follower-count">
                <span>Followers</span>
                <span>{formatFollowerOrClaimsCount(4250000)}</span>
                <span>Total Followers</span>
                <span>Icon</span>
            </div>
        </section>
    );
}