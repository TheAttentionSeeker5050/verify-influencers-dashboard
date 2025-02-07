export async function POST(request: Request) {
    const formData = await request.formData();

    // console.log("formData", formData);
    // const influencerId = formData.get("influencer-id");
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}