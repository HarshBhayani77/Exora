import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3001";

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const targetPath = path.join("/");
    const url = new URL(request.url);
    const targetUrl = `${BACKEND_URL}/api/${targetPath}${url.search}`;

    const headers = new Headers(request.headers);
    // Delete headers that cause proxy issues
    headers.delete("host");
    headers.delete("connection");

    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.blob();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const resHeaders = new Headers(response.headers);
    // Delete encoding headers that might cause gzip issues
    resHeaders.delete("content-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (error: any) {
    console.error("API proxy error to backend:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Studio Backend on port 3001. Ensure backend is running.",
      },
      { status: 502 }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const OPTIONS = proxyHandler;
