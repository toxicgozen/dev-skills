import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

function meaningfulLines(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseVaults(output) {
  return meaningfulLines(output).flatMap((line) => {
    const separator = line.indexOf("\t");
    if (separator === -1) return [];

    const name = line.slice(0, separator).trim();
    const vaultPath = line.slice(separator + 1).trim();
    return name && vaultPath ? [{ name, path: vaultPath }] : [];
  });
}

export function selectVault({ vaults, requestedName, activeName }) {
  if (requestedName) {
    const requested = vaults.find((vault) => vault.name === requestedName);
    if (!requested) {
      throw new Error(`Requested vault "${requestedName}" is not registered.`);
    }
    return { ...requested, source: "explicit" };
  }

  if (activeName) {
    const active = vaults.find((vault) => vault.name === activeName);
    if (active) return { ...active, source: "active" };
  }

  if (vaults.length === 1) return { ...vaults[0], source: "only" };
  if (vaults.length === 0) {
    throw new Error("No Obsidian vaults are registered.");
  }

  throw new Error(
    `Multiple vaults are registered (${vaults.map(({ name }) => name).join(", ")}) and no active vault could be resolved.`,
  );
}

function runObsidian(args, displayCommand) {
  const result = spawnSync("obsidian", args, {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(
      `Could not run "${displayCommand}": ${result.error.message}`,
    );
  }
  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim() || "unknown error";
    throw new Error(`Could not run "${displayCommand}": ${detail}`);
  }

  return result.stdout;
}

function parseRequestedName(args) {
  const vaultIndex = args.indexOf("--vault");
  if (vaultIndex === -1) return undefined;
  if (!args[vaultIndex + 1]) throw new Error("--vault requires a vault name.");
  return args[vaultIndex + 1];
}

export function resolveVault(args = process.argv.slice(2)) {
  const requestedName = parseRequestedName(args);
  const vaults = parseVaults(
    runObsidian(["vaults", "verbose"], "obsidian vaults verbose"),
  );

  let activeName;
  if (!requestedName && vaults.length > 1) {
    const activeOutput = runObsidian(
      ["vault", "info=name"],
      "obsidian vault info=name",
    );
    activeName = meaningfulLines(activeOutput).at(-1);
  }

  return selectVault({ vaults, requestedName, activeName });
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    process.stdout.write(`${JSON.stringify(resolveVault())}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
