export default {
    fetch(request, context) {
        const url = new URL(request.url);
        const message = context.args[0] ?? 'hello from txiki-cli-lab';

        return new Response(`<!doctype html>
<html>
  <body>
    <h1>${message}</h1>
    <p>Path: ${url.pathname}</p>
  </body>
</html>`, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
            },
        });
    },
};
