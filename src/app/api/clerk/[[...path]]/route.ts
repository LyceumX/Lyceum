// Clerk proxy route — forwards requests to the Clerk Frontend API
function getFrontendApiCandidates() {
  const explicit = process.env.CLERK_FRONTEND_API_URL?.trim();
  const defaultFrontendApi = "https://clerk.lyceum.us.ci";

  return [explicit ?? defaultFrontendApi].filter(
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
  const requestPath = path.join("/");
  const headers = new Headers(req.headers);
  // Remove headers that shouldn't be forwarded
  headers.delete("connection");
  headers.delete("host");
  headers.delete("content-length");

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  let lastError: unknown;
  for (const frontendApi of candidates) {
    try {
      const targetUrl = new URL(`${frontendApi}/${requestPath}${url.search}`);

      const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
        redirect: "manual",
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
