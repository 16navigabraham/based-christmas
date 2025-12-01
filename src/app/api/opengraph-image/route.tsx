import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getNeynarUser } from "~/lib/neynar";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  const user = fid ? await getNeynarUser(Number(fid)) : null;

  // Serve the static image from the public folder
  const screenshotUrl = new URL('/Screenshot.png', request.url);
  const screenshotRes = await fetch(screenshotUrl);
  if (!screenshotRes.ok) {
    return new Response('Screenshot not found', { status: 404 });
  }
  const arrayBuffer = await screenshotRes.arrayBuffer();
  return new Response(arrayBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}