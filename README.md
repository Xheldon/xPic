<p align="center">
  <img src="./website/assets/icon.png" width="96" alt="xPic" />
</p>

<h1 align="center">xPic</h1>

<p align="center">简洁强大的图片格式转换 / 压缩 / 裁剪桌面工具(macOS / Windows)</p>

<p align="center">
  <a href="https://github.com/Xheldon/xPic/releases/latest">⬇️ 下载最新版</a>
  ·
  <a href="https://xpic.xheldon.com">官网</a>
  ·
  <a href="https://github.com/Xheldon/xPic/releases">全部版本</a>
</p>

---

## 这是什么仓库

本仓库承载 xPic 的 **安装包发布(Releases)** 与 **官网静态站**(`website/` 子目录):

- 安装包由私有源码仓库的 CI(electron-builder)自动构建并发布到本仓库的 Releases,
  含 macOS(Apple Silicon / Intel,dmg+zip)与 Windows(NSIS 安装器,可自选安装目录)。
- 应用内的自动更新(electron-updater)亦从本仓库 Releases 拉取 `latest*.yml` 与增量包。
- 官网经 Cloudflare Pages 部署,构建输出目录指向 `website/`,
  页面通过 GitHub API 实时读取最新 Release 的版本号与下载地址,发版后官网无需改动。

## 功能一览

图片格式转换 · 批量压缩 · 裁剪缩放 · 序列帧合成 APNG/WebP · SVGA 预览 ·
视频转换/压缩/转动图 · 可编排工作流 — 全部本地处理,快、稳、隐私安全。

## 反馈

使用问题与建议请在 [Issues](https://github.com/Xheldon/xPic/issues) 提出。
