import { readFileSync, existsSync } from 'node:fs';

const checks = [];
function check(name, ok) { checks.push({ name, ok: !!ok }); }

const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';

check('dist/index.html exists', html.length > 0);
check('mailto is correct', html.includes('mailto:teo.ena.web@pm.me'));
check('linkedin is correct', html.includes('https://www.linkedin.com/in/matteoena/'));
check('has about anchor', html.includes('id="about"'));
check('has skills anchor', html.includes('id="skills"'));
check('has certifications anchor', html.includes('id="certifications"'));
check('has contact anchor', html.includes('id="contact"'));
check('theme toggle present', html.includes('theme-toggle'));
check('no external google fonts', !/fonts\.(googleapis|gstatic)/.test(html));
check('app-ads.txt at root', existsSync('dist/app-ads.txt'));
check('manifest.json at root', existsSync('dist/manifest.json'));
check('CNAME correct', existsSync('dist/CNAME') && readFileSync('dist/CNAME', 'utf8').trim() === 'matteoena.com');
check('og image present', existsSync('dist/og.png'));
check('favicon.svg at root', existsSync('dist/favicon.svg'));

let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`);
  if (!c.ok) failed++;
}
if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll build checks passed.');
