import path from 'path';
import url from 'url';
import { promises as fs } from 'fs';
import mime from "mime";
const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const STATIC_FILES = '/asserts/';
export default async function staticFiles(request, response) {
    const rpath = url.parse(request.url || '/').path || '/';
    const file_path = path.join(ROOT, FRONTEND_DIR, rpath);
    try {
        if (rpath.startsWith(STATIC_FILES)) {
            const file = await fs.readFile(file_path);
            const file_mime = mime.getType(file_path) || 'text/plain';
            response.writeHead(200, { 'Content-Type': file_mime });
            response.end(file);
        }
        else {
            throw new Error(`could found ${rpath}`);
        }
    }
    catch (error) {
        try {
            const index = await fs.readFile(`${file_path}index.html`);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(index);
        }
        catch (error) {
            response.writeHead(404);
            response.end(`404 NOT FOUND`);
        }
    }
    return new Promise((res, rej) => {
        res({
            'status': 'fulfilled',
            'request': request,
            'response': response
        });
    });
}
//# sourceMappingURL=static-files.js.map