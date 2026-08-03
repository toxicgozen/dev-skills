import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import pathModule from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CHUNK_BYTES = 2000;

export function splitUtf8(content, maxBytes) {
  if (!Number.isInteger(maxBytes) || maxBytes < 1) {
    throw new Error("maxBytes must be a positive integer.");
  }

  const chunks = [];
  let chunk = "";
  let chunkBytes = 0;

  for (const character of content) {
    const characterBytes = Buffer.byteLength(character, "utf8");
    if (characterBytes > maxBytes) {
      throw new Error("maxBytes is too small for one Unicode code point.");
    }
    if (chunk && chunkBytes + characterBytes > maxBytes) {
      chunks.push(chunk);
      chunk = "";
      chunkBytes = 0;
    }
    chunk += character;
    chunkBytes += characterBytes;
  }

  if (chunk) chunks.push(chunk);
  return chunks;
}

export function appendChunks({ chunks, vault, path, run }) {
  for (const [index, chunk] of chunks.entries()) {
    const result = run([
      "append",
      `vault=${vault}`,
      `path=${path}`,
      `content=${chunk}`,
      "inline",
    ]);

    if (result.status !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || "unknown error";
      throw new Error(
        `Chunk ${index + 1} of ${chunks.length} failed: ${detail}`,
      );
    }
  }
}

function option(args, name) {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1]) {
    throw new Error(`${name} requires a value.`);
  }
  return args[index + 1];
}

function runObsidian(args) {
  const result = spawnSync("obsidian", args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.error) {
    return { status: 1, stdout: "", stderr: result.error.message };
  }
  return result;
}

export function runCli(args, content) {
  const vault = option(args, "--vault");
  const path = option(args, "--path");
  const chunks = splitUtf8(content, DEFAULT_CHUNK_BYTES);
  const chunkBytes = chunks.map((chunk) => Buffer.byteLength(chunk, "utf8"));
  const summary = {
    totalBytes: Buffer.byteLength(content, "utf8"),
    chunks: chunks.length,
    maxChunkBytes: Math.max(0, ...chunkBytes),
  };

  if (!args.includes("--dry-run")) {
    appendChunks({ chunks, vault, path, run: runObsidian });
  }

  return summary;
}

const isMain =
  process.argv[1] &&
  pathModule.resolve(process.argv[1]) ===
    pathModule.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    const content = readFileSync(0, "utf8");
    process.stdout.write(`${JSON.stringify(runCli(process.argv.slice(2), content))}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
