import http from 'http';
import url from 'url';
import path from 'path';
import { promises as fs} from 'fs';
import mime from 'mime';

const ROOT = path.resolve(process.argv[2] || '.');
const DIST_DIR = './dist/tomtiao.github.io';

console.log(`Static root dir: ${ROOT}`);

const server = http.createServer(async (request, response) => {
    const pathname = url.parse(request.url || '.').pathname || '.';
    const filepath = path.join(ROOT, DIST_DIR, pathname);
    // console.log(`Process ${request.method} ${request.url}`);

    try {
        const stats = await fs.stat(filepath);
        if (stats.isFile()) {
            console.log(`200 ${request.url}`);
            const file_mime = mime.getType(filepath) || 'text/html';
            response.writeHead(200, {'Content-Type': file_mime });
            const file = await fs.readFile(filepath);
            response.end(file);
        } else if (stats.isDirectory()) {
            const index = await fs.readFile(`${filepath}index.html`);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(index);
        } else {
            throw new Error('404 not found');
        }
    } catch (error) {
        console.log(`there's a error with ${request.url}, ${error}`);
        response.writeHead(404);
        response.end('404 not found');
    }
});

const port = process.env.PORT || 8080;

server.listen(port);

console.log(`Server is running on port ${port}`);