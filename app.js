// 官网交互：从 GitHub Releases API 拉最新版，渲染下载按钮（永远最新，无需重建）。
import { getLatestRelease, pickPrimaryDownload } from './latest-release.mjs';

document.getElementById('year').textContent = String(new Date().getFullYear());

const fmtSize = (n) => {
  if (!n) return '';
  const mb = n / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(0)} MB` : `${(n / 1024).toFixed(0)} KB`;
};

function platformLabel(name) {
  if (/arm64|aarch64/i.test(name)) return 'macOS · Apple 芯片';
  if (/\.dmg$/i.test(name)) return 'macOS · Intel';
  if (/\.exe$/i.test(name)) return 'Windows';
  if (/\.zip$/i.test(name)) return 'macOS · 压缩包';
  return name;
}

(async () => {
  const badge = document.getElementById('download-version');
  const grid = document.getElementById('dl-grid');
  try {
    const rel = await getLatestRelease();
    const ver = rel.version || '';

    document.getElementById('version-badge').textContent =
      `桌面应用 · macOS / Windows · ${ver}`;
    badge.textContent = `最新版本 ${ver} · ${
      rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString('zh-CN') : ''
    }`;

    // 主下载按钮：按来访系统推荐
    const primary = pickPrimaryDownload(rel);
    const primaryBtn = document.getElementById('primary-dl');
    if (primary) {
      primaryBtn.href = primary;
      const sub = document.getElementById('primary-dl-sub');
      sub.textContent = /Windows/i.test(navigator.userAgent)
        ? '检测到 Windows，点击下载 .exe（安装时可选目录）'
        : /Mac/i.test(navigator.userAgent)
        ? '检测到 macOS，默认 Apple 芯片版（Intel 见下方）'
        : '请在下方选择你的平台';
    }

    // 全部平台按钮（只列安装包：dmg / exe）
    const installers = rel.assets.filter((a) => /\.(dmg|exe)$/i.test(a.name));
    if (!installers.length) {
      grid.innerHTML = '<p>暂无安装包，请前往 Releases 查看。</p>';
      return;
    }
    grid.innerHTML = installers
      .map(
        (a) => `
        <a class="btn btn-ghost" href="${a.url}">
          <span>${platformLabel(a.name)}</span>
          <span class="dl-arch">${fmtSize(a.size)}</span>
        </a>`
      )
      .join('');
  } catch (e) {
    badge.innerHTML =
      '获取版本失败，请前往 <a href="https://github.com/Xheldon/xPic/releases/latest">GitHub Releases</a> 下载。';
    console.error(e);
  }
})();
