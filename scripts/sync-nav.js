const fs = require('fs').promises;
const path = require('path');

const RE_HEADER = /<header[\s\S]*?<\/header>/i;
const RE_NAV    = /<nav[\s\S]*?<\/nav>/i;

async function readFileSafe(p){ try{ return await fs.readFile(p,'utf8'); }catch{ return null; } }

function extractHeader(html){
  if(!html) return null;
  const h = html.match(RE_HEADER);
  if (h) return h[0];
  const n = html.match(RE_NAV);
  if (n) return n[0];
  return null;
}

function replaceHeader(html,newHeader){
  if(!html || !newHeader) return html;
  if (RE_HEADER.test(html)) return html.replace(RE_HEADER,newHeader);
  if (RE_NAV.test(html))    return html.replace(RE_NAV,newHeader);
  if (/<body[^>]*>/i.test(html)) return html.replace(/<body[^>]*>/i,(m)=>`${m}\n${newHeader}\n`);
  return `${newHeader}\n${html}`;
}

function injectFontRule(html){
  if(!html) return html;
  const STYLE = `<style id="nav-weight-override">/* auto-added */
header a, nav a, .navbar a, .menu a, .nav-link, .dropdown-menu a { font-weight: 400 !important; }
</style>`;
  if (html.includes('id="nav-weight-override"')) return html;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${STYLE}\n</head>`);
  return `${STYLE}\n${html}`;
}

async function listHtmlInServices(dir){
  const out = [];
  async function walk(d){
    let es = [];
    try { es = await fs.readdir(d,{ withFileTypes:true }); } catch { return; }
    for (const e of es){
      const f = path.join(d,e.name);
      if (e.isDirectory()) await walk(f);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(f);
    }
  }
  await walk(dir);
  return out;
}

(async()=>{
  const root = process.cwd();
  const aboutPath = path.join(root,'about.html');
  const servicesDir = path.join(root,'services');

  const aboutHtml = await readFileSafe(aboutPath);
  if (!aboutHtml){ console.error('❌ about.html not found'); process.exit(1); }

  const header = extractHeader(aboutHtml);
  if (!header){ console.error('❌ No <header> or <nav> found in about.html'); process.exit(2); }

  const files = await listHtmlInServices(servicesDir);
  if (!files.length){ console.warn('⚠️ No HTML files found under services/'); return; }

  let changed = 0;
  for (const f of files){
    const html = await readFileSafe(f);
    if (!html) continue;
    const out = injectFontRule(replaceHeader(html, header));
    if (out !== html){
      await fs.writeFile(f, out, 'utf8');
      changed++;
      console.log('✔ Updated', path.relative(root,f));
    }
  }
  console.log('Done. Updated', changed, 'file(s).');
})();