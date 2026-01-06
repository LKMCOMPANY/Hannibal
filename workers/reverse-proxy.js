/**
 * Hannibal Reverse Proxy Worker
 * Service Worker Format (Legacy but robust for simple API uploads)
 */

const RENDER_BACKEND = "https://hannibal-isp1.onrender.com";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const originalHost = url.hostname;
  
  // Construct the target URL on Render
  const targetUrl = new URL(url.pathname + url.search, RENDER_BACKEND);

  // Clone the original headers
  // Note: In Service Worker format, we need to be careful with immutable headers
  const newHeaders = new Headers();
  for (const [key, value] of request.headers) {
    newHeaders.set(key, value);
  }
  
  // 1. Set 'Host' to Render's domain so Render accepts the request
  newHeaders.set("Host", new URL(RENDER_BACKEND).hostname);
  
  // 2. Set 'X-Forwarded-Host' to the original domain (Client Domain)
  newHeaders.set("X-Forwarded-Host", originalHost);
  
  // 3. Ensure 'X-Forwarded-Proto' is set
  newHeaders.set("X-Forwarded-Proto", "https");

  // Create the new request
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: "manual"
  });

  // Fetch from Render
  const response = await fetch(newRequest);
  
  // Return the response
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("X-Hannibal-Proxy", "active");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}