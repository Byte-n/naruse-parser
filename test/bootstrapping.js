import { run } from '../dist/dev.esm.js';
import fs from 'fs';
const code = fs.readFileSync('./dist/dev.cjs.js', 'utf-8');

const doll1 = run(code);
const doll2 = doll1.run('console.log(123);');
