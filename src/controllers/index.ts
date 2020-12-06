import { IncomingMessage, ServerResponse } from "http";

function fn_index(request: IncomingMessage, response: ServerResponse): void {
    response.end(`Get request ${request.method} ${request.url}`);
}

export default {
    'GET /': fn_index,
    'POST /': (): void => {
        console.log('hi');
    },
    'GET /foo': (foo: number): number => {
        return foo;
    }
};