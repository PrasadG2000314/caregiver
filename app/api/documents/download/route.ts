import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bucket = searchParams.get('bucket');
  const path = searchParams.get('path');
  const token = searchParams.get('token');
  const expires = searchParams.get('expires');

  if (!bucket || !path || !token || !expires) {
    return new NextResponse('Bad Request: Missing parameters for signed document access.', { status: 400 });
  }

  const expiresTime = parseInt(expires, 10);
  if (Date.now() > expiresTime) {
    return new NextResponse('Unauthorized: Signed URL expired. Please request a fresh link.', { status: 401 });
  }

  // Simulated secure PDF stream
  const samplePdf = `%PDF-1.4\n% BUDGET DEKOO SECURE HEALTHCARE DOCUMENT\n% Path: ${path}\n% Validated PDPA Access\n%%EOF`;

  return new NextResponse(samplePdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${path.split('/').pop() || 'document.pdf'}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

