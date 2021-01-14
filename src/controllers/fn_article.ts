import path from "path";
import { ControllerFunc } from "../definition/controller.js";
import fs from 'fs/promises';
import fileNotFound from "../fileNotFound.js";
const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = path.join('../', 'tomtiao.github.io');
const ARTICLES = '/articles';

const fn_article: ControllerFunc = async function (request, response): Promise<void> {
    const articles_path = path.join(ROOT, FRONTEND_DIR, ARTICLES);

    try {
        const articles_xmls = await fs.readdir(articles_path);
        const articles_data: ({ 'fileName': string, 'content': string })[] = [];
        for (const xml of articles_xmls) {
            try {
                const file = await fs.readFile(path.join(ROOT, FRONTEND_DIR, ARTICLES, xml));
                articles_data.push({
                    'fileName': xml,
                    'content': file.toString()
                });
            } catch (error) {
                response.writeHead(500)
                        .end();
                console.error(`There is a problem with fn_article.js, error: ${error}`);
                return;
            }
        }
    
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            'articles': articles_data
        }));
    } catch (error) {
        console.error(error);
        await fileNotFound(request, response, false);
    }
};

export default {
    'GET /article': fn_article
};