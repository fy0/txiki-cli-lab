export default {
    fetch(request: Request, context: { args: readonly string[]; command: string }) {
        const url = new URL(request.url);

        return Response.json({
            command: context.command,
            path: url.pathname,
            args: context.args,
            time: new Date().toISOString(),
        });
    },
};
