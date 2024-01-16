let html = Bun.file("./sandbox/index.html");

Bun.serve({
  port: 3000,
  async fetch(request: Request): Promise<Response> {
    let url = new URL(request.url);
    let path = url.pathname;
    let method = request.method;
    let headers = request.headers;

    switch (path) {
      case "/api": {
        let body;
        switch (headers.get("content-type")) {
          case "application/json": {
            body = await request.json();
            break;
          }
          default: {
            body = await request.text();
          }
        }
        return new Response(JSON.stringify({ path, method, headers, body }), {
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
      }
      case "/better-beacon.js": {
        return new Response(Bun.file("./dist/index.js"), {
          headers: new Headers({
            "Content-Type": "text/javascript",
          }),
        });
      }
      case "/":
      default: {
        return new Response(html, {
          headers: new Headers({
            "Content-Type": "text/html",
          }),
        });
      }
    }
  },
});
