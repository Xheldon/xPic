// 官网交互:GitHub Releases 拉最新版 + 主题/语言切换 + 截图跟随主题语言。
import { getLatestRelease, pickPrimaryDownload } from './latest-release.mjs';
import { initChrome, getTheme, getLang } from './shared.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

const DICTS = {
  zh: {
    'meta.title': 'xPic — 简洁强大的图片格式转换 / 压缩 / 裁剪工具',
    'meta.desc':
      'xPic 是一款 macOS / Windows 桌面应用，支持图片格式转换、压缩、裁剪、序列帧合成、SVGA 预览、视频转动图与工作流，本地处理、快速、隐私安全。',
    'nav.features': '功能',
    'nav.download': '下载',
    'nav.changelog': '更新日志',
    'nav.about': '关于作者',
    'hero.title': '把图片<em>转</em>、<em>压</em>、<em>裁</em>，一个应用搞定',
    'hero.lead':
      '格式转换、批量压缩、裁剪缩放、序列帧合成、SVGA 预览、视频转动图，还有可编排的<strong>工作流</strong>。全部本地处理，快、稳、隐私安全。',
    'hero.download': '下载 xPic',
    'features.title': '它能做什么',
    'f.convert': '格式转换',
    'f.convert.d': 'JPG/PNG/WebP/AVIF/HEIC/GIF 等互转，支持动图与批量。',
    'f.compress': '图片压缩',
    'f.compress.d': '可控质量批量压缩，webp/gif 动图也能压。',
    'f.crop': '图片裁剪',
    'f.crop.d': '比例 / 自由 / 固定尺寸 / 按目标大小（自动找质量）。',
    'f.merge': '序列帧合成',
    'f.merge.d': '多张图合成动态 WebP，自定义循环与帧间隔。',
    'f.svga': 'SVGA 预览',
    'f.svga.d': '直接在应用里预览 SVGA 动画。',
    'f.video': '视频处理',
    'f.video.d': '视频格式转换、压缩、转 GIF/WebP/APNG 动图。',
    'f.workflow': '工作流',
    'f.workflow.d': '把转换/压缩/裁剪/合成串成一条流水线，一键跑完。',
    'f.local': '本地 &amp; 隐私',
    'f.local.d': '全部在你电脑上处理，文件不上传任何服务器。',
    'dl.title': '下载',
    'dl.foot':
      '所有安装包来自 <a href="https://github.com/Xheldon/xPic/releases/latest" target="_blank" rel="noreferrer">GitHub Releases</a>，永远是最新版。macOS 已签名公证；Windows 安装时可自选安装目录。',
    badge: '桌面应用 · macOS / Windows',
    fetching: '正在获取最新版本…',
    latest: '最新版本',
    fetchFail:
      '获取版本失败，请前往 <a href="https://github.com/Xheldon/xPic/releases/latest">GitHub Releases</a> 下载。',
    noInstaller: '暂无安装包，请前往 Releases 查看。',
    subWin: '检测到 Windows，点击下载 .exe（安装时可选目录）',
    subMac: '检测到 macOS，默认 Apple 芯片版（Intel 见下方）',
    subOther: '请在下方选择你的平台',
    'p.macArm': 'macOS · Apple 芯片',
    'p.macIntel': 'macOS · Intel',
    'p.win': 'Windows',
    'p.macZip': 'macOS · 压缩包',
  },
  en: {
    'meta.title': 'xPic — Convert, compress & crop images on your desktop',
    'meta.desc':
      'xPic is a macOS / Windows desktop app for image conversion, batch compression, cropping, frame merging, SVGA preview, video-to-animation and automated workflows. Local, fast, private.',
    'nav.features': 'Features',
    'nav.download': 'Download',
    'nav.changelog': 'Changelog',
    'nav.about': 'About',
    'hero.title': '<em>Convert</em>, <em>compress</em> &amp; <em>crop</em> — one app for all',
    'hero.lead':
      'Format conversion, batch compression, crop & resize, frame merging, SVGA preview, video to animation — plus composable <strong>workflows</strong>. Everything runs locally: fast, reliable, private.',
    'hero.download': 'Download xPic',
    'features.title': 'What it does',
    'f.convert': 'Convert',
    'f.convert.d': 'JPG/PNG/WebP/AVIF/HEIC/GIF and more, animated & batch included.',
    'f.compress': 'Compress',
    'f.compress.d': 'Batch compression with quality control — animated webp/gif too.',
    'f.crop': 'Crop',
    'f.crop.d': 'Ratio / freeform / fixed size / target file size (auto quality).',
    'f.merge': 'Merge Frames',
    'f.merge.d': 'Stitch images into animated WebP with custom loop & frame delay.',
    'f.svga': 'SVGA Preview',
    'f.svga.d': 'Preview SVGA animations right inside the app.',
    'f.video': 'Video Tools',
    'f.video.d': 'Convert, compress, or turn videos into GIF/WebP/APNG.',
    'f.workflow': 'Workflow',
    'f.workflow.d': 'Chain convert/compress/crop/merge into one pipeline, run once.',
    'f.local': 'Local &amp; Private',
    'f.local.d': 'Everything is processed on your machine. Nothing is uploaded.',
    'dl.title': 'Download',
    'dl.foot':
      'All installers come from <a href="https://github.com/Xheldon/xPic/releases/latest" target="_blank" rel="noreferrer">GitHub Releases</a> — always the latest. macOS builds are signed & notarized; Windows lets you pick the install folder.',
    badge: 'Desktop app · macOS / Windows',
    fetching: 'Fetching the latest version…',
    latest: 'Latest',
    fetchFail:
      'Failed to fetch. Get it from <a href="https://github.com/Xheldon/xPic/releases/latest">GitHub Releases</a>.',
    noInstaller: 'No installer found — check the Releases page.',
    subWin: 'Windows detected — downloads the .exe (install folder selectable)',
    subMac: 'macOS detected — Apple Silicon build (Intel below)',
    subOther: 'Pick your platform below',
    'p.macArm': 'macOS · Apple Silicon',
    'p.macIntel': 'macOS · Intel',
    'p.win': 'Windows',
    'p.macZip': 'macOS · archive',
  },
};

const t = (key) => (DICTS[getLang()] || DICTS.zh)[key] ?? key;

const fmtSize = (n) => {
  if (!n) return '';
  const mb = n / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(0)} MB` : `${(n / 1024).toFixed(0)} KB`;
};

function platformLabel(name) {
  if (/arm64|aarch64/i.test(name)) return t('p.macArm');
  if (/\.dmg$/i.test(name)) return t('p.macIntel');
  if (/\.exe$/i.test(name)) return t('p.win');
  if (/\.zip$/i.test(name)) return t('p.macZip');
  return name;
}

// 截图跟随主题与语言(四变体)
function updateShot(lang, theme) {
  const img = document.getElementById('hero-shot');
  if (img) img.src = `./assets/screenshot-${theme}-${lang}.png`;
}

let rel = null;

function renderRelease() {
  const badgeEl = document.getElementById('download-version');
  if (!rel) {
    badgeEl.textContent = t('fetching');
    return;
  }
  const ver = rel.version || '';
  document.getElementById('version-badge').textContent = `${t('badge')} · ${ver}`;
  const date = rel.publishedAt
    ? new Date(rel.publishedAt).toLocaleDateString(getLang() === 'zh' ? 'zh-CN' : 'en-US')
    : '';
  badgeEl.textContent = `${t('latest')} ${ver} · ${date}`;

  const primary = pickPrimaryDownload(rel);
  if (primary) {
    document.getElementById('primary-dl').href = primary;
    document.getElementById('primary-dl-sub').textContent = /Windows/i.test(navigator.userAgent)
      ? t('subWin')
      : /Mac/i.test(navigator.userAgent)
      ? t('subMac')
      : t('subOther');
  }

  const grid = document.getElementById('dl-grid');
  const installers = rel.assets.filter((a) => /\.(dmg|exe)$/i.test(a.name));
  if (!installers.length) {
    grid.innerHTML = `<p>${t('noInstaller')}</p>`;
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
}

initChrome(DICTS, (lang, theme) => {
  updateShot(lang, theme);
  renderRelease();
});
updateShot(getLang(), getTheme());

(async () => {
  try {
    rel = await getLatestRelease();
    renderRelease();
  } catch (e) {
    document.getElementById('download-version').innerHTML = t('fetchFail');
    console.error(e);
  }
})();
