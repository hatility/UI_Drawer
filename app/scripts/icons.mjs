// 앱 아이콘 PNG 만들기 (홈 화면 설치용): npm run icons → public/icon-192.png · icon-512.png · apple-touch-icon.png
// favicon.svg 를 브라우저로 그려서 찍어요 (playwright-core, 개발 의존성)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
for (const [name, size, pad] of [['icon-192.png', 192, 0.12], ['icon-512.png', 512, 0.12], ['apple-touch-icon.png', 180, 0.1]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:#f4fbf8"><div style="width:${size * (1 - pad * 2)}px;height:${size * (1 - pad * 2)}px">${svg.replace('<svg', '<svg width="100%" height="100%"')}</div></body>`)
  // 폴더 이름에 한글 · 공백이 있어도 되게 fileURLToPath 로 바꿔요 (.pathname 은 %ED… 로 깨져요)
  await page.screenshot({ path: fileURLToPath(new URL(`../public/${name}`, import.meta.url)) })
  await page.close()
}
await browser.close()
console.log('✓ public/icon-192.png · icon-512.png · apple-touch-icon.png')
