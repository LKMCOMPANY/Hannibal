/**
 * Hannibal Reverse Proxy Worker (Cloudflare)
 *
 * Proxies custom-domain requests to the Vercel deployment,
 * forwarding the original hostname so the Next.js middleware
 * can resolve the correct tenant site.
 */

const VERCEL_BACKEND = "https://hannibal.media";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const originalHost = url.hostname;

  const targetUrl = new URL(url.pathname + url.search, VERCEL_BACKEND);

  const newHeaders = new Headers();
  for (const [key, value] of request.headers) {
    newHeaders.set(key, value);
  }

  newHeaders.set("Host", new URL(VERCEL_BACKEND).hostname);
  newHeaders.set("X-Forwarded-Host", originalHost);
  newHeaders.set("X-Tenant-Host", originalHost);
  newHeaders.set("X-Forwarded-Proto", "https");

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: "manual"
  });

  const response = await fetch(newRequest);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("X-Hannibal-Proxy", "active");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}
