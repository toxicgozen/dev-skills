import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  appendAndVerify,
  appendChunks,
  splitUtf8,
} from "./append-content.mjs";

test("long Unicode content is losslessly split below the Windows IPC crash threshold", () => {
  const content = "开发指南🙂\n".repeat(900);

  const chunks = splitUtf8(content, 2048);

  assert.ok(chunks.length > 1);
  assert.ok(
    chunks.every((chunk) => Buffer.byteLength(chunk, "utf8") <= 2048),
  );
  assert.equal(chunks.join(""), content);
});

test("append calls are serialized and stop at the first failed chunk", () => {
  const calls = [];
  const run = (args) => {
    calls.push(args);
    return calls.length === 2
      ? { status: 1, stdout: "", stderr: "write failed" }
      : { status: 0, stdout: "", stderr: "" };
  };

  assert.throws(
    () =>
      appendChunks({
        chunks: ["first", "second", "third"],
        vault: "Research",
        path: "Flow/Note.md",
        run,
      }),
    /chunk 2 of 3 failed: write failed/i,
  );

  assert.deepEqual(calls, [
    [
      "append",
      "vault=Research",
      "path=Flow/Note.md",
      "content=first",
      "inline",
    ],
    [
      "append",
      "vault=Research",
      "path=Flow/Note.md",
      "content=second",
      "inline",
    ],
  ]);
});

test("a failed read-back makes the write fail even after successful appends", () => {
  const calls = [];
  const run = (args) => {
    calls.push(args);
    return args[0] === "read"
      ? { status: 1, stdout: "", stderr: "application unavailable" }
      : { status: 0, stdout: "", stderr: "" };
  };

  assert.throws(
    () =>
      appendAndVerify({
        content: "firstsecond",
        chunks: ["first", "second"],
        vault: "Research",
        path: "Flow/Note.md",
        run,
      }),
    /read-back failed: application unavailable/i,
  );
  assert.equal(calls.at(-1)[0], "read");
});

test("read-back must contain the complete appended body", () => {
  const run = (args) =>
    args[0] === "read"
      ? { status: 0, stdout: "---\ntags: []\n---\npartial", stderr: "" }
      : { status: 0, stdout: "", stderr: "" };

  assert.throws(
    () =>
      appendAndVerify({
        content: "complete body",
        chunks: ["complete body"],
        vault: "Research",
        path: "Flow/Note.md",
        run,
      }),
    /read-back did not contain the complete appended body/i,
  );
});

test("the command-line interface accepts long content on stdin without writing", () => {
  const scriptPath = fileURLToPath(
    new URL("./append-content.mjs", import.meta.url),
  );
  const content = "portable 笔记🙂\n".repeat(700);

  const result = spawnSync(
    process.execPath,
    [
      scriptPath,
      "--vault",
      "Research",
      "--path",
      "Flow/Development Guide.md",
      "--dry-run",
    ],
    { input: content, encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(result.stdout);
  assert.equal(summary.totalBytes, Buffer.byteLength(content, "utf8"));
  assert.ok(summary.chunks > 1);
  assert.ok(summary.maxChunkBytes <= 2048);
});
