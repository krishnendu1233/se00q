import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Get the data the user typed in the frontend
    const userRequestData = await req.json();

    // 2. Secretly call your original filterer tool
    // Replace the URL below with the exact API URL of your filterer backend
    const workerResponse = await fetch('https://filterer.vercel.app/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SECRET_YFF_WORKER_API_KEY, // The secret password
      },
      body: JSON.stringify(userRequestData),
    });

    const data = await workerResponse.json();

    // 3. Send the result back to the se00q frontend
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Bridge failed' }, { status: 500 });
  }
}
