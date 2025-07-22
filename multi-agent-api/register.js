require('reflect-metadata');
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  },
  // Important: tell ts-node where to find modules
  paths: {
    "@credo-ts/core": ["../packages/core/build"],
    "@credo-ts/core/*": ["../packages/core/build/*"],
    "@credo-ts/indy-besu-vdr": ["../packages/indy-besu-vdr/build"],
    "@credo-ts/indy-besu-vdr/*": ["../packages/indy-besu-vdr/build/*"]
  }
});