import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const userRequestData = await req.json();

    // The URL points to the 2nd worker app
    const workerResponse = await fetch('https://b-rolls-suggestor.vercel.app/api/py/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SECRET_WORKER_KEY, 
      },
      body: JSON.stringify(userRequestData),
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      return NextResponse.json({ error: `Worker Error ${workerResponse.status}` }, { status: workerResponse.status });
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Bridge failed.' }, { status: 500 });
  }
}
