import path from "path";
import fs from 'fs/promises';
import url from 'url';
import querystring from 'querystring';
import { ControllerFunc } from "../definition/controller.js";
import fileNotFound from "../fileNotFound.js";
import { IncomingMessage, ServerResponse } from "http";
const ROOT = path.resolve(process.argv[2] || '.');
const FRONTEND_DIR = path.join('../', 'tomtiao.github.io');
const ARTICLE_DIR = '/article';

interface ArticleObject {
    name: string;
    birthtime: string;
    modifiedtime: string;    
}

type ArticleFunc = ControllerFunc;

const articles_path = path.join(ROOT, FRONTEND_DIR, ARTICLE_DIR);

const fn_article: ControllerFunc = async function (request, response): Promise<void> {
    
    const article_list: ArticleFunc = async (request, response): Promise<void> => {
        try {
            let articles_files = await fs.readdir(articles_path);
            articles_files = articles_files.filter((article) => article.endsWith('.md'));
            const data: ArticleObject[] = [];
            for (const md of articles_files) {
                try {
                    const file_stat = await (fs.stat(path.join(articles_path, md)));
                    const file_obj: ArticleObject = {
                        name: md,
                        birthtime: file_stat.birthtime.toLocaleString(),
                        modifiedtime: file_stat.mtime.toLocaleString()
                    }
                    data.push(file_obj);
                } catch (error) {
                    response.writeHead(500)
                            .end();
                    console.error(`There is a problem with fn_article.js, error: ${error}`);
                    return;
                }
            }
        
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(data));
        } catch (error) {
            console.error(error);
            await fileNotFound(request, response, false);
        }
    };

    const article_content = async (request: IncomingMessage, response: ServerResponse, query: string): Promise<void> => {
        const obj: Record<string, unknown> = querystring.parse(query);
        
        if ( Object.prototype.hasOwnProperty.call(obj, 'name') ) {
            try {
                const filepath = path.join(articles_path, `${obj['name']}.html`);

                const content = (await fs.readFile(filepath)).toString();

                response.end(content);
            } catch (error) {
                console.log(error);
                await fileNotFound(request, response, false);
            }
        } else {
            response.writeHead(404)
                    .end();
        }
    }

    const query = url.parse(request.url as string).query;

    if (query) {
        article_content(request, response, query);
    } else {
        article_list(request, response);
    }
};


export default {
    'GET /article': fn_article
};