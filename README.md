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

# Remotion 中文适配版

这个仓库是基于 **[Remotion](https://github.com/remotion-dev/remotion)** 的中文适配分支，目标是逐步把项目入口说明、文档体验以及后续可见界面整理为更适合中文使用者的版本。

Remotion 本身是一个使用 **React 以编程方式创建视频** 的框架。

## 当前适配状态

- 根 README 已切换为中文默认入口
- 提供英文切换页：[README.en.md](./README.en.md)
- 当前仓库明确作为中文适配分支维护
- 后续会继续推进文档、Studio、CLI 等方向的 I18n 适配

## 为什么要用 React 做视频？

- **利用 Web 技术生态**：可以直接使用 CSS、Canvas、SVG、WebGL 等能力
- **利用编程能力**：可以通过变量、函数、API、数学与算法实现复杂效果
- **利用 React 组件模型**：组件复用、组合能力强、支持 Fast Refresh、生态成熟

## 使用 Remotion 制作的内容

<table>
<tr>
<td align="center">
<img style="width: 290px" src="https://pub-646d808d9cb240cea53bedc76dd3cd0c.r2.dev/fireship-quick.gif" />
<p>“这个视频是用代码做的” <em>- Fireship</em> <a href="https://youtu.be/deg8bOoziaE">观看</a> | <a href="https://github.com/wcandillon/remotion-fireship">源码</a></p>
</td>
<td align="center">
<img style="width: 240px" src="https://pub-646d808d9cb240cea53bedc76dd3cd0c.r2.dev/unwrapped-2023.gif" />
<p>GitHub Unwrapped - 个性化年度总结 <a href="https://www.githubunwrapped.com">体验</a> | <a href="https://github.com/remotion-dev/github-unwrapped">源码</a></p>
</td>
<td align="center">
<em>更多案例请查看 <a href="https://remotion.dev/showcase">Remotion Showcase</a>。</em>
</td>
</tr>
</table>

## 快速开始

如果你已经安装了 Node.js，可以直接运行：

```console
npx create-video@latest
```

如果你想启动这个仓库进行本地开发，常用命令如下：

```console
bun install
bun run build
cd packages/example
bun run dev
```

## 文档与说明

- 官方文档：[`remotion.dev/docs`](https://www.remotion.dev/docs)
- API 文档：[`remotion.dev/api`](https://www.remotion.dev/api)
- 上游仓库：[`remotion-dev/remotion`](https://github.com/remotion-dev/remotion)

说明：
当前完整文档仍以上游官方内容为基础，本仓库会逐步补充中文适配与中文说明。

## 许可证

Remotion 使用的是一份特殊许可证，在某些商业场景下需要额外获得公司许可证。详情请阅读 [LICENSE.md](LICENSE.md)。

## 参与贡献

欢迎继续完善中文适配工作，也欢迎参与原始项目能力开发。贡献前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。
