#!/usr/bin/env node
/**
 * Desktop App Launcher for Browser of Dreams
 * Launches the app in dedicated standalone window mode (--app=http://127.0.0.1:8765).
 */
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = 8765;
const TARGET_URL = `http://127.0.0.1:${PORT}`;

function isServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const running = await isServerRunning(TARGET_URL);
  if (!running) {
    console.log(`Starting local server on port ${PORT}...`);
    const serverProc = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
      stdio: "inherit",
      detached: true
    });
    serverProc.unref();
    // Wait brief moment for socket to bind
    await new Promise((r) => setTimeout(r, 600));
  }

  const browserCommands = [
    { cmd: "google-chrome", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "google-chrome-stable", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "chromium", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "chromium-browser", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "brave-browser", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "microsoft-edge", args: [`--app=${TARGET_URL}`, "--user-data-dir=/tmp/browser-of-dreams-profile"] },
    { cmd: "flatpak", args: ["run", "com.google.Chrome", `--app=${TARGET_URL}`] },
    { cmd: "xdg-open", args: [TARGET_URL] },
    { cmd: "open", args: [TARGET_URL] }
  ];

  let launched = false;
  for (const item of browserCommands) {
    try {
      const proc = spawn(item.cmd, item.args, { stdio: "ignore", detached: true });
      proc.on("error", () => {});
      proc.unref();
      console.log(`Launched Browser of Dreams via ${item.cmd} in standalone app mode!`);
      launched = true;
      break;
    } catch (_e) {}
  }

  if (!launched) {
    console.log(`Could not auto-launch browser. Please navigate to: ${TARGET_URL}`);
  }
}

main().catch((err) => {
  console.error("Launcher error:", err);
  process.exit(1);
});
