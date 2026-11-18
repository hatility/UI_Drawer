// 크롬 확장 프로그램 만들기: npm run extension → ../extension 폴더가 생겨요.
// 이름표 코드는 사이트의 src/scan.ts 를 그대로 써서, 사이트와 확장이 늘 같아요.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { SCAN_RULES, uiTags } from '../src/scan'
import pkg from '../package.json' with { type: 'json' }

const out = new URL('../../extension/', import.meta.url)
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const w = (name: string, text: string) => writeFileSync(new URL(name, out), text)

w('manifest.json', JSON.stringify({
  manifest_version: 3,
  name: 'UI Drawer 이름표',
  version: pkg.version,
  description: '아무 웹사이트에서나 화면 속 UI에 이름표를 붙이고, 누르면 UI Drawer 사전이 열려요.',
  action: { default_title: 'UI 이름표 붙이기 · 떼기' },
  // 크롬 · 엣지 · 웨일은 service_worker, 파이어폭스는 scripts 를 읽어요 (서로 모르는 키는 건너뛰어요)
  background: { service_worker: 'background.js', scripts: ['background.js'] },
  browser_specific_settings: { gecko: { id: 'ui-drawer-tags@hatility', strict_min_version: '121.0' } },
  homepage_url: 'https://github.com/hatility/UI_Drawer',
  permissions: ['activeTab', 'scripting', 'storage'],
  options_page: 'options.html',
}, null, 2))

// 아이콘을 누르면: 사전 주소를 먼저 알려 주고 → 이름표 코드를 실행해요 (한 번 더 누르면 떼요)
w('background.js', `chrome.action.onClicked.addListener(async (tab) => {
  const { base = 'http://localhost:8081/' } = await chrome.storage.sync.get('base')
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: (b) => { window.__uidrawerBase = b }, args: [base] })
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['tags.js'] })
})
`)
w('tags.js', `(${uiTags.toString()})(${JSON.stringify(SCAN_RULES)}, window.__uidrawerBase || 'http://localhost:8081/', false)\n`)
w('options.html', `<!doctype html><meta charset="utf-8"><title>UI Drawer 이름표 설정</title>
<body style="font:15px system-ui,sans-serif;padding:20px;max-width:460px">
<h1 style="font-size:18px">UI Drawer 이름표</h1>
<label>이름표를 누르면 열 UI Drawer 주소<br><input id="base" style="width:100%;margin-top:6px;padding:8px" placeholder="http://localhost:8081/"></label>
<p><button id="save">저장</button> <span id="ok"></span></p>
<script src="options.js"></script></body>`)
w('options.js', `const el = document.getElementById('base')
chrome.storage.sync.get('base').then(({ base }) => { el.value = base || 'http://localhost:8081/' })
document.getElementById('save').onclick = async () => { await chrome.storage.sync.set({ base: el.value.trim() }); document.getElementById('ok').textContent = '저장했어요' }
`)
w('README.md', `# UI Drawer 이름표 (크롬 확장)

1. 크롬 주소창에 \`chrome://extensions\` → 오른쪽 위 **개발자 모드** 켜기
2. **압축해제된 확장 프로그램 로드** → 이 폴더 고르기
3. 아무 사이트에서 확장 아이콘을 누르면 이름표가 붙고, 한 번 더 누르면 떼요
4. 이름표를 누르면 열릴 사전 주소는 확장 **옵션**에서 바꿔요 (기본: 도커 \`http://localhost:8081/\`)

이 폴더는 \`개발/test\` 에서 \`npm run extension\` 으로 다시 만들어요. 직접 고치지 마세요.
`)
console.log('✓ ../extension 을 만들었어요 (규칙', SCAN_RULES.length, '개)')
