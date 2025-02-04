
export async function POST(request: Request) {

    const influencerId = (await request.formData()).get("influencer-id");

    console.log("Populating tweets for influencer with id: ", influencerId);

    return Response.json({ message: "Tweets successfully fetched" }, { status: 200, headers: { "Content-Type": "application/json" } });
}