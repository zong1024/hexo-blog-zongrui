import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const tempDir = ".tmp";
const tempConfig = join(tempDir, "_config.runtime.yml");

const yamlString = (value) => `'${String(value).replace(/'/g, "''")}'`;

const runtimeConfig = [];

if (process.env.SITE_URL) {
  runtimeConfig.push(`url: ${yamlString(process.env.SITE_URL)}`);
}

if (process.env.SITE_ROOT) {
  runtimeConfig.push(`root: ${yamlString(process.env.SITE_ROOT)}`);
} else if (process.env.VERCEL) {
  runtimeConfig.push("root: '/'");
}

if (!process.env.SITE_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  runtimeConfig.push(
    `url: ${yamlString(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)}`
  );
} else if (!process.env.SITE_URL && process.env.VERCEL_URL) {
  runtimeConfig.push(`url: ${yamlString(`https://${process.env.VERCEL_URL}`)}`);
}

const args = ["generate"];

if (runtimeConfig.length > 0) {
  rmSync(tempDir, { force: true, recursive: true });
  mkdirSync(tempDir, { recursive: true });
  writeFileSync(tempConfig, `${runtimeConfig.join("\n")}\n`, "utf8");
  args.push("--config", `_config.yml,${tempConfig}`);
}

const result = spawnSync(process.execPath, ["node_modules/hexo/bin/hexo", ...args], {
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
