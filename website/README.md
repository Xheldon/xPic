# xPic 官网（落地页）

放在 **`Xheldon/xPic`（公开 Release 仓库）的 `website/` 子目录**，CF Pages 从这里部署。
纯静态（无构建步骤），下载链接由 `app.js` 客户端读 GitHub Releases API 动态生成 —— **发版即最新，无需重建官网**。

## 文件

- `index.html` — 落地页（hero / 功能 / 下载 / 页脚）
- `style.css` — 样式（与桌面应用同一套 accent，明暗自适应）
- `app.js` — 读最新 release 填充下载按钮
- `latest-release.mjs` — 读 `Xheldon/xPic` 最新 release 的可复用函数
- `assets/icon.png` — 应用图标
- `assets/screenshot.png` — 界面截图（可替换为更精修的图）

## 部署（Cloudflare Pages）

1. 把本 `website/` 目录放进 `Xheldon/xPic` 仓库。
2. CF Pages → 连接该仓库 → **构建命令留空**、**输出目录填 `website`**（或把内容放仓库根则留空）。
3. 绑定域名 `xpic.xheldon.com`。
4. 发版后下载按钮自动指向最新安装包（无需重新部署）。

## 待补

- **`/changelog` 页面**：沿用旧站（Docusaurus）`blog/` 里每个版本一篇 MDX 的历史。
  两种做法：① 把旧 blog 迁过来做静态 changelog；② 用 `latest-release.mjs` 思路读
  GitHub Releases 的 release notes 自动生成（以后发版即更新）。建议 ② + 导入①的历史打底。
- `assets/screenshot.png` 当前用的是自动抓的实拍图，可换成精修/带边框的产品图。
- 可加 OG 图、favicon 多尺寸、深色版截图等。
