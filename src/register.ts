import fs from 'fs/promises';
import path from 'path';
import myrouter from './myrouter';

export function register(router: myrouter): void {
    const ROOT = path.resolve(process.argv[2] || '.');
    const CONTROLLERS_DIR = '/dist/controllers';

    function addMapping(router: myrouter, mapping: Record<string, any>) {
        mapping.forEach((url: string) => {
            if (url.startsWith('GET ')) {
                const path = url.substr(4);
                router.get(path, mapping[url]);
                console.log(`register URL mapping: GET ${path}`);
            } else if (url.startsWith('POST ')) {
                const path = url.substr(5);
                router.post(path, mapping[url]);
                console.log(`register URL mapping: POST ${path}`);
            } else {
                throw new Error(`invalid URL: ${url}`);
            }
        });
    }

    async function addController(router: myrouter) {
        const files = await fs.readdir(path.join(ROOT, CONTROLLERS_DIR));

        const js_files = files.filter(file => {
            return file.endsWith('.js');
        });

        js_files.forEach(async file => {
            console.log(`process controller: ${file}...`);

            const mapping = await import(path.join(ROOT, CONTROLLERS_DIR, file));
            addMapping(router, mapping);
        });
    }

    addController(router);
}