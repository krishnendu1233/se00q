import { NextResponse } from 'next/server';

// Optional: Increase Vercel function timeout if Gemini + Pexels takes > 10s
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${process.env.BRS_WORKER_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'x-worker-key': process.env.SECRET_BRS_WORKER_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Worker generate proxy failed' },
      { status: 500 }
    );
  }
}
