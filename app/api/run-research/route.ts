import { formatTwitterHandle } from "@/utils/string-formatters";

export async function POST(request: Request) {
    const influencerId = (await request.formData()).get("influencer-id");
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}