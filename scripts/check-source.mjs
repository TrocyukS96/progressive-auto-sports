import fs from 'node:fs';import path from 'node:path';
const pages=JSON.parse(fs.readFileSync('data/pages.json','utf8'));const media=JSON.parse(fs.readFileSync('data/media-manifest.json','utf8'));const issues=[];const routes=Object.keys(pages);
for(const [route,page] of Object.entries(pages)){
 if(!fs.existsSync(path.join('out',route,'index.html')))issues.push(`Missing output: ${route}`);
 if(/<script[\s>]|\son[a-z]+=/i.test(page.html))issues.push(`Legacy script: ${route}`);
 for(const m of page.html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)/g)){if(!media[m[1]]&&!fs.existsSync(path.join('public',m[1])))issues.push(`Unmapped media: ${m[1]}`)}
 for(const m of page.html.matchAll(/href="(\/[^"#?]*)/g)){if(!m[1].startsWith('/assets/')&&!pages[m[1]])issues.push(`Missing route: ${m[1]}`)}
}
console.log(JSON.stringify({pages:routes.length,omittedMedia:Object.keys(media).length,issues:[...new Set(issues)]},null,2));if(issues.length)process.exit(1);
