// 更新日志：早期 Beta 为静态历史归档；GitHub Releases 上的版本自动读取并渲染（发版即更新）。
const REPO = 'Xheldon/xPic';

// 早期 Beta 历史（GitHub Releases 之前的版本，归档自旧官网 blog）
const HISTORY = [
  {
    version: 'v1.0.7',
    date: '2025.04.24',
    note: '本次更新仅针对 Mac 平台',
    features: ['关闭窗口后实行隐藏逻辑而非关闭，加快下次打开速度。'],
    bugfixes: ['修复关闭窗口后再次打开、检查更新报错的问题。'],
  },
  {
    version: 'v1.0.6',
    date: '2025.04.18',
    note: '本次更新仅针对 Mac 平台',
    features: ['【新】接入 Paddle，支付更安全。'],
    bugfixes: ['修复关闭窗口后再次打开、添加任务时报错的问题。'],
  },
  {
    version: 'v1.0.5',
    date: '2024.10.28',
    note: '本次更新仅针对 Mac 平台',
    features: [
      '【新】视频处理：格式转换 / 压缩 / 转 GIF 等。',
      '【新】序列帧合成支持 gif。',
      '【新】SVGA 预览，多种播放控制。',
      '图片压缩增加覆盖原图选项。',
      'Mac 点击关闭按钮改为「关闭窗口（不退出）」。',
      '简化新手引导。',
    ],
    bugfixes: ['修复拖拽不同文件夹时提示文案不正确的问题。'],
  },
  {
    version: 'v1.0.2',
    date: '2024.07.25',
    features: [
      '支持 Windows 平台！',
      'Windows 关闭窗口改为最小化到任务栏（可在设置开启「关闭后退出」）。',
    ],
    bugfixes: [],
  },
  {
    version: 'v1.0.1',
    date: '2024.07.21',
    features: ['将图片压缩功能单独提出到左侧一级入口。'],
    bugfixes: [
      'HEIC / HEIF / tiff 等暂不可预览的格式，在任务界面给出提示。',
      '修复无法单独选择一张图片的问题。',
    ],
  },
  {
    version: 'v1.0.0',
    date: '2024.07.20',
    features: ['生日快乐，xPic！'],
    bugfixes: ['没 Bug，开心~'],
  },
];

document.getElementById('year').textContent = String(new Date().getFullYear());

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

function renderHistory(e) {
  const sec = (title, items) =>
    items && items.length
      ? `<div class="cl-sec-title">${title}</div><ul>${items
          .map((i) => `<li>${esc(i)}</li>`)
          .join('')}</ul>`
      : '';
  return `
    <div class="cl-entry">
      <div class="cl-ver"><h2>${esc(e.version)}</h2><span class="cl-date">${esc(
        e.date
      )}</span><span class="cl-tag">归档</span></div>
      ${e.note ? `<div class="cl-note">${esc(e.note)}</div>` : ''}
      ${sec('新功能', e.features)}
      ${sec('修复', e.bugfixes)}
    </div>`;
}

// 极简 markdown → html（仅处理 release notes 的标题 / 列表 / 链接 / 粗体 / 行内代码）
function md(src) {
  const lines = String(src || '').split(/\r?\n/);
  let html = '';
  let inList = false;
  const inline = (t) =>
    esc(t)
      .replace(
        /\[([^\]]+)\]\((https?:[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  for (const ln of lines) {
    const li = ln.match(/^\s*[-*]\s+(.*)/);
    const h = ln.match(/^(#{1,3})\s+(.*)/);
    if (li) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inline(li[1])}</li>`;
      continue;
    }
    if (inList) {
      html += '</ul>';
      inList = false;
    }
    if (h) {
      html += `<h3>${inline(h[2])}</h3>`;
      continue;
    }
    if (ln.trim()) html += `<p>${inline(ln)}</p>`;
  }
  if (inList) html += '</ul>';
  return html;
}

function renderRelease(r) {
  const date = r.published_at
    ? new Date(r.published_at).toLocaleDateString('zh-CN')
    : '';
  return `
    <div class="cl-entry">
      <div class="cl-ver"><h2>${esc(r.tag_name || r.name)}</h2><span class="cl-date">${esc(
        date
      )}</span></div>
      <div class="cl-body">${r.body ? md(r.body) : '<p>（无更新说明）</p>'}</div>
    </div>`;
}

(async () => {
  const el = document.getElementById('changelog');
  let releasesHtml = '';
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (res.ok) {
      const releases = await res.json();
      const histVers = new Set(HISTORY.map((h) => h.version.replace(/^v/, '')));
      releasesHtml = releases
        .filter(
          (r) => !r.draft && !histVers.has((r.tag_name || '').replace(/^v/, ''))
        )
        .map(renderRelease)
        .join('');
    }
  } catch (e) {
    /* 离线 / 无 release 时仅展示历史归档 */
  }

  el.innerHTML = releasesHtml + HISTORY.map(renderHistory).join('');
  if (!el.innerHTML.trim())
    el.innerHTML = '<p class="cl-loading">暂无更新日志。</p>';
})();
