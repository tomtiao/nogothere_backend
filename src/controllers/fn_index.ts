import { promises as fs } from 'fs';
import { ControllerFunc } from '../definition/controller.js';
import path from 'path';
import template from '../template.js';

const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const VIEWS = '/views/';

const fn_index: ControllerFunc = async function (request, response): Promise<void> {
    const views_path = path.join(ROOT, FRONTEND_DIR, VIEWS);

    try {
        const base_file = await fs.readFile(path.join(views_path, 'base.html'));
        let base_html = base_file.toString();
        
        const data = {
            'title': 'foo',
            'content': `Process ${request.method} ${request.url}.`
        };

        base_html = template.render(base_html, data);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(base_html);
    } catch (error) {
        response.writeHead(500);
        response.end();
        console.error(error);
    }
}

export default {
    'GET /': fn_index
};