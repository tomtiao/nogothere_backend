import { IncomingMessage, ServerResponse } from "http";
import { ControllerFunc, ControllerObject } from "./definition/controller.js";
import { RequestObject } from "./definition/requestObject.js";
import { RequestStatus } from "./definition/requestStatus.js";
import url from 'url';

export default class Router {
    private get_method: ControllerObject = new Map<string, ControllerFunc>();
    private post_method: ControllerObject = new Map<string, ControllerFunc>();

    public get(path: string, func: ControllerFunc): void {
        if (!this.get_method.get(path)) {
            this.get_method.set(path, func);
        }
    }

    public post(path: string, func: ControllerFunc): void {
        if (!this.post_method.get(path)) {
            this.post_method.set(path, func);
        }
    }

    public route(request: IncomingMessage, response: ServerResponse): Promise<RequestObject> {
        function isSupportedMethod(request: IncomingMessage, response: ServerResponse) {
            if ((request.method !== 'GET') && (request.method !== 'POST')) {
                response.writeHead(405);
                response.end(`unsupported method ${request.method}`);
                throw new Error(`unsupported method ${request.method}`);
            }
        }

        isSupportedMethod(request, response);
        
        if (!request.url) {
            response.writeHead(500);
            response.end('could not handle request url');
            throw new Error('could not handle request url');
        }

        const pathname = url.parse(request.url).pathname as string;

        // if no specific func, can't handle, pass to next func
        if (!this.get_method.get(pathname) && !this.post_method.get(pathname)) {
            return Promise.resolve({
                status: RequestStatus.PENDING,
                request: request,
                response: response
            });
        }

        switch (request.method) {
            case 'GET':
                (this.get_method.get(pathname) as ControllerFunc)(request, response);
                break;
            case 'POST':
                (this.post_method.get(pathname) as ControllerFunc)(request, response);
                break;
            default:
                throw new Error(`unsupported method ${request.method}`);
        }

        return Promise.resolve({
            status: RequestStatus.RESOLVED,
            request: request,
            response: response
        });
    }
}