// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import {
    uglify
} from 'rollup-plugin-uglify';
import {
    nodeResolve
} from '@rollup/plugin-node-resolve'
const customResolver = nodeResolve({
    extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss', '.css']
});
import dts from 'rollup-plugin-dts';

const interpreter = {
    input: './core/index.ts',
    output: [{
            file: './dist/dev.esm.js',
            format: 'es',
        },
        {
            file: './dist/dev.cjs.js',
            format: 'cjs',
        },
        {
            file: './dist/index.js',
            format: 'cjs',
        }
    ],
    plugins: [
        typescript(),
        alias({
            customResolver
        }),
        // uglify({ mangle: {  toplevel: true}, compress: { toplevel: true } }),
    ],
};

const parser = {
    input: './acorn/index.ts',
    output: [{
            file: './dist/acorn.esm.js',
            format: 'es',
        },
        {
            file: './dist/acorn.cjs.js',
            format: 'cjs',
        }
    ],
    plugins: [
        typescript(),
        alias({
            customResolver
        }),
    ],
}

const dtsConfig = {
    input: "./dist/core/index.d.ts",
    output: [{
            file: "dist/dev.esm.d.ts",
            format: "es"
        },
        {
            file: "dist/dev.cjs.d.ts",
            format: "cjs"
        }
    ],
    plugins: [dts()],
};


export default [interpreter, parser, dtsConfig];