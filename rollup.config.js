const path = require('path');

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import minify from 'rollup-plugin-babel-minify';

const babelConfig = {
    presets: ['@babel/preset-flow'],
    plugins: [
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-object-assign',
    ],
    exclude: 'node_modules/**',
};

const commonPlugins = [resolve(), commonjs({ include: 'node_modules/**' })];

const shared = {
    input: path.resolve('./src/index.js'),
    external: ['react', 'react-dom'],
};

export default [
    {
        ...shared,
        output: {
            file: 'dist/react-shuttle.umd.min.js',
            format: 'umd',
            name: 'ReactShuttle',
            sourcemap: true,
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
        },
        plugins: [
            babel({
                ...babelConfig,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            forceAllTransforms: true,
                            useBuiltIns: 'usage',
                            corejs: 3,
                            targets: {
                                browsers: '> 0.25%, not dead',
                            },
                        },
                    ],
                    ['@babel/preset-react', { development: false }],
                    ...babelConfig.presets,
                ],
            }),
            ...commonPlugins,
            minify({ comments: false }),
        ],
    },
    {
        ...shared,
        output: {
            file: 'dist/react-shuttle.cjs.js',
            format: 'cjs',
        },
        plugins: [
            babel({
                ...babelConfig,
                presets: [
                    ['@babel/preset-react', { development: true }],
                    ...babelConfig.presets,
                ],
            }),
            ...commonPlugins,
        ],
    },
    {
        ...shared,
        output: {
            file: 'dist/react-shuttle.es.js',
            format: 'esm',
        },
        plugins: [
            babel({
                ...babelConfig,
                presets: [
                    ['@babel/preset-react', { development: true }],
                    ...babelConfig.presets,
                ],
            }),
            ...commonPlugins,
            replace({
                'process.env.NODE_ENV': process.env.NODE_ENV || "'production'",
            }),
        ],
    },
];
