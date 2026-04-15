# create-video-zh

Create a new Remotion project wired to the Chinese fork packages.

## Usage

```bash
npx create-video-zh@latest my-video
```

The generated project keeps the official dependency keys like `remotion` and `@remotion/cli`, but rewrites them to `npm:@junwan666/...` alias packages so the Studio comes from this fork.

## Environment variables

- `REMOTION_FORK_SCOPE`: Override the published fork scope. Default: `@junwan666`
- `REMOTION_FORK_VERSION`: Override the fork package version. Default: `4.0.448-zh.0`
- `REMOTION_FORK_REGISTRY`: Write a scoped `.npmrc` entry for a custom registry. Default: `https://registry.npmjs.org`
- `REMOTION_TEMPLATE_ORG`: Override the GitHub org used to clone templates. Default: `remotion-dev`

## Publish

Use the root-level helper:

```bash
bun run fork:pack
bun run fork:publish
```
