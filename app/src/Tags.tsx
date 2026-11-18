// 어디서나 이름표 (우리 사이트에만 있는 기능)
// 북마크 하나로 아무 웹사이트에서 UI 이름표를 붙이고, 누르면 UI Drawer 사전이 열려요.
import { useState } from 'react'
import { Bookmark, Copy, MousePointerClick, Puzzle, Tag } from 'lucide-react'
import { SCAN_RULES, bookmarklet, uiTags } from './scan'
import { ENTRIES, byId } from './data'
import { getPrefs, setPrefs, usePrefs } from './prefs'
import { copyText, say } from './snack'
import { Stage } from './kit/stage'
import { Bar, Window } from './kit/window'
import type { Act } from './kit/act'
import './tags.css'

const base = () => `${location.origin}${location.pathname}`
/** 내 규칙까지 담은 북마크 주소 */
const bm = () => bookmarklet(base(), getPrefs().rules.filter(([, id]) => byId.has(id)).map(([sel, id]) => [sel, id, byId.get(id)!.ko]))

export function Tags() {

  return (
    <div className="tg">
      <header className="tg-head">
        <span className="tg-badge">UI Drawer에만 있는 기능</span>
        <h1>어디서나 이름표</h1>
        <p>북마크 하나로 <b>아무 웹사이트에서나</b> 화면 속 UI에 이름표를 붙여요. 이름표를 누르면 UI Drawer 사전이 열려요.</p>
        <div className="tg-top"><BmLink /><span>왼쪽 버튼을 북마크 막대로 끌어다 놓으세요. 잘 안 되면 아래 ‘북마크로 추가하는 방법’을 봐 주세요.</span></div>
      </header>

      <div className="tg-hero"><TagsStage /></div>

      <ol className="tg-steps">
        <li>
          <b><Bookmark size={18} />북마크 막대에 끌어다 놓기</b>
          <p>아래 버튼을 브라우저의 북마크 막대로 끌어다 놓아요.</p>
          <BmLink />
        </li>
        <li>
          <b><MousePointerClick size={18} />보고 싶은 사이트에서 누르기</b>
          <p>쇼핑몰이든 뉴스 사이트든 북마크를 누르면 탭, 검색바, 카드, 체크박스 같은 이름표가 붙어요.</p>
        </li>
        <li>
          <b><Tag size={18} />이름표를 눌러 사전 열기</b>
          <p>이름표를 누르면 그 UI의 사전 카드가 새 창으로 열려요. 한 번 더 누르거나 <kbd>Esc</kbd> 를 누르면 떼어져요.</p>
        </li>
      </ol>

      <div className="tg-try">
        <button className="btn" onClick={() => uiTags(SCAN_RULES, base(), true)}><Tag size={18} />이 페이지에서 먼저 해 보기</button>
        <button className="btn-text" onClick={() => copyText(bm(), '북마크 주소를 복사했어요.')}><Copy size={16} />북마크 주소 복사</button>
      </div>
      <details className="tg-ways tg-fold">
        <summary><h2>북마크로 추가하는 방법</h2></summary>
        <div className="tg-way">
          <b>1. 끌어다 놓기</b>
          <p>위 <b>UI 이름표</b> 버튼을 북마크 막대로 끌어다 놓아요. 북마크 막대는 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> (맥 <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)로 켜요.</p>
        </div>
        <div className="tg-way">
          <b>2. 직접 만들기 (끌어다 놓기가 안 될 때)</b>
          <ol>
            <li><button className="btn-text" onClick={() => copyText(bm(), '북마크 주소를 복사했어요.')}><Copy size={16} />북마크 주소 복사</button></li>
            <li>지금 이 페이지를 북마크해요: <kbd>Ctrl</kbd>+<kbd>D</kbd> (맥 <kbd>⌘</kbd>+<kbd>D</kbd>)</li>
            <li>북마크 창에서 <b>더보기 · 수정</b>을 눌러 이름은 ‘UI 이름표’, <b>URL 칸은 지우고 복사한 주소를 붙여 넣어</b> 저장해요.</li>
            <li>또는 북마크 관리자(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd>)에서 ‘새 북마크 추가’로 만들어도 돼요.</li>
          </ol>
        </div>
        <div className="tg-way">
          <b><Puzzle size={16} /> 3. 확장 프로그램 (가장 확실해요)</b>
          <p>깃허브의 <code>extension</code> 폴더 하나로 크롬, 엣지, 웨일, 파이어폭스에서 모두 쓸 수 있어요. 아이콘을 한 번 누르면 이름표가 붙고, 보안이 엄격한 사이트에서도 돼요.</p>
          <ul>
            <li><b>크롬 · 엣지 · 웨일</b>: 주소창에 <code>chrome://extensions</code>(엣지는 <code>edge://extensions</code>)를 열고 개발자 모드를 켜요. ‘압축해제된 확장 프로그램 로드’를 눌러 <code>extension</code> 폴더를 고르면 끝이에요.</li>
            <li><b>파이어폭스</b>: 주소창에 <code>about:debugging#/runtime/this-firefox</code>를 열고 ‘임시 부가 기능 로드’를 눌러 <code>extension/manifest.json</code>을 골라요. 파이어폭스를 껐다 켜면 다시 올려야 해요.</li>
          </ul>
        </div>
        <p className="tg-note">카카오톡이나 VS Code처럼 앱 안에서 열린 브라우저에서는 북마크를 추가할 수 없어요. 크롬, 엣지, 웨일, 파이어폭스, 사파리 같은 일반 브라우저 창에서 열어 주세요.</p>
      </details>
      <details className="tg-help">
        <summary>북마크가 안 될 때</summary>
        <ul>
          <li><b>북마크 막대가 안 보여요.</b> 크롬과 엣지는 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> (맥은 <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)로 켜요.</li>
          <li><b>눌러도 아무 일이 없어요.</b> 예전에 만든 북마크라면 지우고 새로 만들어 주세요. 예전 북마크는 주소가 중간에 잘려서 동작하지 않았어요.</li>
          <li><b>어떤 사이트에서만 안 돼요.</b> 보안 설정(CSP)이 엄격한 사이트는 북마크 실행을 막아요. 그럴 때는 <b>크롬 확장 프로그램</b>(깃허브의 <code>extension</code> 폴더)을 써 주세요.</li>
        </ul>
      </details>
      <details className="tg-ways tg-fold">
        <summary><h2>휴대폰에서 쓰기</h2></summary>
        <div className="tg-way">
          <b>안드로이드 크롬 · 삼성 인터넷</b>
          <p>‘직접 만들기’처럼 북마크를 만들고 이름을 <b>uitag</b>처럼 짧게 지어요. 보고 싶은 사이트에서 <b>주소창에 uitag 를 쳐서 나온 북마크를 누르면</b> 실행돼요. 주소창에 코드를 바로 붙여 넣는 방법은 보안 때문에 막혀 있어요.</p>
        </div>
        <div className="tg-way">
          <b>아이폰 사파리</b>
          <p>아무 페이지나 북마크한 뒤, 북마크 편집에서 주소를 복사한 주소로 바꿔요. 보고 싶은 사이트에서 <b>책갈피 목록에서 UI 이름표</b>를 누르면 돼요. 아쉽지만 공유 메뉴나 단축어 앱에는 넣을 수 없어요.</p>
        </div>
      </details>
      <MyRules />
      <p className="tg-note">이름표는 화면의 HTML 구조와 접근성 정보를 보고 짐작해서 붙여요. 가끔 틀릴 수 있어요. 보고 있는 페이지의 내용은 어디로도 보내지 않아요.</p>
    </div>
  )
}

// ─── 맨 위 그림 (Stageshow Stage) ───
// 북마크 ‘UI 이름표’를 누르면 아무 사이트 위에 이름표가 차례로 붙고, ‘떼기’를 누르면 처음으로 돌아가요.
type S = { on: boolean }
const PINS = ['GNB', '검색바', '뱃지', '탭', '카드', '버튼']

/** 글자를 가리지 않게 버튼의 오른쪽 아래쪽을 눌러요 (Stageshow: aim off the label) */
const aside = (a: { rect: (n: string) => { x: number; y: number; width: number; height: number } }, name: string) => { const r = a.rect(name); return { x: r.x + r.width * 0.86, y: r.y + r.height * 0.82 } }
async function script(a: Act<S>) {
  await a.wait(700)
  await a.move(aside(a, 'bm'))
  await a.wait(150)
  await a.click()
  await a.set({ on: true })
  await a.wait(3200)
  await a.move(aside(a, 'off'))
  await a.wait(150)
  await a.click()
  await a.set({ on: false })
  await a.move('rest')
  await a.wait(900)
}

function TagsStage() {
  return (
    <Stage<S> fill width={720} height={360} compact={{ below: 640, width: 358, height: 300 }} initial={{ on: false }} poster={{ on: true }} script={script}
      cursor={{ at: { wide: { x: 560, y: 300 }, compact: { x: 260, y: 250 } } }} className="ts">
      {(s, _r, layout) => (
        <>
          <Window url="아무-사이트.com" nav urlShape="pill" className="ts-win">
            <div className="ts-page" data-on={s.on || undefined}>
              <div className="ts-bookmarks">
                <span className="ts-bm-other"><Bar w={48} h={6} tone={3} /></span>
                <span className="ts-bm" data-target="bm" data-cursor="pointer">🏷 UI 이름표</span>
                {layout === 'wide' && <span className="ts-bm-other"><Bar w={40} h={6} tone={3} /></span>}
              </div>
              <div className="ts-head">
                <span className="ts-pinwrap" style={{ ['--d' as string]: 0 }}><i className="ts-pin">{PINS[0]}</i><Bar w={70} h={10} r={4} tone={5} /></span>
                {layout === 'wide' && <><Bar w={40} h={6} tone={3} /><Bar w={36} h={6} tone={3} /></>}
                <span className="ts-sp" />
                <span className="ts-pinwrap" style={{ ['--d' as string]: 1 }}><i className="ts-pin">{PINS[1]}</i><Bar w={layout === 'wide' ? 150 : 90} h={28} r={14} tone={2} /></span>
                <span className="ts-pinwrap ts-bell" style={{ ['--d' as string]: 2 }}><i className="ts-pin">{PINS[2]}</i><Bar w={26} h={26} r={13} tone={3} /><em /></span>
              </div>
              <div className="ts-tabs ts-pinwrap" style={{ ['--d' as string]: 3 }}><i className="ts-pin">{PINS[3]}</i><span className="on" /><span /><span /></div>
              <div className="ts-cards">
                {[0, 1, 2].slice(0, layout === 'wide' ? 3 : 2).map((i) => (
                  <div key={i} className={`ts-card${i === 0 ? ' ts-pinwrap' : ''}`} style={{ ['--d' as string]: 4 }}>
                    {i === 0 && <i className="ts-pin">{PINS[4]}</i>}
                    <i className="ts-img" /><Bar w={70} h={7} tone={4} /><Bar w={44} h={6} tone={3} />
                  </div>
                ))}
              </div>
              <span className="ts-pinwrap ts-btnwrap" style={{ ['--d' as string]: 5 }}><i className="ts-pin">{PINS[5]}</i><span className="ts-btn">더 보기</span></span>
              <div className="ts-bar" data-show={s.on || undefined}>UI Drawer 이름표 {layout === 'wide' ? 6 : 5}개<span data-target="off" data-cursor="pointer">떼기</span></div>
            </div>
          </Window>
          <span data-target="rest" className="ts-rest" />
        </>
      )}
    </Stage>
  )
}

/** 북마크 막대로 끌어다 놓는 버튼. javascript: 주소는 React 가 막으려 해서, 화면에 붙인 뒤에 직접 넣어요 */
function BmLink() {
  usePrefs() // 내 규칙이 바뀌면 주소도 다시
  const setLink = (el: HTMLAnchorElement | null) => { el?.setAttribute('href', bm()) }
  return (
    <a ref={setLink} className="tg-bm" onClick={(e) => e.preventDefault()} draggable title="북마크 막대로 끌어다 놓으세요"
      onDragStart={(e) => {
        // 브라우저마다 북마크로 받는 데이터가 달라서 셋 다 넣어 줘요
        const url = bm()
        e.dataTransfer.setData('text/uri-list', url)
        e.dataTransfer.setData('text/plain', url)
        e.dataTransfer.setData('text/x-moz-url', `${url}\nUI 이름표`)
        e.dataTransfer.effectAllowed = 'copyLink'
      }}><Tag size={16} />UI 이름표</a>
  )
}

/** 내 규칙: 우리 회사 컴포넌트에도 이름표가 붙게 (CSS 선택자 → 사전 카드) */
function MyRules() {
  const p = usePrefs()
  const [sel, setSel] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const add = () => {
    const e = ENTRIES.find((x) => x.ko === name.trim() || x.id === name.trim())
    if (!e) { setMsg('사전에 있는 카드 이름을 골라 주세요.'); return }
    try { document.querySelector(sel) } catch { setMsg('CSS 선택자 모양이 맞지 않아요. 예: .ds-toast'); return }
    setPrefs((q) => ({ rules: [[sel.trim(), e.id] as [string, string], ...q.rules.filter(([s]) => s !== sel.trim())].slice(0, 30) }))
    setSel(''); setName(''); setMsg(''); say('규칙을 더했어요. 북마크를 새로 끌어다 놓아야 이 규칙이 들어가요.')
  }
  return (
    <details className="tg-ways tg-fold">
      <summary><h2>내 규칙 더하기 <small>우리 회사 컴포넌트에도 이름표가 붙게 해요.</small></h2></summary>
      <form className="tg-rule" onSubmit={(e) => { e.preventDefault(); add() }}>
        <input value={sel} onChange={(e) => setSel(e.target.value)} placeholder="CSS 선택자 (예: .ds-toast)" aria-label="CSS 선택자" maxLength={120} required />
        <input value={name} onChange={(e) => setName(e.target.value)} list="tg-cards" placeholder="사전 카드 (예: 토스트)" aria-label="붙일 사전 카드" required />
        <datalist id="tg-cards">{ENTRIES.map((e) => <option key={e.id} value={e.ko} />)}</datalist>
        <button className="btn">더하기</button>
      </form>
      {msg && <p className="tg-err" role="alert">{msg}</p>}
      {p.rules.length > 0 && <ul className="tg-rules">{p.rules.map(([s, id]) => <li key={s}><code>{s}</code> → {byId.get(id)?.ko ?? id}<button className="btn-text" onClick={() => { const keep = p.rules; setPrefs((q) => ({ rules: q.rules.filter(([x]) => x !== s) })); say('규칙을 뺐어요.', () => setPrefs(() => ({ rules: keep }))) }}>빼기</button></li>)}</ul>}
      <p className="tg-note">내 규칙은 이 브라우저에만 저장되고, 새로 만드는 북마크에 같이 담겨요. 확장 프로그램에는 아직 들어가지 않아요.</p>
    </details>
  )
}
