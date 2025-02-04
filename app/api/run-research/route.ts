import { formatTwitterHandle } from "@/utils/string-formatters";

export async function POST(request: Request) {
    const influencerId = (await request.formData()).get("influencer-id");

    console.log("Researching tweet claims for influencer with id: ", influencerId);
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}