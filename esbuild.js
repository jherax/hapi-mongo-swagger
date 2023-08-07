const {build} = require('esbuild');
const {Generator} = require('npm-dts');
const {dependencies, devDependencies} = require('./package.json');

new Generator({
  entry: 'backend/index.ts',
  output: 'dist/index.d.ts',
}).generate();

/**
 * esbuild
 * @see https://janessagarrow.com/blog/typescript-and-esbuild/
 * @see https://esbuild.github.io/content-types/#tsconfig-json
 *
 * tsconfig and node
 * @see https://stackoverflow.com/a/67371788/2247494
 */

const sharedConfig = {
  entryPoints: ['backend/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  drop: ['debugger'],
};

build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: 'dist/index.js',
  external: Object.keys(devDependencies),
});

build({
  ...sharedConfig,
  platform: 'node', // for ESM
  format: 'esm',
  outfile: 'dist/index.esm.mjs',
  external: Object.keys(dependencies).concat(Object.keys(devDependencies)),
});
