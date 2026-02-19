// Clerk proxy route — required when running on *.vercel.app (no DNS control)
// Forwards requests to the Clerk Frontend API on behalf of the app

const FRONTEND_API =
  process.env.CLERK_FRONTEND_API_URL ?? "https://wired.tetra-36.lcl.dev";

async function handleRequest(req: Request, path: string[]) {
  const url = new URL(req.url);
  const target = `${FRONTEND_API}/${path.join("/")}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(FRONTEND_API).host);
  // Remove headers that shouldn't be forwarded
  headers.delete("connection");

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const response = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  const resHeaders = new Headers(response.headers);
  resHeaders.delete("connection");

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path ?? []);
}
export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path ?? []);
}
export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path ?? []);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path ?? []);
}
export async function PATCH(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path ?? []);
}
