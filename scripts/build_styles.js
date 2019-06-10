#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const sass = require('sass');
const mkdirp = require('mkdirp');

const BASE = path.resolve(`${__dirname}/../`);

console.log(BASE);

const { css, map } = sass.renderSync({
    file: path.join(BASE + '/styles/shuttle.scss'),
    sourceMap: true,
    sourceMapContents: true,
    outputStyle: 'compressed'
});

try {
    mkdirp.sync(`${BASE}/pkg/dist-web/css`);
    mkdirp.sync(`${BASE}/pkg/dist-node/css`);
    mkdirp.sync(`${BASE}/pkg/dist-src/css`);

    fs.writeFileSync(BASE + '/pkg/dist-web/css/shuttle.css', css);
    fs.writeFileSync(BASE + '/pkg/dist-node/css/shuttle.css', css);
    fs.writeFileSync(BASE + '/pkg/dist-src/css/shuttle.css', css);
} catch (e) {
    console.log(e);
}
