import { IncomingMessage, ServerResponse } from "http";
import { ControllerFunc, ControllerObject } from "./definition/controller.js";

export default class Router {
    private get_method: ControllerObject = {};
    private post_method: ControllerObject = {};

    public get(path: string, func: ControllerFunc): void {
        if (!this.get_method[path]) {
            this.get_method[path] = func;
        }
    }

    public post(path: string, func: ControllerFunc): void {
        if (!this.post_method[path]) {
            this.post_method[path] = func;
        }
    }

    public route(request: IncomingMessage, response: ServerResponse): Promise<{ 'status': ('pending' | 'resolved'), 'request': IncomingMessage, 'response': ServerResponse }> {
        if ((request.method !== 'GET') && (request.method !== 'POST')) {
            response.writeHead(405);
            response.end(`unsupported method ${request.method}`);
            throw new Error(`unsupported method ${request.method}`);
        }

        if (!request.url) {
            response.writeHead(404);
            response.end('could not handle request url');
            throw new Error('could not handle request url');
        }

        // if no specific func, can't handle, pass to next func
        if (!this.get_method[request.url] && !this.post_method[request.url]) {
            return new Promise((res, rej) => {
                res({
                    'status': 'pending',
                    'request': request,
                    'response': response
                })
            });
        }

        switch (request.method) {
            case 'GET':
                this.get_method[request.url](request, response);
                break;
            case 'POST':
                this.post_method[request.url](request, response);
                break;
            default:
                throw new Error(`unsupported method ${request.method}`);
        }

        return new Promise((res, rej) => {
            res({
                'status': 'resolved',
                'request': request,
                'response': response
            })
        });
    }
}