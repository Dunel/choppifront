import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (() => {
  const base = process.env.CHOPPI_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  return base.replace(/\/$/, "");
})();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const stripEmpty = (segments?: string[]) => segments?.filter(Boolean) ?? [];

async function proxyRequest(request: NextRequest, params: { path?: string[] }) {
  const targetPath = stripEmpty(params.path).join("/");
  const search = request.nextUrl.search;
  const url = targetPath ? `${BACKEND_URL}/${targetPath}${search}` : `${BACKEND_URL}${search}`;

  const headers = new Headers(request.headers);
  headers.set("host", new URL(BACKEND_URL).host);
  headers.delete("content-length");

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.text() : undefined;

  try {
    const backendResponse = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Proxy error", error: (error as Error).message },
      { status: 502, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

type RouteContext = { params: Promise<{ path?: string[] }> };

const handler = async (request: NextRequest, context: RouteContext) => {
  const params = await context.params;
  return proxyRequest(request, params ?? {});
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as HEAD };
