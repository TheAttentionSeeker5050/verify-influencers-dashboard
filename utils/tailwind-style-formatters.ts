

// This will give a different text color based on the trust score value
// If trust score his higher than 80 then display text green 600, if trust score is between 55 to 80 then display text yellow 600, else display red 600
export function formatTrustScoreColor(trustScore: number | null) : string {
    if (trustScore === null) return "text-red-600";

    if (trustScore >= 80 && trustScore <= 100) return "text-green-600";
    if (trustScore >= 55 && trustScore < 80) return "text-yellow-600";
    return "text-red-600";
}