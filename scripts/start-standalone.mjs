import {cp, mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const standalone = path.join(root, '.next', 'standalone');

await mkdir(path.join(standalone, '.next'), {recursive: true});
await cp(path.join(root, 'public'), path.join(standalone, 'public'), {recursive: true});
await cp(path.join(root, '.next', 'static'), path.join(standalone, '.next', 'static'), {recursive: true});

const child = spawn(process.execPath, ['server.js'], {
  cwd: standalone,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || '3000',
    HOSTNAME: '0.0.0.0',
  },
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
