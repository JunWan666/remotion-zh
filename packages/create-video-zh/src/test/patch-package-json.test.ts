import {expect, test} from 'bun:test';
import type {ForkConfig} from '../fork-config';
import {patchPackageJson} from '../patch-package-json';
import type {PackageManager} from '../pkg-managers';

const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

for (const packageManager of packageManagers) {
	test(`Using ${packageManager} package manager keeps official Remotion packages by default`, () => {
		const latestRemotionVersion = '1.0.0';
		const packageJson = {
			name: 'my-video',
			version: '1.0.0',
			description: 'My Remotion video',
			scripts: {
				start: 'remotion studio',
			},
			dependencies: {
				'@remotion/cli': 'stale-remotion-version',
				react: '^18.0.0',
				remotion: 'stale-remotion-version',
			},
			devDependencies: {
				'@types/react': '^18.0.6',
				'@remotion/eslint-config': '^2.0.0',
			},
		};
		let newPackageJson: typeof packageJson | null = null;
		let npmRcWritten = false;
		patchPackageJson(
			{
				projectRoot: '/path/to/project',
				latestRemotionVersion,
				packageManager,
				projectName: 'my-video',
				addTailwind: true,
			},
			{
				getPackageJson: () => JSON.stringify(packageJson),
				setPackageJson: (_: string, content: string) => {
					newPackageJson = JSON.parse(content);
				},
				setNpmRc: () => {
					npmRcWritten = true;
				},
				forkConfig: null,
			},
		);
		const expectedStartScript =
			packageManager === 'bun' ? 'remotionb studio' : 'remotion studio';
		expect(newPackageJson as unknown).toEqual({
			...packageJson,
			scripts: {
				start: expectedStartScript,
			},
			dependencies: {
				...packageJson.dependencies,
				'@remotion/cli': latestRemotionVersion,
				'@remotion/tailwind-v4': latestRemotionVersion,
				tailwindcss: '4.0.0',
				remotion: latestRemotionVersion,
			},
			sideEffects: ['*.css'],
			devDependencies: {
				...packageJson.devDependencies,
				'@remotion/eslint-config': latestRemotionVersion,
			},
		});
		expect(npmRcWritten).toBe(false);
	});

	test(`Using ${packageManager} package manager provides fork aliases when enabled`, () => {
		const latestRemotionVersion = '1.0.0';
		const forkConfig: ForkConfig = {
			scope: '@junwan666',
			version: latestRemotionVersion,
			registry: 'https://npm.pkg.github.com',
		};
		const packageJson = {
			name: 'my-video',
			version: '1.0.0',
			description: 'My Remotion video',
			scripts: {
				start: 'remotion studio',
			},
			dependencies: {
				'@remotion/cli': 'stale-remotion-version',
				react: '^18.0.0',
				remotion: 'stale-remotion-version',
			},
			devDependencies: {
				'@types/react': '^18.0.6',
				'@remotion/eslint-config': '^2.0.0',
			},
		};
		let newPackageJson: typeof packageJson | null = null;
		let npmRc: string | null = null;
		patchPackageJson(
			{
				projectRoot: '/path/to/project',
				latestRemotionVersion,
				packageManager,
				projectName: 'my-video',
				addTailwind: true,
			},
			{
				getPackageJson: () => JSON.stringify(packageJson),
				setPackageJson: (_: string, content: string) => {
					newPackageJson = JSON.parse(content);
				},
				setNpmRc: (_: string, content: string) => {
					npmRc = content;
				},
				forkConfig,
			},
		);
		const expectedStartScript =
			packageManager === 'bun' ? 'remotionb studio' : 'remotion studio';
		expect(newPackageJson as unknown).toEqual({
			...packageJson,
			scripts: {
				start: expectedStartScript,
			},
			dependencies: {
				...packageJson.dependencies,
				'@remotion/cli': 'npm:@junwan666/remotion-cli@1.0.0',
				'@remotion/tailwind-v4': 'npm:@junwan666/remotion-tailwind-v4@1.0.0',
				tailwindcss: '4.0.0',
				remotion: 'npm:@junwan666/remotion@1.0.0',
			},
			sideEffects: ['*.css'],
			devDependencies: {
				...packageJson.devDependencies,
				'@remotion/eslint-config':
					'npm:@junwan666/remotion-eslint-config@1.0.0',
			},
		});
		expect(npmRc as unknown).toEqual(
			'@junwan666:registry=https://npm.pkg.github.com\n',
		);
	});

	test(`Using ${packageManager} package manager still writes a scoped .npmrc for the default registry in fork mode`, () => {
		const latestRemotionVersion = '1.0.0';
		const forkConfig: ForkConfig = {
			scope: '@junwan666',
			version: latestRemotionVersion,
			registry: 'https://registry.npmjs.org',
		};
		const packageJson = {
			name: 'my-video',
			version: '1.0.0',
			description: 'My Remotion video',
			scripts: {
				start: 'remotion studio',
			},
			dependencies: {
				'@remotion/cli': 'stale-remotion-version',
				react: '^18.0.0',
				remotion: 'stale-remotion-version',
			},
			devDependencies: {
				'@types/react': '^18.0.6',
			},
		};
		let npmRc: string | null = null;
		patchPackageJson(
			{
				projectRoot: '/path/to/project',
				latestRemotionVersion,
				packageManager,
				projectName: 'my-video',
				addTailwind: false,
			},
			{
				getPackageJson: () => JSON.stringify(packageJson),
				setPackageJson: () => undefined,
				setNpmRc: (_: string, content: string) => {
					npmRc = content;
				},
				forkConfig,
			},
		);

		expect(npmRc as unknown).toEqual(
			'@junwan666:registry=https://registry.npmjs.org\n',
		);
	});
}
