# create-video-zh

使用 `create-video-zh` 快速创建一个可直接运行的 Remotion 中文项目。

## 用法

```bash
npx create-video-zh@latest my-video
```

如果你的 npm 镜像还没有同步这个包，可以直接指定官方 registry：

```bash
npx --registry=https://registry.npmjs.org create-video-zh@latest my-video
```

## 默认行为

默认生成结果会：

- 使用官方 `remotion` 和 `@remotion/cli` 依赖，保证 `npm install` 更稳定
- 写入一个 `postinstall` 脚本，从本地 `remotion-zh` 仓库复制中文化的 Studio 前端资源
- 对部分默认模板做基础中文化处理，例如空模板的合成 ID 和 README

生成完成后通常直接运行：

```bash
cd my-video
npm install
npm run dev
```

## 本地中文 Studio 资源路径

默认会从以下位置查找中文化 Studio 资源：

- `../Work/remotion-zh/packages/studio/dist`
- `../remotion-zh/packages/studio/dist`

如果你的本地仓库不在这两个位置，可以设置：

```bash
REMOTION_ZH_STUDIO_DIST=/your/path/to/remotion-zh/packages/studio/dist
```

PowerShell 示例：

```powershell
$env:REMOTION_ZH_STUDIO_DIST='D:\AA-Tan\Work\remotion-zh\packages\studio\dist'
npx create-video-zh@latest my-video
```

生成后的项目还会带上：

```bash
npm run apply:studio-zh
```

用于重新应用中文 Studio 补丁。

## 可选 Fork 模式

如果你想强制让项目依赖 `@junwan666/*` fork 包，而不是官方包：

```bash
REMOTION_USE_FORK=1 npx create-video-zh@latest my-video
```

PowerShell 示例：

```powershell
$env:REMOTION_USE_FORK='1'
npx create-video-zh@latest my-video
```

启用后会：

- 把 `remotion`、`@remotion/cli` 等依赖改写为 `npm:@junwan666/...`
- 写入 scoped `.npmrc`

## 环境变量

- `REMOTION_USE_FORK`: 开启 fork 包模式，默认关闭
- `REMOTION_FORK_SCOPE`: fork scope，默认 `@junwan666`
- `REMOTION_FORK_VERSION`: fork 版本，默认 `4.0.448-zh.0`
- `REMOTION_FORK_REGISTRY`: fork registry，默认 `https://registry.npmjs.org`
- `REMOTION_TEMPLATE_ORG`: 模板拉取 GitHub org，默认 `remotion-dev`
- `REMOTION_ZH_STUDIO_DIST`: 本地中文 Studio `dist` 路径

## 发布

仓库根目录提供了辅助命令：

```bash
bun run fork:pack
bun run fork:publish
```
