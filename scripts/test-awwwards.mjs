import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = new URL('../tests/awwwards/', import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith('.test.mjs')).sort();
const args = ['--import', new URL('./register-typescript-loader.mjs', import.meta.url).href, '--test', ...files.map((file) => fileURLToPath(new URL(file, directory)))];
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
