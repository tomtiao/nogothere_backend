import path from "path";
import { ControllerFunc } from "../definition/controller";
import { promises as fs } from 'fs';
import fileNotFound from "../fileNotFound";
const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = '/dist/tomtiao.github.io';
const ARTICLES = '/articles';

const fn_article: ControllerFunc = async function (request, response): Promise<void> {
    const articles_path = path.join(ROOT, FRONTEND_DIR, ARTICLES);

    try {
        const articles_xmls = await fs.readdir(articles_path);
        const articles_data: ({ 'fileName': string, 'content': string })[] = [];
        articles_xmls.forEach(async xml => {
            try {
                const file = await fs.readFile(path.join(ROOT, FRONTEND_DIR, ARTICLES, xml));
                articles_data.push({
                    'fileName': xml,
                    'content': file.toString()
                });
            } catch (error) {
                response.writeHead(500)
                    .end();
            }
        });
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            'articles': articles_data
        }));
    } catch (error) {
        console.error(error);
        await fileNotFound(request, response);
    }
};

export default {
    'GET /article': fn_article
};