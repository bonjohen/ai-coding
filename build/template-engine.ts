import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface TemplateContext {
  [key: string]: unknown;
}

const partialCache = new Map<string, string>();

/**
 * Load a template file from disk (with caching for partials).
 */
export function loadTemplate(templatePath: string): string {
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

/**
 * Load and cache a partial template.
 */
function loadPartial(partialsDir: string, name: string): string {
  const key = `${partialsDir}/${name}`;
  if (partialCache.has(key)) {
    return partialCache.get(key)!;
  }
  const content = loadTemplate(join(partialsDir, `${name}.html`));
  partialCache.set(key, content);
  return content;
}

/**
 * Resolve simple variable placeholders: {{ varName }}
 * Supports dot notation: {{ site.title }}
 */
function resolveVariables(template: string, context: TemplateContext): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, path: string) => {
    const value = resolvePath(context, path);
    if (value === undefined || value === null) return '';
    return escapeHtml(String(value));
  });
}

/**
 * Resolve raw (unescaped) variable placeholders: {{{ varName }}}
 */
function resolveRawVariables(template: string, context: TemplateContext): string {
  return template.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_match, path: string) => {
    const value = resolvePath(context, path);
    if (value === undefined || value === null) return '';
    return String(value);
  });
}

/**
 * Resolve dot-notation path in context object.
 */
function resolvePath(context: TemplateContext, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = context;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Find the matching closing tag for a block, handling nesting.
 * Returns the index of the start of the closing tag, or -1 if not found.
 */
function findClosingTag(template: string, openTag: string, closeTag: string, startPos: number): number {
  let depth = 1;
  let pos = startPos;
  while (pos < template.length && depth > 0) {
    const nextOpen = template.indexOf(openTag, pos);
    const nextClose = template.indexOf(closeTag, pos);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + openTag.length;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + closeTag.length;
    }
  }
  return -1;
}

/**
 * Process {{#each items}} ... {{/each}} blocks (supports nesting).
 */
function resolveEachBlocks(template: string, context: TemplateContext): string {
  const openPattern = '{{#each ';
  const closeTag = '{{/each}}';
  let result = '';
  let pos = 0;

  while (pos < template.length) {
    const openIdx = template.indexOf(openPattern, pos);
    if (openIdx === -1) {
      result += template.slice(pos);
      break;
    }

    result += template.slice(pos, openIdx);

    const tagEnd = template.indexOf('}}', openIdx);
    if (tagEnd === -1) { result += template.slice(openIdx); break; }

    const path = template.slice(openIdx + openPattern.length, tagEnd).trim();
    const bodyStart = tagEnd + 2;

    const closeIdx = findClosingTag(template, '{{#each ', closeTag, bodyStart);
    if (closeIdx === -1) { result += template.slice(openIdx); break; }

    const body = template.slice(bodyStart, closeIdx);
    pos = closeIdx + closeTag.length;

    const items = resolvePath(context, path);
    if (!Array.isArray(items)) continue;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemContext: TemplateContext = {
        ...context,
        this: item,
        '@index': index,
        '@first': index === 0,
        '@last': index === items.length - 1,
      };
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.assign(itemContext, item);
      }
      result += renderTemplate(body, itemContext);
    }
  }

  return result;
}

/**
 * Process {{#if condition}} ... {{else}} ... {{/if}} blocks (supports nesting).
 */
function resolveIfBlocks(template: string, context: TemplateContext): string {
  const openPattern = '{{#if ';
  const closeTag = '{{/if}}';
  let result = '';
  let pos = 0;

  while (pos < template.length) {
    const openIdx = template.indexOf(openPattern, pos);
    if (openIdx === -1) {
      result += template.slice(pos);
      break;
    }

    result += template.slice(pos, openIdx);

    const tagEnd = template.indexOf('}}', openIdx);
    if (tagEnd === -1) { result += template.slice(openIdx); break; }

    const path = template.slice(openIdx + openPattern.length, tagEnd).trim();
    const bodyStart = tagEnd + 2;

    const closeIdx = findClosingTag(template, '{{#if ', closeTag, bodyStart);
    if (closeIdx === -1) { result += template.slice(openIdx); break; }

    const body = template.slice(bodyStart, closeIdx);
    pos = closeIdx + closeTag.length;

    const value = resolvePath(context, path);
    const isTruthy = Array.isArray(value) ? value.length > 0 : !!value;

    // Split on top-level {{else}} only (not nested ones)
    const elseIdx = findTopLevelElse(body);
    const trueBranch = elseIdx === -1 ? body : body.slice(0, elseIdx);
    const falseBranch = elseIdx === -1 ? '' : body.slice(elseIdx + '{{else}}'.length);

    result += isTruthy ? renderTemplate(trueBranch, context) : renderTemplate(falseBranch, context);
  }

  return result;
}

/**
 * Find a top-level {{else}} that isn't nested inside another {{#if}}.
 */
function findTopLevelElse(body: string): number {
  let depth = 0;
  let pos = 0;
  while (pos < body.length) {
    if (body.startsWith('{{#if ', pos)) {
      depth++;
      pos += 6;
    } else if (body.startsWith('{{/if}}', pos)) {
      depth--;
      pos += 7;
    } else if (depth === 0 && body.startsWith('{{else}}', pos)) {
      return pos;
    } else {
      pos++;
    }
  }
  return -1;
}

/**
 * Process {{> partialName}} includes.
 */
function resolvePartials(template: string, context: TemplateContext): string {
  const partialsDir = context._partialsDir as string;
  if (!partialsDir) return template;

  return template.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_match, name: string) => {
    const partial = loadPartial(partialsDir, name);
    return renderTemplate(partial, context);
  });
}

/**
 * Process {{#slot name}} ... {{/slot}} definitions and {{#block name}} ... {{/block}} inserts.
 * Layouts define slots; pages fill blocks.
 */
export function applyLayout(layoutTemplate: string, pageContent: string, context: TemplateContext): string {
  // Extract blocks from page content
  const blocks = new Map<string, string>();
  const blockRegex = /\{\{#block\s+([\w-]+)\s*\}\}([\s\S]*?)\{\{\/block\}\}/g;
  let match;
  while ((match = blockRegex.exec(pageContent)) !== null) {
    blocks.set(match[1], match[2]);
  }

  // Replace slots in layout with corresponding blocks
  let result = layoutTemplate.replace(
    /\{\{#slot\s+([\w-]+)\s*\}\}([\s\S]*?)\{\{\/slot\}\}/g,
    (_match, name: string, defaultContent: string) => {
      return blocks.get(name) || defaultContent;
    }
  );

  return renderTemplate(result, context);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Full template render pipeline.
 */
export function renderTemplate(template: string, context: TemplateContext): string {
  let result = template;
  result = resolveEachBlocks(result, context);
  result = resolveIfBlocks(result, context);
  result = resolvePartials(result, context);
  result = resolveRawVariables(result, context);
  result = resolveVariables(result, context);
  return result;
}

/**
 * Clear the partial cache (between builds).
 */
export function clearTemplateCache(): void {
  partialCache.clear();
}
