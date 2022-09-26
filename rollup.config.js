// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve'
const customResolver = nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss', '.css'] });

export default {
    input: './core/index.ts',
    output: [
        {
            file: './dev.esm.js',
            format: 'es',
        },
        {
            file: './dev.cjs.js',
            format: 'cjs',
        }
    ],
    plugins: [
        typescript(),
        alias({ customResolver }),
        // uglify({ mangle: {  toplevel: true}, compress: { toplevel: true } }),
    ],
};