import * as esbuild from "esbuild";
import { formatShellVersion, stampShellVersion } from "./scripts/shell-version.mjs";

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
    },
    {
      name: "stamp-shell-version",
      setup(build) {
        build.onEnd(function(result) {
          if (result.errors && result.errors.length > 0) return;
          var version = formatShellVersion(new Date());
          try {
            var stamped = stampShellVersion({ version: version });
            console.log("Shell version " + version + " (" + (stamped.changed.length ? "stamped " + stamped.changed.join(", ") : "unchanged") + ")");
          } catch (e) {
            console.error("Could not stamp the shell cache version:", e);
            process.exitCode = 1;
          }
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
