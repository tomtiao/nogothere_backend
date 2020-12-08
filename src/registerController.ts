import { promises as fs } from 'fs';
import path from 'path';
import Router from './router.js';
import { ControllerObject } from './definition/controller.js';

export default function registerController(router: Router): void {
    const ROOT = path.resolve(process.argv[2] || '.');
    const CONTROLLERS_DIR = '/dist/controllers';

    function addMapping(router: Router, mapping: ControllerObject) {
        for (const [url, func] of Object.entries(mapping)) {
            if (url.startsWith('GET ')) {
                const path = url.substr(4);
                router.get(path, func);
                console.log(`register URL mapping: GET ${path}`);
            } else if (url.startsWith('POST ')) {
                const path = url.substr(5);
                router.post(path, func);
                console.log(`register URL mapping: POST ${path}`);
            } else {
                throw new Error(`invalid URL: ${url}`);
            }
        }
    }

    async function addController(router: Router) {
        const files = await fs.readdir(path.join(ROOT, CONTROLLERS_DIR));

        const js_files = files.filter(file => {
            return file.endsWith('.js');
        });

        js_files.forEach(async file => {
            console.log(`process controller: ${file}...`);

            try {
                const { default: mapping } = await import(path.join(ROOT, CONTROLLERS_DIR, file));
                addMapping(router, mapping);
            } catch (error) {
                console.error(error);
            }
        });
    }

    addController(router);
}