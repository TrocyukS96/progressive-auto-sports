import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = process.cwd();

function withExtension(file) {
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  for (const ext of ['.ts', '.tsx', '.js', '.mjs', '.json']) {
    if (fs.existsSync(file + ext) && fs.statSync(file + ext).isFile()) return file + ext;
  }
  for (const ext of ['.ts', '.tsx', '.js']) {
    const index = path.join(file, `index${ext}`);
    if (fs.existsSync(index)) return index;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const hit = withExtension(path.join(root, specifier.slice(2)));
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL) {
    const parent = fileURLToPath(context.parentURL);
    const hit = withExtension(path.resolve(path.dirname(parent), specifier));
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }
  return nextResolve(specifier, context);
}
