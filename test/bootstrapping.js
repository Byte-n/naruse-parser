import { run } from './dist/dev.esm.js';
import fs from 'fs';
const code = fs.readFileSync('../dist/dev.cjs.js', 'utf-8');

const ccc = run(code);
const qwe = ccc.run(`

const qw = () => {
    return 123;
}

exports.qw = qw;

function qqqq () {
    return 123;
}

`);

console.log(qwe.qw.toString());