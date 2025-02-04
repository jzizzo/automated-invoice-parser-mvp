import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Expecting a JSON body with a "queries" array
    const { queries } = await request.json();
    if (!queries || !Array.isArray(queries)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Call the external matching API using the batch endpoint.
    const response = await axios.post(
      'https://endeavor-interview-api-gzwki.ondigitalocean.app/match/batch?limit=5',
      { queries },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in matching API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
