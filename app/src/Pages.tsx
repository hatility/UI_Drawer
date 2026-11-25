// 레일 아래쪽에서 들어가는 화면들: 내 서랍(#/mine) · 비교(#/compare) · 새 소식(#/news)
import { useState } from 'react'
import { BookOpen, Copy, Download, FolderPlus, GraduationCap, Link2, MousePointerClick, Sparkles, Tag, Trash2, Upload, X } from 'lucide-react'
import { DRAWERS, ENTRIES, FAMILIES, byId, inDrawer, type Drawer, type Entry } from './data'
import { Grid } from './Grid'
import { Preview } from './Preview'
import { addFolder, importPrefs, removeFolder, setPrefs, streakDays, toggleCompare, usePrefs, weekId } from './prefs'
import { BASIC, NAMES, tellOf } from './lore'
import { NEWS } from './news'
import { screenPrompt, useVibe } from './prompt'
import { PairStage, pairKind } from './PairStage'
import { NewsStage } from './NewsStage'
import { copyText, say } from './snack'
import { DRAWER_EN, useTx } from './i18n'
import { AUTHOR, ORG, REPO, issueUrl } from './about'
import './pages.css'

type Open = { onOpen: (id: string) => void; dex: Set<string> }
const ids2 = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean) as Entry[]

export function Mine({ onOpen, dex }: Open) {
  const p = usePrefs()
  const names = Object.keys(p.folders)
  const [folder, setFolder] = useState(names[0])
  const [tab, setTab] = useState<'got' | 'log' | 'set'>('got')
  const [vibe] = useVibe()
  const [name, setName] = useState('')
  const cur = p.folders[folder] ? folder : names[0]
  const removeWithUndo = (n: string) => { const keep = p.folders[n]; removeFolder(n); say(`‘${n}’ 폴더를 지웠어요.`, () => setPrefs((q) => ({ folders: { ...q.folders, [n]: keep } }))) }
  return (
    <div className="pg-page">
      <header className="pg-page-head">
        <h1>내 서랍</h1>
        <p>지금까지 카드 {dex.size}장을 열어 봤어요. 폴더는 {names.length}개예요.</p>
      </header>

      <div className="page-tabs" role="tablist" aria-label="내 서랍">
        {([['got', '모은 것'], ['log', '기록'], ['set', '설정']] as const).map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>)}
      </div>

      {tab === 'got' && <>
        <section className="pg-sec">
          <h2>폴더 <small>카드 상세 창에서 ‘폴더에 담기’를 누르면 여기로 와요.</small></h2>
          <div className="folder-bar">
            {names.map((n) => <button key={n} className={`subchip${n === cur ? ' on' : ''}`} onClick={() => setFolder(n)}>{n} <small>{p.folders[n].length}</small></button>)}
            <form onSubmit={(e) => { e.preventDefault(); const v = name.trim(); if (v) { addFolder(v); setFolder(v); setName(''); say(`‘${v}’ 폴더를 만들었어요.`) } }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="새 폴더 이름" aria-label="새 폴더 이름" maxLength={20} />
              <button className="btn-text"><FolderPlus size={16} />만들기</button>
            </form>
          </div>
          {p.folders[cur]?.length ? <Grid list={ids2(p.folders[cur])} onOpen={onOpen} dex={dex} /> : <Empty title="아직 비어 있어요." how="마음에 드는 카드를 열고 ‘폴더에 담기’를 눌러 보세요." to="#/dict" go="사전 둘러보기" />}
          <div className="mine-tools">
            {(p.folders[cur]?.length ?? 0) > 0 && <button className="btn-text" onClick={() => copyText(screenPrompt(ids2(p.folders[cur]), vibe.tech, cur), `‘${cur}’ 폴더로 화면을 만드는 프롬프트를 복사했어요.`)}><Copy size={16} />이 폴더로 AI에게 화면 만들어 달라고 하기</button>}
            <button className="btn-text" onClick={() => copyText(shareLink(cur, p.folders[cur] ?? []), '공유 링크를 복사했어요. 받은 사람이 열면 이 폴더를 담을 수 있어요.')}><Link2 size={16} />공유 링크 복사</button>
            <button className="btn-text" onClick={() => { save(glossary(cur, ids2(p.folders[cur] ?? [])), `${cur}-용어집.md`, 'text/markdown'); say('용어집 파일을 내려받았어요.') }}><Download size={16} />용어집으로 내려받기</button>
            {names.length > 1 && <button className="btn-text danger" onClick={() => removeWithUndo(cur)}><Trash2 size={16} />이 폴더 지우기</button>}
          </div>
        </section>

        <section className="pg-sec">
          <h2>오답 노트 <small>오늘의 카드에서 틀린 문제예요. 다음에 맞히면 빠져요.</small></h2>
          {p.quiz.wrong.length ? <Grid list={ids2(p.quiz.wrong)} onOpen={onOpen} dex={dex} /> : <Empty title="틀린 문제가 없어요." how="홈의 ‘오늘의 카드’에서 하루 한 문제씩 풀 수 있어요." to="#/" go="오늘의 카드 풀기" />}
        </section>

        <section className="mine-stats" aria-label="서랍마다 모은 정도">
          {DRAWERS.map((d) => {
            const list = inDrawer(d.id), got = list.filter((e) => dex.has(e.id)).length
            return (
              <a key={d.id} href={`#/dict/${d.id}`} className="ms">
                <span>{d.label}</span><b>{got}/{list.length}</b>
                <i><em style={{ width: `${(got / list.length) * 100}%` }} /></i>
              </a>
            )
          })}
        </section>
      </>}

      {tab === 'log' && <>
        <section className="pg-sec">
          <h2>들른 날 <small>최근 8주 동안 들른 날에 색이 칠해져요. 지금 {streakDays(p.days)}일 연속이에요.</small></h2>
          <Grass days={p.days} />
        </section>

        <section className="pg-sec">
          <h2>업적</h2>
          <ul className="ach">{achievements(dex, p).map(([t, ok, how]) => <li key={t} className={ok ? 'on' : ''}><b>{ok ? '★' : '☆'} {t}</b><small>{how}</small></li>)}</ul>
          <p className="mine-week">이번 주 퀴즈 {p.week.id === weekId() ? p.week.score : 0}점, 가장 높았던 주는 {p.week.best}점이에요.</p>
        </section>
        <section className="pg-sec">
          <h2>많이 연 카드</h2>
          {Object.keys(p.opens).length ? <ol className="top-open">{Object.entries(p.opens).slice(0, 10).map(([id, n]) => byId.has(id) && <li key={id}><button className="btn-text" onClick={() => onOpen(id)}>{byId.get(id)!.ko}</button><small>{n}번</small></li>)}</ol> : <Empty title="아직 연 카드가 없어요." how="카드를 열 때마다 여기에 횟수가 쌓여요." />}
        </section>
        <section className="pg-sec">
          <h2>찾았는데 없던 말 <small>사전에 없어서 못 찾은 말이에요.</small></h2>
          {p.misses.length ? <div className="news-peek">{p.misses.map((m) => <span key={m} className="chip">{m}</span>)}<button className="btn-text" onClick={() => copyText(p.misses.map((m) => `- ${m}`).join('\n'), '목록을 복사했어요.')}>목록 복사</button></div> : <Empty title="아직 없어요." how="검색해서 아무것도 안 나온 말이 여기에 모여요. 새 카드를 제안할 때 써 주세요." />}
        </section>
      </>}

      {tab === 'set' && <>
        <section className="pg-sec">
          <h2>보기</h2>
          <div className="mine-tools">
            <label className="mine-sw"><input type="checkbox" checked={p.lang === 'en'} onChange={(e) => setPrefs(() => ({ lang: e.target.checked ? 'en' : 'ko' }))} />English</label>
            <label className="mine-sw"><input type="checkbox" checked={p.view.big} onChange={(e) => setPrefs((q) => ({ view: { ...q.view, big: e.target.checked } }))} />글자 크게</label>
            <label className="mine-sw"><input type="checkbox" checked={p.view.contrast} onChange={(e) => setPrefs((q) => ({ view: { ...q.view, contrast: e.target.checked } }))} />또렷하게 (고대비)</label>
            <label className="mine-sw"><input type="checkbox" checked={p.density === 'compact'} onChange={(e) => setPrefs(() => ({ density: e.target.checked ? 'compact' : 'cozy' }))} />카드 작게 (한 화면에 더 많이)</label>
            <label className="mine-sw"><input type="checkbox" checked={p.notify} onChange={async (e) => { const on = e.target.checked; if (on && typeof Notification !== 'undefined' && Notification.permission !== 'granted') { const r = await Notification.requestPermission(); if (r !== 'granted') { say('브라우저에서 알림을 허용해야 켤 수 있어요.'); return } } setPrefs(() => ({ notify: on })); say(on ? '하루에 처음 들어올 때 오늘의 UI를 하나 알려 드릴게요.' : '알림을 껐어요.') }} />오늘의 UI 알림</label>
          </div>
        </section>
        <section className="pg-sec">
          <h2>내 기록은 어디에 저장되나요?</h2>
          <p className="pg-note">모은 카드, 폴더, 퀴즈 기록, 설정은 모두 지금 쓰는 브라우저 안에만 저장돼요. 서버로 보내지 않아서 따로 가입할 필요가 없어요. 대신 다른 기기나 다른 브라우저에서는 보이지 않으니, 옮기고 싶으면 파일로 내려받아 다시 넣어 주세요.</p>
          <div className="mine-tools">
            <button className="btn-text" onClick={() => { save(JSON.stringify({ app: 'ui-drawer', dex: [...dex], folders: p.folders, compare: p.compare }, null, 2), 'ui-drawer-기록.json', 'application/json'); say('기록 파일을 내려받았어요.') }}><Download size={16} />기록 내려받기</button>
            <label className="btn-text"><Upload size={16} />기록 파일 넣기<input type="file" accept="application/json,.json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 200_000) { say('200KB가 넘는 파일은 넣을 수 없어요.'); return } say(importPrefs(await f.text()) ? '기록을 넣었어요. 새로고침하면 모은 카드까지 보여요.' : '이 파일은 읽을 수 없어요. UI Drawer에서 내려받은 파일인지 확인해 주세요.') }} /></label>
          </div>
        </section>
        <section className="pg-sec">
          <h2>더 보기</h2>
          <a className="btn-text" href="#/news">새로 들어온 카드</a>
          <a className="btn-text" href="#/drawers">서랍 지도</a>
          <a className="btn-text" href="#/about">이 사이트에 대해</a>
          <a className="btn-text" href="#/compare">나란히 비교 ({p.compare.length}/4)</a>
        </section>
        <section className="pg-sec">
          <h2>일할 때 쓰는 도구</h2>
          <a className="btn-text" href="#/audit">디자인 시스템 점검표 열기</a>
          <a className="btn-text" href="#/test">사용성 시험 진행하기</a>
          <a className="btn-text" href="#/annotate">화면에 이름표 붙이기</a>
        </section>
      </>}
    </div>
  )
}

/** 빈 화면은 어디서나 같은 모양: 무엇이 없는지 · 어떻게 채우는지 · 갈 곳 하나 */
function Empty({ title, how, to, go }: { title: string; how: string; to?: string; go?: string }) {
  return <div className="empty empty--box"><b>{title}</b><p>{how}</p>{to && go && <a className="btn-text" href={to}>{go}</a>}</div>
}

export function Compare({ onOpen }: { onOpen: (id: string) => void }) {
  const p = usePrefs()
  const list = ids2(p.compare)
  const [vibe] = useVibe()
  return (
    <div className="pg-page">
      <header className="pg-page-head"><h1>나란히 비교</h1><p>카드를 4장까지 나란히 놓고 볼 수 있어요. 상세 창에서 ‘비교’를 누르면 여기에 담겨요.</p></header>
      {!list.length ? <Empty title="아직 비교할 카드가 없어요." how="헷갈리는 카드 두세 장을 열고 ‘비교’를 눌러 보세요." to="#/dict" go="사전 둘러보기" /> : (
        <div className="cmp" style={{ ['--n' as string]: list.length }}>
          {list.map((e) => (
            <article key={e.id} className="cmp-col">
              <div className="cmp-pv vs-pair"><Preview id={e.id} /></div>
              <h2><button onClick={() => onOpen(e.id)}>{e.ko}</button></h2>
              <small>{e.en}</small>
              <p>{e.desc}</p>
              <ul>{e.when.map((w) => <li key={w}>{w}</li>)}</ul>
              <button className="btn-text" onClick={() => toggleCompare(e.id)}><X size={16} />빼기</button>
            </article>
          ))}
        </div>
      )}
      {list.length > 0 && (
        <section className="pg-sec">
          <h2>이 카드들로 <small>기획서나 회의 자료에 바로 붙여 넣을 수 있어요.</small></h2>
          <div className="mine-tools">
            <button className="btn-text" onClick={() => copyText(screenPrompt(list, vibe.tech), `이 ${list.length}장으로 화면을 만드는 프롬프트를 복사했어요. AI 채팅창에 붙여 넣어 보세요.`)}><Copy size={16} />AI에게 화면 만들어 달라고 하기</button>
            <button className="btn-text" onClick={() => copyText(specText(list), '화면 설명 글을 복사했어요. 기획서에 붙여 넣으면 돼요.')}><Copy size={16} />화면 설명 글 복사</button>
            <button className="btn-text" onClick={() => copyText(voteText(list), '투표 글을 복사했어요. 슬랙이나 카카오톡에 붙여 넣고 이모지로 골라 달라고 하면 돼요.')}><Copy size={16} />팀 용어 투표 글 복사</button>
          </div>
        </section>
      )}
    </div>
  )
}

/** 고른 카드로 기획서 문장: 무엇이 · 어디에 · 어떻게 */
const specText = (list: Entry[]) => `## 화면 구성\n\n` + list.map((e, i) => `${i + 1}. **${e.ko}** (${e.en}) — ${e.desc}\n   - 쓰는 곳: ${e.when.join(', ')}${NAMES[e.id] ? `\n   - 구현: ${NAMES[e.id][2]}` : ''}`).join('\n') + `\n\n_UI Drawer 이름 기준_`
const voteText = (list: Entry[]) => `🗳 이 UI를 우리 팀은 뭐라고 부를까요? 이모지로 골라 주세요\n\n` + list.map((e, i) => `${['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i]} ${e.ko} (${e.en}) — ${e.desc}`).join('\n')

/** 업적: [이름, 열림, 여는 법] */
function achievements(dex: Set<string>, p: ReturnType<typeof usePrefs>): [string, boolean, string][] {
  const full = DRAWERS.filter((d) => { const l = inDrawer(d.id); return l.length > 0 && l.every((e) => dex.has(e.id)) })
  const streak = streakDays(p.days)
  return [
    ['첫 서랍', dex.size >= 1, '카드 한 장 열기'],
    ['입문 마스터', BASIC.every((id) => dex.has(id)), '학습 코스 입문 30장 모두 보기'],
    ['서랍 하나 비우기', full.length > 0, full.length ? `다 모은 서랍: ${full.map((d) => d.label).join(', ')}` : '서랍 하나의 카드를 모두 열기'],
    ['100장 수집가', dex.size >= 100, `지금 ${dex.size}장`],
    ['퀴즈 10연속', p.quiz.best >= 10, `최고 ${p.quiz.best}연속`],
    ['일주일 개근', streak >= 7, `지금 ${streak}일 연속`],
    ['폴더 정리왕', Object.values(p.folders).filter((f) => f.length >= 5).length >= 3, '5장 넘는 폴더 3개'],
  ]
}

/** 디자인 시스템 점검표: 우리 서비스에 있는 UI를 체크하면 빠진 것이 보여요 */
export function Audit({ onOpen }: { onOpen: (id: string) => void }) {
  const p = usePrefs()
  const raw: [string, string[]][] = [['꼭 있어야 할 기본', BASIC], ['상태 화면', ['empty-state', 'no-results', 'offline-banner', 'error-404', 'retry-state', 'success-state', 'skeleton', 'loading-button']], ['입력 도우미', ['helper-text', 'inline-error', 'error-summary', 'required-mark', 'character-counter', 'password-toggle', 'autocomplete', 'date-picker']], ['접근성', ['skip-link', 'focus-ring', 'high-contrast', 'reduced-motion', 'aria-live']]]
  const seen = new Set<string>()
  const groups = raw.map(([t, ids]) => [t, ids.filter((id) => byId.has(id) && !seen.has(id) && (seen.add(id), true))] as [string, string[]])
  const all = groups.flatMap(([, ids]) => ids)
  const have = new Set(p.audit)
  const missing = all.filter((id) => !have.has(id))
  const toggle = (id: string) => setPrefs((q) => ({ audit: q.audit.includes(id) ? q.audit.filter((x) => x !== id) : [...q.audit, id] }))
  return (
    <div className="pg-page">
      <header className="pg-page-head"><h1>디자인 시스템 점검표</h1><p>우리 서비스에 이미 있는 UI에 체크해 주세요. 아직 없는 {missing.length}개는 맨 아래에 모여요.</p></header>
      {groups.map(([t, ids]) => (
        <section key={t} className="pg-sec">
          <h2>{t} <small>{ids.filter((id) => have.has(id)).length} / {ids.filter((id) => byId.has(id)).length}</small></h2>
          <div className="audit">{ids.filter((id) => byId.has(id)).map((id) => (
            <label key={id} className={have.has(id) ? 'on' : ''}><input type="checkbox" checked={have.has(id)} onChange={() => toggle(id)} /><span>{byId.get(id)!.ko}</span><button className="btn-text" onClick={(e) => { e.preventDefault(); onOpen(id) }}>보기</button></label>
          ))}</div>
        </section>
      ))}
      <section className="pg-sec">
        <h2>아직 없는 것 <small>다음에 만들 차례예요.</small></h2>
        <div className="mine-tools"><button className="btn-text" onClick={() => copyText(`# 디자인 시스템에 빠진 UI (${missing.length})\n\n` + missing.map((id) => `- [ ] ${byId.get(id)!.ko} (${byId.get(id)!.en})`).join('\n'), '할 일 목록을 복사했어요.')}><Copy size={16} />할 일 목록 복사 (Markdown)</button></div>
        <div className="news-peek">{missing.map((id) => <button key={id} className="chip" onClick={() => onOpen(id)}>{byId.get(id)!.ko}</button>)}</div>
      </section>
    </div>
  )
}

export function News({ onOpen, dex }: Open) {
  const [open, setOpen] = useState<number | null>(0)
  const [shown, setShown] = useState(48)
  return (
    <div className="pg-page">
      <header className="pg-page-head"><h1>새 소식</h1><p>서랍에 새로 들어온 카드를 차례대로 모았어요.</p></header>
      <div className="news-stage"><NewsStage /></div>
      {NEWS.map(([title, note, from], i) => {
        const to = i === 0 ? ENTRIES.length : NEWS[i - 1][2]
        const list = ENTRIES.slice(from, to)
        if (!list.length) return null
        return (
          <section key={title} className="pg-sec news">
            <h2><button aria-expanded={open === i} onClick={() => { setOpen(open === i ? null : i); setShown(48) }}>{title} <small>{list.length}장</small></button></h2>
            <p className="pg-note">{note}</p>
            {open !== i && <div className="news-art" aria-hidden="true">{list.slice(0, 3).map((e) => <div key={e.id} className="news-art-pv"><Preview id={e.id} /></div>)}</div>}
            {open === i ? <><Grid list={list.slice(0, shown)} onOpen={onOpen} dex={dex} />{list.length > shown && <button className="ln-more" onClick={() => setShown((n) => n + 96)}>더보기 ({list.length - shown}장 남음)</button>}</> : <div className="news-peek">{list.slice(0, 8).map((e) => <button key={e.id} className="chip" onClick={() => onOpen(e.id)}>{e.ko}</button>)}{list.length > 8 && <button className="chip" onClick={() => setOpen(i)}>+{list.length - 8}</button>}</div>}
          </section>
        )
      })}
    </div>
  )
}

/** 폴더를 주소에 담아 보내요 (서버 없이). 받는 쪽은 #/share/… 를 열면 폴더로 들어가요 */
export const shareLink = (name: string, ids: string[]) =>
  `${location.origin}${location.pathname}#/share/${encodeURIComponent(JSON.stringify({ n: name, i: ids.slice(0, 200) }))}`
export function readShare(arg: string): { n: string; i: string[] } | null {
  try {
    const d = JSON.parse(decodeURIComponent(arg))
    if (typeof d?.n !== 'string' || !Array.isArray(d.i)) return null
    return { n: d.n.slice(0, 20), i: d.i.filter((x: unknown): x is string => typeof x === 'string' && byId.has(x)).slice(0, 200) }
  } catch { return null }
}
const glossary = (name: string, list: Entry[]) =>
  `# ${name} 용어집\n\n_UI Drawer에서 만든 용어집 · ${list.length}개_\n\n` + list.map((e) => `## ${e.ko} (${e.en})\n${e.desc}\n\n- 이럴 때: ${e.when.join(' · ')}\n`).join('\n')
const save = (text: string, file: string, type: string) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = file; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000) }

/** #/share/… 로 들어오면: 받은 폴더를 미리 보여 주고, 내 폴더로 담을지 물어요 */
export function ShareImport({ arg, onOpen, dex }: { arg: string } & Open) {
  const d = readShare(arg)
  const [done, setDone] = useState(false)
  if (!d) return <div className="pg-page"><p className="empty">공유 링크가 깨져서 읽을 수 없어요. 링크를 다시 받아 주세요.</p></div>
  return (
    <div className="pg-page">
      <header className="pg-page-head"><h1>받은 폴더 ‘{d.n}’</h1><p>{d.i.length}장 · 담으면 내 서랍 폴더에 들어가요</p></header>
      <div className="mine-tools">{done ? <a className="btn" href="#/mine">내 서랍에서 보기</a> : <button className="btn" onClick={() => { const name = `${d.n} (받음)`; setPrefs((p) => ({ folders: { ...p.folders, [name]: d.i } })); setDone(true) }}>내 폴더로 담기</button>}</div>
      <Grid list={ids2(d.i)} onOpen={onOpen} dex={dex} />
    </div>
  )
}

/** #/vs/<카드>/<카드>: 두 카드를 나란히. 회의에서 “이거 말고 이거”를 보여 줄 때 링크로 보내요 */
export function Versus({ a, b, onOpen }: { a: string; b: string; onOpen: (id: string) => void }) {
  const A = byId.get(a), B = byId.get(b)
  if (!A || !B) return <div className="pg-page"><Empty title="두 카드 중 하나를 찾을 수 없어요." how="주소가 바뀌었을 수 있어요. 사전에서 다시 골라 주세요." to="#/dict" go="사전으로 가기" /></div>
  const tell = tellOf(a, b)
  const diff = (x: Entry, y: Entry) => x.vs?.find((v) => v.id === y.id)?.diff
  return (
    <div className="pg-page">
      <header className="pg-page-head">
        <h1>{A.ko}와 {B.ko}</h1>
        <p>생김새가 비슷해서 자주 헷갈리는 둘이에요. 그림에 마우스를 올리면 같이 움직여요.</p>
      </header>
      {tell && <p className="vs-tell">{tell}</p>}
      {pairKind(a, b) && <div className="vs-stage"><PairStage kind={pairKind(a, b)!} /></div>}
      <div className="vs-page vs-pair" tabIndex={0} aria-label={`${A.ko}와 ${B.ko} 나란히 보기`}>
        {[A, B].map((x, i) => (
          <article key={x.id} className="vs-col">
            <div className="vs-col-pv"><Preview id={x.id} size="large" /></div>
            <h2>{x.ko} <small>{x.en}</small></h2>
            <p>{x.desc}</p>
            {diff(x, i ? A : B) && <p className="pg-note">{diff(x, i ? A : B)}</p>}
            <button className="btn-text" onClick={() => onOpen(x.id)}>{x.ko} 카드 열기</button>
          </article>
        ))}
      </div>
      <div className="mine-tools">
        <button className="btn-text" onClick={() => copyText(`${location.origin}${location.pathname}#/vs/${a}/${b}`, '나란히 보기 링크를 복사했어요.')}><Link2 size={16} />이 비교 링크 복사</button>
        <a className="btn-text" href={`#/vs/${b}/${a}`}>좌우 바꾸기</a>
      </div>
    </div>
  )
}

/** 최근 8주 들른 날을 잔디처럼: 가로 8주 × 세로 7일 */
function Grass({ days }: { days: string[] }) {
  const set = new Set(days)
  const today = new Date()
  const start = new Date(today); start.setDate(today.getDate() - today.getDay() - 7 * 7)
  const cells = Array.from({ length: 56 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  return (
    <div className="grass" role="img" aria-label={`최근 8주 중 ${cells.filter((d) => set.has(d.toLocaleDateString('sv-SE'))).length}일 들렀어요`}>
      {cells.map((d) => { const k = d.toLocaleDateString('sv-SE'); return <i key={k} data-on={set.has(k) || undefined} data-future={d > today || undefined} title={k} /> })}
    </div>
  )
}

/** 이 사이트에 대해 (#/about): 무엇인지 · 숫자 · 쓰는 법 · 약속 세 가지(내 정보 · 접근성 · AI) · 걸어온 길 · 만든 사람 */
export function About() {
  const tx = useTx()
  const pairs = new Set(ENTRIES.flatMap((e) => (e.vs ?? []).map((v) => [e.id, v.id].sort().join('|')))).size
  const stats: [string, string][] = [[ENTRIES.length.toLocaleString(), tx('UI 카드', 'UI cards')], [String(DRAWERS.length), tx('서랍', 'drawers')], [pairs.toLocaleString(), tx('헷갈리는 짝', 'confusable pairs')], ['12', tx('체험 사이트', 'playground sites')]]
  const ways: [string, typeof BookOpen, string, string, string][] = [
    ['#/dict', BookOpen, tx('사전', 'Dictionary'), tx('이름을 몰라도 생김새나 초성으로 찾아요.', 'Search by shape or initials.'), tx('카드마다 움직이는 그림과 헷갈리는 짝', 'Moving pictures and confusable twins')],
    ['#/learn', GraduationCap, tx('배우기', 'Learn'), tx('헷갈리는 짝을 나란히 보고 한 줄로 가르는 법을 익혀요.', 'See pairs side by side, learn the one-line tell.'), tx('퀴즈 · 코스 · 틀린 것만 다시', 'Quiz · course · retry')],
    ['#/play', MousePointerClick, tx('체험관', 'Playground'), tx('가짜 사이트 12곳에서 직접 눌러 봐요.', 'Click around 12 pretend sites.'), tx('이름표를 켜면 UI마다 이름이 붙어요', 'Turn on name tags')],
    ['#/tags', Tag, tx('어디서나 이름표', 'Name tags anywhere'), tx('북마크 하나로 아무 웹사이트에나 이름표를 붙여요.', 'One bookmark labels UI on any site.'), tx('크롬 · 엣지 · 파이어폭스 확장도 있어요', 'Browser extension too')],
  ]
  return (
    <div className="pg-page about">
      <section className="about-hero">
        <img src="/icon-192.png" width={64} height={64} alt="" />
        <h1>{tx('이름이 생각 안 나는 그 UI,', 'That UI whose name you forgot,')}<br />{tx('서랍에서 꺼내 보세요', 'pull it out of the drawer')}</h1>
        <p>{tx('UI Drawer는 생김새만 적어도 이름을 찾아 주고, 직접 눌러 보며 익히는 UI 이름 사전이에요. 디자이너 · 개발자 · 기획자가 같은 말로 이야기하게 하려고 만들었어요.', 'UI Drawer is a UI name dictionary: describe the shape, get the name, try it yourself. Built so designers, developers and planners speak the same words.')}</p>
        <ul className="about-pills" aria-label={tx('한눈에', 'At a glance')}>
          <li>{tx('가입 없음', 'No sign-up')}</li><li>{tx('광고 없음', 'No ads')}</li><li>{tx('오픈 소스 · MIT', 'Open source · MIT')}</li><li>{tx('한국어 · English', 'Korean · English')}</li>
        </ul>
      </section>

      <ul className="about-stats" aria-label={tx('숫자로 보면', 'By the numbers')}>
        {stats.map(([n, l]) => <li key={l}><b>{n}</b><span>{l}</span></li>)}
      </ul>

      <section className="pg-sec">
        <h2>{tx('네 가지로 써요', 'Four ways in')}</h2>
        <div className="about-ways">
          {ways.map(([href, Icon, t, d, s]) => <a key={href} href={href}><i><Icon size={22} /></i><b>{t}</b><span>{d}</span><small>{s}</small></a>)}
        </div>
      </section>

      <section className="pg-sec">
        <h2>{tx('이럴 때 써요', 'Use it when')}</h2>
        <ul className="about-list">
          <li>{tx('기획서에 ‘그 아래에서 쓱 올라오는 거’라고 적다가 멈췄을 때', 'You are writing a spec and only have “that thing that slides up”')}</li>
          <li>{tx('디자이너와 개발자가 같은 걸 다른 이름으로 부르고 있을 때', 'Designers and developers call the same thing different names')}</li>
          <li>{tx('토스트와 스낵바, 모달과 바텀시트처럼 비슷한 둘이 헷갈릴 때', 'Toast vs snackbar, modal vs bottom sheet')}</li>
          <li>{tx('바이브 코딩할 때 AI에게 원하는 UI를 정확한 이름으로 말하고 싶을 때', 'You want to tell an AI exactly which UI you mean')}</li>
        </ul>
      </section>

      <section className="pg-sec">
        <h2>{tx('세 가지 약속', 'Three promises')}</h2>
        <div className="about-promise">
          <article>
            <h3>{tx('내 정보는 내 브라우저에만', 'Your data stays in your browser')}</h3>
            <p>{tx('가입이 없어요. 열어 본 카드, 폴더, 오답 노트는 이 브라우저에만 저장되고 서버로 보내지 않아요. 내 서랍 › 설정에서 내려받거나 지울 수 있어요.', 'No account. What you open or save lives in this browser only; nothing goes to a server. Export or delete it in My drawer › Settings.')}</p>
          </article>
          <article>
            <h3>{tx('누구나 쓸 수 있게', 'Usable by everyone')}</h3>
            <p>{tx('키보드만으로 쓸 수 있고(Tab · 화살표 · Esc · ⌘K), 화면 낭독기 이름과 상태를 붙였어요. 큰 글자 · 고대비 · 움직임 줄이기 설정을 따라요.', 'Keyboard operable (Tab · arrows · Esc · ⌘K), labelled for screen readers, and it follows large text, high contrast and reduced motion.')}</p>
            <a className="btn-text" href={issueUrl('bug', '[접근성] ', {})} target="_blank" rel="noopener noreferrer">{tx('접근성 문제 알리기', 'Report an accessibility problem')}</a>
          </article>
          <article className="about-ai">
            <h3><Sparkles size={18} aria-hidden="true" />{tx('AI와 함께 만들었어요', 'Built with AI')}</h3>
            <p>{tx('코드, 카드 설명문, 그림 틀을 만들 때 Claude Code(Anthropic)의 도움을 받았어요. 무엇을 넣을지, 어떻게 부를지, 맞는지 확인하고 고치는 일은 사람이 했어요. 사이트 안에서 AI를 부르지는 않고, ‘AI에게 만들어 달라고 하기’는 글을 복사해 줄 뿐이에요.', 'Claude Code (Anthropic) helped write the code, card copy and picture templates. Choosing what goes in, what to call it, and checking it was done by a person. The site never calls an AI itself; “Ask an AI to build it” only copies text.')}</p>
            <p className="pg-note">{tx('틀린 이름이나 설명을 보셨다면 알려 주세요. 바로 고칠게요.', 'Spotted a wrong name or description? Tell us and we will fix it.')}</p>
          </article>
        </div>
      </section>

      <section className="pg-sec">
        <h2>{tx('걸어온 길', 'How it grew')}</h2>
        <ol className="about-timeline">
          {NEWS.slice(0, 4).map(([title, note, from], i) => <li key={title}><b>{title}</b><span>{note}</span><small>{(i === 0 ? ENTRIES.length : NEWS[i - 1][2]) - from}{tx('장', ' cards')}</small></li>)}
        </ol>
        <a className="btn-text" href="#/news">{tx('새 소식에서 전부 보기', 'See everything in News')}</a>
      </section>

      <section className="pg-sec">
        <h2>{tx('함께 만들기', 'Help build it')}</h2>
        <div className="about-links">
          <a className="btn" href={issueUrl('new-card', '[새 카드] ', {})} target="_blank" rel="noopener noreferrer">{tx('사전에 없는 UI 제안하기', 'Suggest a missing UI')}</a>
          <a className="btn-text" href={issueUrl('bug', '[고장] ', {})} target="_blank" rel="noopener noreferrer">{tx('그림이 이상하거나 잘 안 돼요', 'Something looks wrong')}</a>
          <a className="btn-text" href={issueUrl('dark-pattern', '[다크 패턴] ', {})} target="_blank" rel="noopener noreferrer">{tx('이런 다크 패턴을 봤어요', 'I saw a dark pattern')}</a>
        </div>
      </section>

      <section className="about-made">
        <span className="about-avatar" aria-hidden="true">명</span>
        <div>
          <b>{AUTHOR.name}</b> <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer">@aodrha03</a>
          <p>{tx('소스 코드', 'Source')} <a href={REPO} target="_blank" rel="noopener noreferrer">{ORG.name}</a> · <a href={REPO + '/blob/main/LICENSE'} target="_blank" rel="noopener noreferrer">MIT</a> · UI Drawer v{__APP_VERSION__}</p>
          <p className="pg-note">{tx('그림은 Stageshow 킷으로 그렸고, 체험관의 ‘몽글 베이커리’를 비롯한 가게들은 모두 지어낸 이름이에요. 함께 쓴 오픈 소스는 저장소의 NOTICE.md에 있어요.', 'Pictures are drawn with the Stageshow kit; every shop in the playground is made up. Open-source credits are in NOTICE.md.')}</p>
        </div>
      </section>
    </div>
  )
}

/** 서랍 지도 (#/drawers): 서랍 46개를 타일로 한눈에. 누르면 그 서랍이 열려요 */
export function DrawerMap() {
  const tx = useTx()
  const tile = (d: Drawer) => { const list = inDrawer(d.id); return (
    <a key={d.id} className="dmap-tile" href={`#/dict/${d.id}`}>
      <span className="dmap-pvs" aria-hidden="true">{list.slice(0, 3).map((e) => <span key={e.id} className="dmap-pv"><Preview id={e.id} /></span>)}</span>
      <b>{tx(d.label, DRAWER_EN[d.id][0])}</b><span>{tx(d.note, DRAWER_EN[d.id][1])}</span><small>{list.length}{tx('장', ' cards')}</small>
    </a>) }
  return (
    <div className="pg-page dmap">
      <header className="pg-page-head"><h1>{tx('서랍 지도', 'Drawer map')}</h1><p>{tx(`서랍 ${DRAWERS.length}개를 한눈에 봐요. 누르면 그 서랍이 열려요.`, `All ${DRAWERS.length} drawers at a glance.`)}</p></header>
      <section className="pg-sec"><h2>{tx('UI 부품', 'UI parts')}</h2><div className="dmap-grid">{DRAWERS.filter((d) => d.group === 'part').map(tile)}</div></section>
      {FAMILIES.map((f) => <section key={f.label} className="pg-sec"><h2>{tx(f.label, f.en)}</h2><div className="dmap-grid">{f.ids.map((id) => DRAWERS.find((d) => d.id === id)!).map(tile)}</div></section>)}
    </div>
  )
}
