import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`https://b-rolls-suggestor.vercel.app/api/upload`, {
      method: "POST",
      headers: {
        "X-Worker-Key": process.env.SECRET_BRS_WORKER_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.detail }, { status: response.status });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
