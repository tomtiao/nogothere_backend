import TemplateData from "./definition/template_data.js";

export default class Template {
    public static render(html: string, data: TemplateData): string {
        for (const [key, val] of Object.entries(data)) {
            const regex = new RegExp(`{{ ${key} }}`, 'g');
            html = html.replace(regex, val);
        }

        return html;
    }
}
