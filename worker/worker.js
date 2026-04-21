export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = "portfolio-f40.pages.dev";

    const response = await fetch(
      new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow",
      })
    );

    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Proxied-By", "kenbui-worker");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
