import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file_name');

    if (!fileName) {
      return NextResponse.json({ detail: 'Missing file_name parameter' }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.BRS_WORKER_BASE_URL}/api/status?file_name=${encodeURIComponent(fileName)}`,
      {
        method: 'GET',
        headers: {
          'x-worker-key': process.env.SECRET_BRS_WORKER_API_KEY,
        },
        cache: 'no-store', // Critical: prevents Next.js from caching the 'PROCESSING' state
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Worker status proxy failed' },
      { status: 500 }
    );
  }
}
