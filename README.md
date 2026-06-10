<p align="center">
  <img src="./assets/icon.png" width="96" alt="xPic" />
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

本仓库承载 xPic 的 **安装包发布(Releases)** 与 **官网静态站**(仓库根目录):

- 安装包由私有源码仓库的 CI(electron-builder)自动构建并发布到本仓库的 Releases,
  含 macOS(Apple Silicon / Intel,dmg+zip)与 Windows(NSIS 安装器,可自选安装目录)。
- 应用内的自动更新(electron-updater)亦从本仓库 Releases 拉取 `latest*.yml` 与增量包。
- 官网为纯静态站(无构建步骤),直接放在仓库根目录:
  - `index.html` / `style.css` / `app.js` — 落地页,客户端读 GitHub Releases API
    动态填充最新版本号与下载地址,**发版即最新,无需重建官网**
  - `changelog.html` — 更新日志(v1.0.x 历史归档 + 自动追加新 Releases 的 release notes)
  - `latest-release.mjs` — 读取最新 release 的可复用函数

## 官网部署(Cloudflare Pages)

1. CF Pages → 连接本仓库 → **构建命令留空**、**输出目录填 `/`(或留空)**。
2. 绑定域名。
3. 之后发版下载按钮与更新日志自动更新,无需重新部署。

## 功能一览

图片格式转换 · 批量压缩 · 裁剪缩放 · 序列帧合成 APNG/WebP · SVGA 预览 ·
视频转换/压缩/转动图 · 可编排工作流 — 全部本地处理,快、稳、隐私安全。

## 反馈

使用问题与建议请在 [Issues](https://github.com/Xheldon/xPic/issues) 提出。
