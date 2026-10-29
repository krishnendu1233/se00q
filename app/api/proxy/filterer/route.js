import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const userRequestData = await req.json();

    // 1. UPDATED URL: Changed to /api/py/analyze to match your Python backend
    const workerResponse = await fetch('https://filterer.vercel.app/api/py/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SECRET_WORKER_KEY, 
      },
      body: JSON.stringify(userRequestData),
    });

    // 2. Check if the Python backend rejected the request (e.g., wrong API key)
    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error("Worker responded with error:", workerResponse.status, errorText);
      return NextResponse.json({ error: `Worker Error ${workerResponse.status}: ${errorText}` }, { status: workerResponse.status });
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    // 3. Log the exact error to your Vercel console so we can see what went wrong
    console.error("Bridge crash details:", error);
    return NextResponse.json({ error: 'Bridge failed. Check Vercel logs for details.' }, { status: 500 });
  }
}
