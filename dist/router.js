export default class Router {
    constructor() {
        this.get_method = {};
        this.post_method = {};
    }
    get(path, func) {
        if (!this.get_method[path]) {
            this.get_method[path] = func;
        }
    }
    post(path, func) {
        if (!this.post_method[path]) {
            this.post_method[path] = func;
        }
    }
    route(request, response) {
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
        if (!this.get_method[request.url] && !this.post_method[request.url]) {
            return new Promise((res, rej) => {
                res({
                    'status': 'pending',
                    'request': request,
                    'response': response
                });
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
            });
        });
    }
}
//# sourceMappingURL=router.js.map