import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file_name");

    if (!fileName) {
      return NextResponse.json({ error: "Missing file_name parameter" }, { status: 400 });
    }
    
    const response = await fetch(`https://b-rolls-suggestor.vercel.app/api/status?file_name=${fileName}`, {
      method: "GET",
      headers: {
        "X-Worker-Key": process.env.SECRET_BRS_WORKER_API_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.detail }, { status: response.status });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
