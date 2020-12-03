"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const mime_1 = __importDefault(require("mime"));
const ROOT = path_1.default.resolve(process.argv[2] || '.');
const DIST_DIR = './dist/tomtiao.github.io';
console.log(`Static root dir: ${ROOT}`);
const server = http_1.default.createServer(async (request, response) => {
    const pathname = url_1.default.parse(request.url || '.').pathname || '.';
    const filepath = path_1.default.join(ROOT, DIST_DIR, pathname);
    try {
        const stats = await fs_1.promises.stat(filepath);
        if (stats.isFile()) {
            console.log(`200 ${request.url}`);
            const file_mime = mime_1.default.getType(filepath) || 'text/html';
            response.writeHead(200, { 'Content-Type': file_mime });
            const file = await fs_1.promises.readFile(filepath);
            response.end(file);
        }
        else if (stats.isDirectory()) {
            const index = await fs_1.promises.readFile(`${filepath}index.html`);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(index);
        }
        else {
            throw new Error('404 not found');
        }
    }
    catch (error) {
        console.log(`404 ${request.url}`);
        response.writeHead(404);
        response.end('404 not found');
    }
});
const port = 8080;
server.listen(port);
console.log(`Server is running on port ${port}`);
