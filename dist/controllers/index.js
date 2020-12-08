import { promises as fs } from "fs";
import url from "url";
import path from "path";
import mime from "mime";
const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const fn_index = async function (request, response) {
    const rpath = url.parse(request.url || '/').path || '/';
    try {
        const file_path = path.join(ROOT, FRONTEND_DIR, rpath, 'index.html');
        const file = await fs.readFile(file_path);
        const file_mime = mime.getType(file_path);
        response.writeHead(200, { 'Content-Type': file_mime || 'text/html' });
        response.end(file);
    }
    catch (error) {
        console.error(error);
        response.writeHead(404);
        response.end();
    }
};
const controllerObj = {
    'GET /': fn_index
};
export default controllerObj;
//# sourceMappingURL=index.js.map