export const DEFAULT_FORK_SCOPE = '@junwan666';
export const DEFAULT_FORK_REGISTRY = 'https://registry.npmjs.org';
export const DEFAULT_FORK_VERSION = '4.0.448-zh.0';
export const DEFAULT_TEMPLATE_ORG = 'remotion-dev';

export type ForkConfig = {
	readonly scope: string;
	readonly version: string;
	readonly registry: string;
};

const normalizeScope = (scope: string) => {
	const trimmed = scope.trim();

	if (trimmed.length === 0) {
		throw new Error('REMOTION_FORK_SCOPE cannot be empty.');
	}

	return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

const normalizeRegistry = (registry: string) => {
	const trimmed = registry.trim();

	if (trimmed.length === 0) {
		throw new Error('REMOTION_FORK_REGISTRY cannot be empty.');
	}

	return trimmed.replace(/\/$/, '');
};

export const getForkConfig = (): ForkConfig => {
	return {
		scope: normalizeScope(
			process.env.REMOTION_FORK_SCOPE ?? DEFAULT_FORK_SCOPE,
		),
		version: (process.env.REMOTION_FORK_VERSION ?? DEFAULT_FORK_VERSION).trim(),
		registry: normalizeRegistry(
			process.env.REMOTION_FORK_REGISTRY ?? DEFAULT_FORK_REGISTRY,
		),
	};
};

const parseBooleanEnv = (value: string | undefined): boolean | null => {
	if (value === undefined) {
		return null;
	}

	const normalized = value.trim().toLowerCase();

	if (['1', 'true', 'yes', 'on'].includes(normalized)) {
		return true;
	}

	if (['0', 'false', 'no', 'off'].includes(normalized)) {
		return false;
	}

	throw new Error(
		'REMOTION_USE_FORK must be one of: 1, true, yes, on, 0, false, no, off.',
	);
};

export const shouldUseFork = (): boolean => {
	const explicitForkMode = parseBooleanEnv(process.env.REMOTION_USE_FORK);

	if (explicitForkMode !== null) {
		return explicitForkMode;
	}

	return (
		Boolean(process.env.REMOTION_FORK_SCOPE) ||
		Boolean(process.env.REMOTION_FORK_VERSION) ||
		Boolean(process.env.REMOTION_FORK_REGISTRY)
	);
};

export const getForkConfigOrNull = (): ForkConfig | null => {
	return shouldUseFork() ? getForkConfig() : null;
};

export const getTemplateOrg = () => {
	return (process.env.REMOTION_TEMPLATE_ORG ?? DEFAULT_TEMPLATE_ORG).trim();
};

export const getForkPackageName = (
	officialPackageName: string,
	scope: string,
) => {
	const normalizedScope = normalizeScope(scope);

	if (officialPackageName === 'remotion') {
		return `${normalizedScope}/remotion`;
	}

	if (!officialPackageName.startsWith('@remotion/')) {
		throw new Error(
			`Cannot map non-Remotion package "${officialPackageName}".`,
		);
	}

	return `${normalizedScope}/remotion-${officialPackageName.slice(
		'@remotion/'.length,
	)}`;
};

export const getForkAliasSpec = (
	officialPackageName: string,
	config: Pick<ForkConfig, 'scope' | 'version'>,
) => {
	return `npm:${getForkPackageName(officialPackageName, config.scope)}@${
		config.version
	}`;
};

export const isDefaultForkRegistry = (registry: string) => {
	return normalizeRegistry(registry) === DEFAULT_FORK_REGISTRY;
};

export const getScopedRegistryLine = (scope: string, registry: string) => {
	return `${normalizeScope(scope)}:registry=${normalizeRegistry(registry)}`;
};

export const getProjectNpmRc = (config: ForkConfig) => {
	return `${getScopedRegistryLine(config.scope, config.registry)}\n`;
};
