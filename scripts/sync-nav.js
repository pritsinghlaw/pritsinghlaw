// scripts/sync-nav.js
// Sync header/nav from about.html into all services/*.html, and force nav link font-weight:400.

const fs = require('fs').promises;
const path = require('path');

const RE_HEADER = /<header[\s\S]*?<\/header>/i;
const RE_NAV    = /<nav[\s\S]*?<\/nav>/i;

async function readFileSafe(p) {
  try { return await fs.readFile(p, 'utf8'); } catch (e) { return null; }
}

function extractHeader(html) {
  if (!html) return null;
  const h = html.match(RE_HEADER);
  if (h) return h[0];
  const n = html.match(RE_NAV);
  if (n) return n[0];
  return null;
}

function replaceHeader(html, newHeader) {
  if (!html || !newHeader) return html;

  if (RE_HEADER.test(html)) {
    return html.replace(RE_HEADER, newHeader);
  }
  if (RE_NAV.test(html)) {
    return html.replace(RE_NAV, newHeader);
  }
  // No existing header/nav? Prepend the new header after <body>
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body[^>]*>/i, (m) => `${m}\n${newHeader}\n`);
  }
  // Last resort: just prepend.
  return `${newHeader}\n${html}`;
}

function injectFontRule(html) {
  if (!html) return html;
  const STYLE_TAG =
    `<style id="nav-weight-override">/* auto-added */
header a, nav a, .navbar a, .menu a, .nav-link, .dropdown-menu a { font-weight: 400 !important; }
</style>`;

  if (html.includes('id="nav-weight-override"')) return html;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${STYLE_TAG}\n</head>`);
  }
  // If no head tag, drop it right after the inserted header/nav or at top.
  return `${STYLE_TAG}\n${html}`;
}

async function listHtmlInServices(dir) {
  const results = [];
  async function walk(d) {
    let entries = [];
    try { entries = await fs.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) results.push(full);
    }
  }
  await walk(dir);
  return results;
}

(async function main() {
  const repoRoot = process.cwd();
  const aboutPath = path.join(repoRoot, 'about.html');
  const servicesDir = path.join(repoRoot, 'services');

  const aboutHtml = await readFileSafe(aboutPath);
  if (!aboutHtml) {
    console.error('❌ Could not read about.html at repo root.');
    process.exit(1);
  }

  const newHeader = extractHeader(aboutHtml);
  if (!newHeader) {
    console.error('❌ Could not find <header> or <nav> in about.html.');
    process.exit(2);
  }

  const files = await listHtmlInServices(servicesDir);
  if (!files.length) {
    console.warn('⚠️  No HTML files found under services/. Nothing to do.');
    return;
  }

  let changed = 0;
  for (const f of files) {
    const html = await readFileSafe(f);
    if (!html) continue;
    const replaced = replaceHeader(html, newHeader);
    const withStyle = injectFontRule(replaced);
    if (withStyle !== html) {
      await fs.writeFile(f, withStyle, 'utf8');
      changed++;
      console.log(`✔ Updated ${path.relative(repoRoot, f)}`);
    }
  }

  console.log(`\nDone. Updated ${changed} file(s).`);
})();