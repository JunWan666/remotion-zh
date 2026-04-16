<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

<p align="center">
  <strong>Language / 语言</strong><br>
  <a href="./README.md">简体中文</a> (Default) | English
</p>

[![Discord Shield](https://img.shields.io/discord/809501355504959528?color=000000&label=Discord&logo=fdgssdf)](https://remotion.dev/discord)
[![NPM Version](https://img.shields.io/npm/v/remotion.svg?style=flat&color=black)](https://www.npmjs.org/package/remotion)
[![NPM Downloads](https://img.shields.io/npm/dm/remotion.svg?style=flat&color=black&label=Downloads)](https://npmcharts.com/compare/remotion?minimal=true)
<a href="https://twitter.com/remotion"><img src="https://img.shields.io/twitter/follow/remotion?label=Twitter&color=black" alt="Twitter"></a>

# Remotion Chinese Localization Fork

This repository is a Chinese-localized fork of **[Remotion](https://github.com/remotion-dev/remotion)**.
The goal is to gradually provide a better Chinese-first entry point, documentation flow, and Studio experience.

Remotion itself is a framework for **creating videos programmatically using React**.

## Quick start

If you just want to create a runnable Chinese-ready project, use:

```bash
npx create-video-zh@latest my-video
cd my-video
npm install
npm run dev
```

By default, the generated project uses the official `remotion` / `@remotion/cli` packages for installation stability, and then applies a localized Studio frontend from a local `remotion-zh` checkout.

## How the Chinese Studio works

To avoid `npm install` failures when not all fork packages are published, `create-video-zh` now defaults to:

1. Official Remotion dependencies
2. A local Studio localization patch applied in `postinstall`

The generated project looks for localized Studio assets in:

- `../Work/remotion-zh/packages/studio/dist`
- `../remotion-zh/packages/studio/dist`

Or you can override it with:

```bash
REMOTION_ZH_STUDIO_DIST=/your/path/to/remotion-zh/packages/studio/dist
```

The generated project also includes:

```bash
npm run apply:studio-zh
```

to re-apply the localization patch manually.

## Optional fork mode

If you want to force fork package aliases instead of the official packages:

```bash
REMOTION_USE_FORK=1 npx create-video-zh@latest my-video
```

This rewrites `remotion`, `@remotion/cli`, and related packages to `npm:@junwan666/...` aliases and writes a scoped `.npmrc`.

## Developing this repository

Common local commands:

```bash
bun install
bun run build
bun run stylecheck
cd packages/example
bun run dev
```

## Links

- Official docs: [`remotion.dev/docs`](https://www.remotion.dev/docs)
- API docs: [`remotion.dev/api`](https://www.remotion.dev/api)
- Upstream repo: [`remotion-dev/remotion`](https://github.com/remotion-dev/remotion)
- CLI package docs: [packages/create-video-zh/README.md](./packages/create-video-zh/README.md)

## Current status

- `create-video-zh` can now generate installable projects directly
- The default generated project auto-applies a local Chinese Studio patch
- The root README is now Chinese-first
- More Studio and documentation localization is still ongoing

## License

Remotion uses a special license and may require an additional company license in some commercial scenarios. See [LICENSE.md](./LICENSE.md) for details.

## Contributing

Contributions for Chinese localization and upstream feature work are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before contributing.
