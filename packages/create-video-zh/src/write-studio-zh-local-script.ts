import fs from 'node:fs';
import path from 'node:path';

const scriptContents = `import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targetDist = path.join(
  projectRoot,
  "node_modules",
  "@remotion",
  "studio",
  "dist",
);

const candidateDirs = [
  process.env.REMOTION_ZH_STUDIO_DIST,
  path.resolve(projectRoot, "../Work/remotion-zh/packages/studio/dist"),
  path.resolve(projectRoot, "../remotion-zh/packages/studio/dist"),
].filter(Boolean);

const copyDir = (source, destination) => {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
};

if (!fs.existsSync(targetDist)) {
  console.warn("[remotion-zh] Skip Studio patch: @remotion/studio is not installed.");
  process.exit(0);
}

const sourceDist = candidateDirs.find((dir) => fs.existsSync(dir));

if (!sourceDist) {
  console.warn(
    "[remotion-zh] Skip Studio patch: localized studio dist not found. " +
      "Set REMOTION_ZH_STUDIO_DIST to your remotion-zh/packages/studio/dist path.",
  );
  process.exit(0);
}

fs.rmSync(targetDist, { recursive: true, force: true });
copyDir(sourceDist, targetDist);

console.log(\`[remotion-zh] Applied localized Studio from \${sourceDist}\`);
`;

export const writeStudioZhLocalScript = (projectRoot: string) => {
	const scriptsDir = path.join(projectRoot, 'scripts');
	fs.mkdirSync(scriptsDir, {recursive: true});

	fs.writeFileSync(
		path.join(scriptsDir, 'apply-studio-zh-local.mjs'),
		scriptContents,
	);

	const packageJsonPath = path.join(projectRoot, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
		scripts?: Record<string, string>;
	};

	packageJson.scripts = {
		...(packageJson.scripts ?? {}),
		postinstall: 'node scripts/apply-studio-zh-local.mjs',
		'apply:studio-zh': 'node scripts/apply-studio-zh-local.mjs',
	};

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
