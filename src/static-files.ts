import { IncomingMessage, ServerResponse } from "http";
import path from 'path';
import url from 'url';
import { promises as fs } from 'fs';
import mime from "mime";
import fileNotFound from "./fileNotFound";

const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const STATIC_FILES = '/assets/';

export default async function staticFiles(request: IncomingMessage, response: ServerResponse): Promise<{ 'status': ('pending' | 'resolved'), 'request': IncomingMessage, 'response': ServerResponse }> {
    const rpath = url.parse(request.url || '/').path || '/';
    const file_path = path.join(ROOT, FRONTEND_DIR, rpath);

    try {
        if (rpath.startsWith(STATIC_FILES)) {
            const file = await fs.readFile(file_path);
            const file_mime = mime.getType(file_path) || 'text/plain';
            response.writeHead(200, { 'Content-Type': file_mime });
            response.end(file);
        } else { // not in static files dir, pass request to next func
            return new Promise((res) => {
                res({
                    'status': 'pending',
                    'request': request,
                    'response': response
                })
            });
        }
    } catch (error) { // seems not requested file in static files, dispatch request to not found file handler
        try {
            await fileNotFound(request, response);
        } catch (error) {
            console.error(`There is something wrong with static-files.js, error: ${error}`);
        }
    }

    // successfully handled request. mark request as 'resolved'
    return new Promise((res) => {
        res({
            'status': 'resolved',
            'request': request,
            'response': response
        })
    });
}
