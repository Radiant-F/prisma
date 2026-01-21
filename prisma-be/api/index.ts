import app from "../src/app";

function isBodyAllowed(method: string) {
  return method !== "GET" && method !== "HEAD";
}

async function readBody(req: any) {
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve());
    req.on("error", (err: Error) => reject(err));
  });

  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  const method = req.method || "GET";
  const host = req.headers?.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);

  const headers: HeadersInit = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (typeof value !== "undefined") {
      headers[key] = Array.isArray(value) ? value.join(",") : String(value);
    }
  }

  const init: RequestInit = {
    method,
    headers,
  };

  if (isBodyAllowed(method)) {
    const body = await readBody(req);
    if (body.length > 0) {
      init.body = body;
    }
  }

  const request = new Request(url.toString(), init);
  const response = await app.handle(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = Buffer.from(await response.arrayBuffer());
  res.end(data);
}
