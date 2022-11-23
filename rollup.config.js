// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve'
const customResolver = nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss', '.css'] });


const interpreter = {
    input: './core/index.ts',
    output: [
        {
            file: './dev.esm.js',
            format: 'es',
        },
        {
            file: './dev.cjs.js',
            format: 'cjs',
        },
        {
            file: './index.js',
            format: 'es',
        }
    ],
    plugins: [
        typescript(),
        alias({ customResolver }),
        // uglify({ mangle: {  toplevel: true}, compress: { toplevel: true } }),
    ],
};

const parser = {
    input: './acorn/index.ts',
    output: [
        {
            file: './acorn.esm.js',
            format: 'es',
        },
        {
            file: './acorn.cjs.js',
            format: 'cjs',
        }
    ],
    plugins: [
        typescript(),
        alias({ customResolver }),
    ],
}


export default  [interpreter, parser];