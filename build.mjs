import * as esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: {
    app: "src/main.js"
  },
  bundle: true,
  format: "iife",
  globalName: "BrowserOfDreamsBundle",
  target: "es2020",
  outdir: "dist",
  sourcemap: true,
  loader: {
    ".runtime.js": "text",
    ".runtime.css": "text"
  },
  logLevel: "info",
  plugins: [
    {
      name: "build-stamp",
      setup(build) {
        build.onResolve({ filter: /^build-stamp$/ }, function(args) {
          return { path: args.path, namespace: "build-stamp" };
        });
        build.onLoad({ filter: /.*/, namespace: "build-stamp" }, function() {
          return {
            contents: "export var BUILD_TIME = " + JSON.stringify(new Date().toISOString()) + ";",
            loader: "js"
          };
        });
      }
    }
  ]
};

try {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await esbuild.build(buildOptions);
    console.log("Build completed successfully into dist/");
  }
} catch (e) {
  console.error("Build failed:", e);
  process.exit(1);
}
