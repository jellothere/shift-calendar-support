import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const publicFiles = ['index.html', 'privacy/index.html', 'terms/index.html', 'style.css', 'assets/icon.png'];

// Publish only this explicit list, never the repository or build-tool directory.
await rm(output, { recursive: true, force: true });
for (const file of publicFiles) {
  await mkdir(dirname(join(output, file)), { recursive: true });
  await cp(join(root, file), join(output, file));
}

// Fail the deployment if a local link, image, stylesheet or fragment is broken.
for (const file of publicFiles.filter(file => file.endsWith('.html'))) {
  const html = await readFile(join(output, file), 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = new URL(match[1], `https://site.invalid/${file}`);
    if (target.origin !== 'https://site.invalid') continue;
    let path = decodeURIComponent(target.pathname).replace(/^\//, '');
    if (!path || path.endsWith('/')) path += 'index.html';
    const resolved = join(output, path);
    const info = await stat(resolved).catch(() => null);
    if (!info?.isFile()) throw new Error(`${file}: missing local target ${match[1]}`);
    if (target.hash && path.endsWith('.html')) {
      const destination = await readFile(resolved, 'utf8');
      const id = decodeURIComponent(target.hash.slice(1));
      if (!destination.includes(`id="${id}"`)) throw new Error(`${file}: missing fragment ${match[1]}`);
    }
  }
}
console.log(`Built and checked ${publicFiles.length} public files in dist/.`);
