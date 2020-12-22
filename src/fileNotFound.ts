import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { promises as fs } from 'fs';
import url from 'url';
import template from './template.js';

const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const VIEWS = '/views/';

export default async function fileNotFound(request: IncomingMessage,
    response: ServerResponse): Promise<void> {
    if (!request.url) {
        throw new Error('unexpected empty request url.');
    }
    const views_path = path.join(ROOT, FRONTEND_DIR, VIEWS);

    try {
        const not_found_file = await fs.readFile(path.join(views_path, 'not_found.html'));
        let not_found_html = not_found_file.toString();

        const data = {
            'requestDir': url.parse(request.url).pathname || request.url,
            'message': 'Oops! Seems there is no requested file on this server.'
        };
        
        not_found_html = template.render(not_found_html, data);
        
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end(not_found_html);
    } catch (error) {
        console.error(`Something wrong in fileNotFound.js, error: ${error}`);
        response.writeHead(500);
    }
}