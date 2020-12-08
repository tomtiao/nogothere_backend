import http from 'http';
import path from 'path';
import Router from './router.js';
import register from './register.js';
import staticFiles from './static-files.js';

const ROOT = path.resolve(process.argv[2] || '.');

console.log(`Static root dir: ${ROOT}`);
const router = new Router();
register(router);

const server = http.createServer(async (request, response) => {
    console.log(`Process ${request.method} ${request.url}`);

    try {
        const res_obj = await router.route(request, response);
        if (res_obj['status'] === 'ongoing') {
            await staticFiles(request, response);
        }
    } catch (error) {
        console.error(error);
    }
});

const port = process.env.PORT || 8080;

server.listen(port);

console.log(`Server is running on port ${port}`);