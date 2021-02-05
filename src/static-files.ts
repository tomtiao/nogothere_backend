import { IncomingMessage, ServerResponse } from "http";
import path from 'path';
import url from 'url';
import { promises as fs } from 'fs';
import mime from "mime";
import fileNotFound from "./fileNotFound.js";
import { RequestStatus } from "./definition/requestStatus.js";
import { RequestObject } from "./definition/requestObject.js";

const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = path.join('../', 'tomtiao.github.io');
const STATIC_FILES = '/assets/';

export default async function staticFiles(request: IncomingMessage, response: ServerResponse): Promise<RequestObject> {
    const rpath = url.parse(request.url || '/').path || '/';
    const file_path = path.join(ROOT, FRONTEND_DIR, rpath);

    try {
        if (rpath.startsWith(STATIC_FILES)) {
            const file = await fs.readFile(file_path);
            const file_mime = mime.getType(file_path) || 'text/plain';
            response.writeHead(200, { 'Content-Type': file_mime });
            response.end(file);
        } else { // not in static files dir, pass request to next func
            return Promise.resolve({
                status: RequestStatus.PENDING,
                request: request,
                response: response
            });
        }
    } catch (error) { // seems no requested file in static files, dispatch request to not found file handler
        console.error(`There is something wrong with static-files.js, error: ${error}`);
        try {
            await fileNotFound(request, response, false);
        } catch (error) {
            console.error(`There is something wrong with fileNotFound, error: ${error}`);
        }
    }

    // successfully handled request. mark request as 'resolved'
    return Promise.resolve({
        status: RequestStatus.RESOLVED,
        request: request,
        response: response
    });
}
