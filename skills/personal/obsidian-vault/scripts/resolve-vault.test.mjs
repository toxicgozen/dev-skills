import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { parseVaults, selectVault } from "./resolve-vault.mjs";

const registeredVaults = [
  { name: "Nagare", path: "D:\\Vaults\\Nagare" },
  { name: "Ero", path: "D:\\Vaults\\Ero" },
];

test("an explicit vault selection wins over the active vault", () => {
  assert.deepEqual(
    selectVault({
      vaults: registeredVaults,
      requestedName: "Nagare",
      activeName: "Ero",
    }),
    { ...registeredVaults[0], source: "explicit" },
  );
});

test("an unknown explicit vault fails instead of falling back", () => {
  assert.throws(
    () =>
      selectVault({
        vaults: registeredVaults,
        requestedName: "Missing",
        activeName: "Nagare",
      }),
    /requested vault "Missing" is not registered/i,
  );
});

test("the active vault resolves an otherwise ambiguous selection", () => {
  assert.deepEqual(
    selectVault({ vaults: registeredVaults, activeName: "Ero" }),
    { ...registeredVaults[1], source: "active" },
  );
});

test("multiple vaults without a usable active vault remain ambiguous", () => {
  assert.throws(
    () => selectVault({ vaults: registeredVaults, activeName: "Unknown" }),
    /multiple vaults are registered/i,
  );
});

test("one registered vault can be selected without stored configuration", () => {
  assert.deepEqual(selectVault({ vaults: [registeredVaults[0]] }), {
    ...registeredVaults[0],
    source: "only",
  });
});

test("vault discovery ignores non-vault lines and preserves paths with spaces", () => {
  const output = [
    "Launcher ready",
    "Research\tD:\\Vaults\\Research Notes",
    "Work\tD:\\Vaults\\Work",
  ].join("\n");

  assert.deepEqual(parseVaults(output), [
    { name: "Research", path: "D:\\Vaults\\Research Notes" },
    { name: "Work", path: "D:\\Vaults\\Work" },
  ]);
});

test("the command-line interface reports an unavailable Obsidian CLI", () => {
  const scriptPath = fileURLToPath(
    new URL("./resolve-vault.mjs", import.meta.url),
  );
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    env: { ...process.env, PATH: "" },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /could not run "obsidian vaults verbose"/i);
});
