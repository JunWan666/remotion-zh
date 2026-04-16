<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

<p align="center">
  <strong>语言 / Language</strong><br>
  简体中文（默认） | <a href="./README.en.md">English</a>
</p>

[![Discord Shield](https://img.shields.io/discord/809501355504959528?color=000000&label=Discord&logo=fdgssdf)](https://remotion.dev/discord)
[![NPM Version](https://img.shields.io/npm/v/remotion.svg?style=flat&color=black)](https://www.npmjs.org/package/remotion)
[![NPM Downloads](https://img.shields.io/npm/dm/remotion.svg?style=flat&color=black&label=Downloads)](https://npmcharts.com/compare/remotion?minimal=true)
<a href="https://twitter.com/remotion"><img src="https://img.shields.io/twitter/follow/remotion?label=Twitter&color=black" alt="Twitter"></a>

# Remotion 中文适配分支

这个仓库基于上游 **[Remotion](https://github.com/remotion-dev/remotion)**，目标是逐步提供更适合中文用户的入口体验、说明文档和 Studio 界面。

Remotion 本身是一个用 **React 编程式创建视频** 的框架。

## 快速开始

如果你只是想创建一个可直接运行的中文项目，推荐使用：

```bash
npx create-video-zh@latest my-video
cd my-video
npm install
npm run dev
```

默认生成结果使用官方 `remotion` / `@remotion/cli` 包，因此安装更稳定；同时脚手架会写入一个 `postinstall` 脚本，从本地 `remotion-zh` 仓库复制中文化的 Studio 前端资源。

## 中文 Studio 的工作方式

为了避免 fork 包没有全部发布到 npm 时安装失败，`create-video-zh` 默认采用：

1. 官方 Remotion 依赖
2. 本地中文 Studio 资源覆盖

脚手架默认会在以下位置查找中文化 Studio 资源：

- `../Work/remotion-zh/packages/studio/dist`
- `../remotion-zh/packages/studio/dist`

如果你的 `remotion-zh` 不在这两个位置，可以设置环境变量：

```bash
REMOTION_ZH_STUDIO_DIST=/your/path/to/remotion-zh/packages/studio/dist
```

PowerShell 示例：

```powershell
$env:REMOTION_ZH_STUDIO_DIST='D:\AA-Tan\Work\remotion-zh\packages\studio\dist'
npx create-video-zh@latest my-video
```

生成后的项目也会包含：

```bash
npm run apply:studio-zh
```

用于手动重新应用中文 Studio 补丁。

## 可选 Fork 模式

如果你想强制使用 fork 包别名，而不是官方包，可以显式开启：

```bash
REMOTION_USE_FORK=1 npx create-video-zh@latest my-video
```

PowerShell 示例：

```powershell
$env:REMOTION_USE_FORK='1'
npx create-video-zh@latest my-video
```

这个模式会把 `remotion`、`@remotion/cli` 等依赖改写为 `npm:@junwan666/...`，并写入 scoped `.npmrc`。

## 本地开发本仓库

如果你要参与这个仓库的开发，常用命令如下：

```bash
bun install
bun run build
bun run stylecheck
cd packages/example
bun run dev
```

## 相关链接

- 官方文档：[`remotion.dev/docs`](https://www.remotion.dev/docs)
- API 文档：[`remotion.dev/api`](https://www.remotion.dev/api)
- 上游仓库：[`remotion-dev/remotion`](https://github.com/remotion-dev/remotion)
- 脚手架说明：[packages/create-video-zh/README.md](./packages/create-video-zh/README.md)

## 当前状态

- `create-video-zh` 已支持直接创建可安装项目
- 默认创建结果会自动应用本地中文 Studio 补丁
- 根 README 已切换为中文默认入口
- Studio 界面中文化仍在持续完善

## 许可证

Remotion 使用特殊许可证，某些商业场景下需要额外的公司许可证。详情请阅读 [LICENSE.md](./LICENSE.md)。

## 参与贡献

欢迎继续完善中文适配，也欢迎参与上游功能开发。开始前请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
