import { IncomingMessage, ServerResponse } from "http";

export default class router {
    private get_method: Record<string, any> = {};
    private post_method: Record<string, any> = {};

    public get(path: string, func: any): void {
        this.get_method[path] = func;
    }

    public post(path: string, func: any): void {
        this.post_method[path] = func;
    }

    public route(request: IncomingMessage, response: ServerResponse): void {
        if ((request.method !== 'GET') && (request.method !== 'POST')) {
            throw new Error(`unsupported method ${request.method}`);
        }

        if (!request.url) throw new Error('no request url');
        switch (request.method) {
            case 'GET':
                this.get_method[request.url]();
                break;
            case 'POST':
                this.post_method[request.url]();
                break;
            default:
                throw new Error(`unsupported method ${request.method}`);
        }
    }
}