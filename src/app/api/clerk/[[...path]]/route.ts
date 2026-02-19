// Clerk proxy route — required when running on *.vercel.app (no DNS control)
// Forwards requests to the Clerk Frontend API on behalf of the app

function getFrontendApiCandidates() {
  const explicit = process.env.CLERK_FRONTEND_API_URL?.trim();
  const fallback = "https://enjoyed-gull-16.clerk.accounts.dev";

  return [explicit, fallback].filter(
    (value, index, array): value is string =>
      Boolean(value) && array.indexOf(value) === index,
  );
}

export const runtime = "nodejs";

async function handleRequest(req: Request, path: string[]) {
  const candidates = getFrontendApiCandidates();
  if (candidates.length === 0) {
    return new Response("No Clerk frontend API configured", { status: 500 });
  }

  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  // Remove headers that shouldn't be forwarded
  headers.delete("connection");

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  let lastError: unknown;
  for (const frontendApi of candidates) {
    try {
      const target = `${frontendApi}/${path.join("/")}${url.search}`;
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
    } catch (error) {
      lastError = error;
    }
  }

  const message =
    lastError instanceof Error
      ? `Failed to reach Clerk frontend API: ${lastError.message}`
      : "Failed to reach Clerk frontend API";
  return new Response(message, { status: 502 });
}

type Params = { params: Promise<{ path?: string[] }> };

export async function GET(req: Request, { params }: Params) {
  return handleRequest(req, (await params).path ?? []);
}
export async function POST(req: Request, { params }: Params) {
  return handleRequest(req, (await params).path ?? []);
}
export async function PUT(req: Request, { params }: Params) {
  return handleRequest(req, (await params).path ?? []);
}
export async function DELETE(req: Request, { params }: Params) {
  return handleRequest(req, (await params).path ?? []);
}
export async function PATCH(req: Request, { params }: Params) {
  return handleRequest(req, (await params).path ?? []);
}
