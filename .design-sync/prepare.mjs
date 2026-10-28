// Prepares the design-sync inputs; run after building the packages, before package-build.
// 1. packages/client/.ds-brand/ (cfg.cssEntry): LibreChat's compiled Tailwind
//    stylesheet and the package's component CSS, then the brand layer (on-prem adapter.css + the client's
//    theme.css), plus the fonts and logos those reference. CLIENT picks the pack.
// 2. node_modules/crypto: data-provider imports Node's crypto (the app gets a Vite
//    polyfill); the design bundle gets a stub - no component hashes at render.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const onPrem = resolve(process.env.ON_PREM ?? join(root, '../on-prem'));
const client = process.env.CLIENT ?? 'nobodywho';
const brandDir = join(onPrem, 'clients', client, 'brand');
const adapter = join(onPrem, 'k3s/librechat/branding/adapter.css');
const out = join(root, 'packages/client/.ds-brand');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const twOut = join(out, 'librechat.tw.css');
execFileSync('npx', ['tailwindcss', '-c', join(here, 'tailwind.config.cjs'),
  '-i', join(root, 'client/src/style.css'), '-o', twOut], { cwd: join(root, 'client'), stdio: 'inherit' });

// Upstream Inter / Roboto Mono faces point at a Vite alias ($fonts) that doesn't
// exist here, and the brand replaces both families anyway.
const tw = readFileSync(twOut, 'utf8').replace(/@font-face\s*{[^}]*\$fonts[^}]*}/g, '');
rmSync(twOut);

for (const f of ['logo.svg', 'logo-dark.svg', 'InterTight-latin.woff2',
  'IBMPlexMono-400-latin.woff2', 'IBMPlexMono-500-latin.woff2']) {
  cpSync(join(brandDir, f), join(out, f));
}
writeFileSync(join(out, 'brand.css'), [
  `/* LibreChat (client/src/style.css, compiled with Tailwind) */\n${tw}`,
  `/* @librechat/client dist/style.css (component-local CSS) */\n${readFileSync(join(root, 'packages/client/dist/style.css'), 'utf8')}`,
  `/* on-prem k3s/librechat/branding/adapter.css */\n${readFileSync(adapter, 'utf8')}`,
  `/* on-prem clients/${client}/brand/theme.css */\n${readFileSync(join(brandDir, 'theme.css'), 'utf8')}`,
].join('\n\n'));
console.log(`wrote ${join(out, 'brand.css')}`);

const shim = join(root, 'node_modules/crypto');
if (!existsSync(shim)) {
  mkdirSync(shim);
  writeFileSync(join(shim, 'package.json'), '{"name":"crypto","version":"0.0.0","main":"index.js"}\n');
  writeFileSync(join(shim, 'index.js'),
    "const unavailable = () => { throw new Error('crypto is not available in the design bundle'); };\n" +
    'module.exports = { createHash: unavailable, randomBytes: unavailable };\n');
}
