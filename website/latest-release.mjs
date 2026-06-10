// 官网用：客户端直接读取 Xheldon/xPic 的「最新 release」，渲染各平台下载链接。
// 下载地址永远指向最新版 —— 发版后官网无需重建即自动最新（满足「API 读取最新包」）。
//
// 用法（任意前端框架 / 纯 HTML 均可）：
//   import { getLatestRelease } from './latest-release.mjs'
//   const rel = await getLatestRelease()
//   // rel.macArm64 / rel.macX64 / rel.win64 是 .dmg / .exe 直链
//
// 注意：releases 资产名形如 xPic-1.0.11-arm64.dmg / xPic-1.0.11.exe，
// 下面的匹配基于 electron-builder 默认命名；若改了 artifactName 同步调整正则即可。

const REPO = 'Xheldon/xPic';
const API = `https://api.github.com/repos/${REPO}/releases/latest`;

export async function getLatestRelease() {
  const res = await fetch(API, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const rel = await res.json();
  const assets = rel.assets || [];
  const url = (re) => assets.find((a) => re.test(a.name))?.browser_download_url;

  return {
    version: rel.tag_name, // 如 v1.0.11
    name: rel.name,
    notes: rel.body, // release notes（可作 changelog 增量来源）
    publishedAt: rel.published_at,
    htmlUrl: rel.html_url, // release 页面
    // 各平台直链（找不到则 undefined）
    macArm64: url(/(arm64|aarch64).*\.dmg$/i),
    macX64: url(/(x64|intel|x86_64).*\.dmg$/i),
    macDmg: url(/\.dmg$/i), // 兜底：任意 dmg
    win64: url(/\.exe$/i),
    // 原始资产列表（自定义渲染用）
    assets: assets.map((a) => ({
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
      downloadCount: a.download_count,
    })),
  };
}

// 可选：根据来访系统/架构猜测「主下载按钮」该给哪个包
export function pickPrimaryDownload(rel, ua = navigator.userAgent) {
  const isWin = /Windows/i.test(ua);
  const isMac = /Mac/i.test(ua);
  // navigator.userAgent 无法可靠区分 mac 芯片，默认给 arm64（可加“Intel 版”小字链接）
  if (isWin) return rel.win64;
  if (isMac) return rel.macArm64 || rel.macDmg;
  return rel.htmlUrl; // 其他平台跳 release 页
}
