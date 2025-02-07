export async function POST(request: Request) {
    const formData = await request.formData();
    
    return Response.json({ message: "Tweets were analyzed"}, { status: 200, headers: { "Content-Type": "application/json" } });
}