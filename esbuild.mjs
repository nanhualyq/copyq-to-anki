import * as esbuild from "esbuild";
import lodashTransformer from "esbuild-plugin-lodash";

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
  outfile: "dist/out.js",
  plugins: [lodashTransformer()],
});

// console.log(await esbuild.analyzeMetafile(result.metafile))