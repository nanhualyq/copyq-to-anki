import * as esbuild from "esbuild";
import lodashTransformer from "esbuild-plugin-lodash";
import copy from "esbuild-plugin-copy";

const result = await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  platform: "node",
  target: "node20",
  treeShaking: true,
  logLevel: "info",
  minify: true,
  metafile: true,
  outdir: "dist",
  plugins: [lodashTransformer(), copy({
    assets: {
      from: ['menus.example.json'],
      to: ['menus.json']
    }
  })],
});

// console.log(await esbuild.analyzeMetafile(result.metafile))
