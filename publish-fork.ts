import {
	cpSync,
	existsSync,
	lstatSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import path from 'node:path';
import {$} from 'bun';
import {
	getForkAliasSpec,
	getForkConfig,
	getForkPackageName,
	isDefaultForkRegistry,
} from './packages/create-video-zh/src/fork-config';
import {FEATURED_TEMPLATES} from './packages/create-video/src/templates';

type PackageJson = {
	name: string;
	version?: string;
	private?: boolean;
	repository?: {url?: string};
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
	publishConfig?: Record<string, unknown>;
};

const cwd = process.cwd();
const packagesDir = path.join(cwd, 'packages');
const stageRootDir = path.join(cwd, '.fork-publish');
const stageDir = path.join(
	stageRootDir,
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
);
const forkConfig = getForkConfig();

const templateDirs = new Set(
	FEATURED_TEMPLATES.map((template) => template.templateInMonorepo),
);

const skippedDirs = new Set([
	...templateDirs,
	'bugs',
	'create-video',
	'docs',
	'example',
	'example-without-zod',
	'it-tests',
	'player-example',
	'react18-tests',
]);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const packageArgIndex = args.findIndex((arg) => arg === '--package');
const filter =
	packageArgIndex === -1 ? null : (args[packageArgIndex + 1] ?? null);

const remotionLike = (dependencyName: string) => {
	return (
		dependencyName === 'remotion' || dependencyName.startsWith('@remotion/')
	);
};

const rewriteDeps = (deps: Record<string, string> | undefined) => {
	if (!deps) {
		return deps;
	}

	return Object.fromEntries(
		Object.entries(deps).map(([dependencyName, dependencyValue]) => {
			if (!remotionLike(dependencyName)) {
				return [dependencyName, dependencyValue];
			}

			return [dependencyName, getForkAliasSpec(dependencyName, forkConfig)];
		}),
	);
};

const copyPackage = (from: string, to: string) => {
	cpSync(from, to, {
		recursive: true,
		filter: (source) => {
			const relative = path.relative(from, source);
			if (relative === '') {
				return true;
			}

			const firstSegment = relative.split(path.sep)[0];
			return !['.turbo', 'node_modules', 'tsconfig.tsbuildinfo'].includes(
				firstSegment,
			);
		},
	});
};

const patchPackageJson = (
	dirName: string,
	packageJson: PackageJson,
	stagedPackageJsonPath: string,
) => {
	const next: PackageJson = {
		...packageJson,
		version: forkConfig.version,
		dependencies: rewriteDeps(packageJson.dependencies),
		devDependencies: packageJson.devDependencies,
		peerDependencies: packageJson.peerDependencies,
		optionalDependencies: rewriteDeps(packageJson.optionalDependencies),
		publishConfig: {
			access: 'public',
			...packageJson.publishConfig,
		},
	};

	if (packageJson.name === 'create-video-zh') {
		next.name = 'create-video-zh';
	} else {
		next.name = getForkPackageName(packageJson.name, forkConfig.scope);
	}

	if (packageJson.repository?.url) {
		next.repository = {
			url: `https://github.com/JunWan666/remotion-zh/tree/main/packages/${dirName}`,
		};
	}

	writeFileSync(stagedPackageJsonPath, JSON.stringify(next, null, '\t') + '\n');
};

const packageDirs = readdirSync(packagesDir).filter((dir) => {
	const fullPath = path.join(packagesDir, dir);
	return lstatSync(fullPath).isDirectory();
});

mkdirSync(stageRootDir, {recursive: true});
rmSync(stageDir, {recursive: true, force: true});
mkdirSync(stageDir, {recursive: true});

const selectedPackages = packageDirs
	.filter((dir) => !skippedDirs.has(dir))
	.map((dir) => {
		const packagePath = path.join(packagesDir, dir);
		const packageJsonPath = path.join(packagePath, 'package.json');

		if (!existsSync(packageJsonPath)) {
			return null;
		}

		const packageJson = JSON.parse(
			readFileSync(packageJsonPath, 'utf-8'),
		) as PackageJson;

		if (packageJson.private) {
			return null;
		}

		if (filter && filter !== dir && filter !== packageJson.name) {
			return null;
		}

		return {
			dir,
			packagePath,
			packageJson,
		};
	})
	.filter((pkg): pkg is NonNullable<typeof pkg> => pkg !== null);

if (selectedPackages.length === 0) {
	throw new Error(
		filter
			? `No publishable package matched "${filter}".`
			: 'No publishable packages found.',
	);
}

for (const selected of selectedPackages) {
	const stagedPath = path.join(stageDir, selected.dir);
	copyPackage(selected.packagePath, stagedPath);
	patchPackageJson(
		selected.dir,
		selected.packageJson,
		path.join(stagedPath, 'package.json'),
	);

	if (dryRun) {
		await $`npm pack --dry-run`.cwd(stagedPath);
		continue;
	}

	const publishRegistry =
		selected.packageJson.name === 'create-video-zh' &&
		!isDefaultForkRegistry(forkConfig.registry)
			? 'https://registry.npmjs.org'
			: forkConfig.registry;

	await $`bun publish --tolerate-republish`
		.cwd(stagedPath)
		.env({npm_config_registry: publishRegistry});
}
