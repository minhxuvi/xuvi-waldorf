// PDF via the Playwright-cached headless shell (--print-to-pdf).
// No extra npm deps; the binary path is resolved at runtime.
import { execFile } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function findHeadlessShell(): string {
  const base = join(process.env["HOME"] ?? "", "Library/Caches/ms-playwright");
  for (const entry of readdirSync(base)) {
    if (!entry.startsWith("chromium_headless_shell-")) continue;
    const bin = join(base, entry, "chrome-headless-shell-mac-arm64", "chrome-headless-shell");
    try {
      readdirSync(join(base, entry));
      return bin;
    } catch {
      continue;
    }
  }
  throw new Error("headless shell not found (run with a Playwright cache present)");
}

export async function htmlToPdf(html: string): Promise<Buffer> {
  const dir = mkdtempSync(join(tmpdir(), "xuvi-pdf-"));
  try {
    const inFile = join(dir, "doc.html");
    const outFile = join(dir, "doc.pdf");
    writeFileSync(inFile, html);
    await execFileAsync(findHeadlessShell(), ["--headless", "--no-sandbox", "--disable-gpu", `--print-to-pdf=${outFile}`, inFile]);
    return readFileSync(outFile);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
