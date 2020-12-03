import { IncomingMessage, ServerResponse } from "http";

export default async function index(request: IncomingMessage, response: ServerResponse): Promise<void> {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('Hello World!!!');
}
