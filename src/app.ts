import http from 'http';
import path from 'path';
import Router from './router.js';
import registerController from './registerController.js';
import staticFiles from './static-files.js';
import fileNotFound from './fileNotFound.js';

const ROOT = path.resolve(process.argv[2] || '.');

console.log(`Static root dir: ${ROOT}`);
const router = new Router();
registerController(router);

const server = http.createServer(async (request, response) => {
    console.log(`Process ${request.method} ${request.url}`);

    try {
        const request_obj = await staticFiles(request, response);
        if (request_obj.status !== 'resolved') {
            router.route(request, response);
        }
        if (request_obj.status !== 'resolved') {
            fileNotFound(request, response);
        }
    } catch (error) {
        console.error(error);
    }
});

const port = process.env.PORT || 8080;

server.listen(port);

console.log(`Server is running on port ${port}`);