import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming form data (must be a file upload)
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a new FormData instance to forward to the external extraction endpoint
    const externalFormData = new FormData();
    externalFormData.append('file', file as Blob);

    // Call the external extraction API
    const response = await axios.post(
      'https://plankton-app-qajlk.ondigitalocean.app/extraction_api',
      externalFormData,
      {
        headers: {
          // Axios does not automatically set headers for FormData in a Node environment,
          // but Next.js Route Handlers run on the Edge or Node. Adjust if necessary.
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in extraction API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
