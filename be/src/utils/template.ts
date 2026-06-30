import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

export function renderTemplate(templateName: string, data: Record<string, unknown>): string {
  if (!templateCache.has(templateName)) {
    const filePath = path.join(import.meta.dirname, '..', 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    templateCache.set(templateName, Handlebars.compile(source));
  }

  const template = templateCache.get(templateName)!;
  return template(data);
}
