"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function index(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('Hello World!!!');
}
exports.default = index;
