import { promises as fs } from 'fs';
import { ControllerFunc } from '../definition/controller.js';
import path from 'path';

const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = path.join('../', 'tomtiao.github.io');

const fn_index: ControllerFunc = async function (request, response): Promise<void> {
    const index_path = path.join(ROOT, FRONTEND_DIR);

    try {
        const base_file = await fs.readFile(path.join(index_path, 'index.html'));
        const base_html = base_file.toString();

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