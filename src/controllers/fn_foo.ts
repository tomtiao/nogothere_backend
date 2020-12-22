import { ControllerFunc } from "../definition/controller.js";

const foo_get: ControllerFunc = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    response.end('You GET foo');
};

const foo_post: ControllerFunc = function (request, response) {
    const data: unknown[] = [];
    request.on('data', (chunk) => {
        data.push(chunk);
    });
    request.on('end', () => {
        response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        response.end(`${request.method} foo ${data[0]}`);
    });
};

export default {
    'GET /foo': foo_get,
    'POST /foo': foo_post
};