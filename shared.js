// 站点共享:主题(浅/深)与语言(中/英)切换,index 与 changelog 共用。
// 主题尽早应用的部分在各页面 <head> 的内联脚本里(避免首屏闪烁),这里负责交互与渲染。

const THEME_KEY = 'xpic-site-theme';
const LANG_KEY = 'xpic-site-lang';

export const getTheme = () => {
  const v = localStorage.getItem(THEME_KEY);
  if (v === 'light' || v === 'dark') return v;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getLang = () => {
  const v = localStorage.getItem(LANG_KEY);
  if (v === 'zh' || v === 'en') return v;
  return (navigator.language || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

const moon =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const sun =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

// dicts: { zh: {...}, en: {...} };onChange(lang, theme) 在每次切换后调用(刷新动态内容)
export function initChrome(dicts, onChange) {
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = t === 'dark' ? sun : moon;
  };

  const applyLang = (lang) => {
    const dict = dicts[lang] || dicts.zh;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    if (dict['meta.title']) document.title = dict['meta.title'];
    const desc = document.querySelector('meta[name="description"]');
    if (desc && dict['meta.desc']) desc.setAttribute('content', dict['meta.desc']);
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  };

  applyTheme(getTheme());
  applyLang(getLang());

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    onChange?.(getLang(), next);
  });
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const next = getLang() === 'zh' ? 'en' : 'zh';
    localStorage.setItem(LANG_KEY, next);
    applyLang(next);
    onChange?.(next, getTheme());
  });

  // 未手动指定主题时跟随系统变化
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(getTheme());
      onChange?.(getLang(), getTheme());
    }
  });
}
