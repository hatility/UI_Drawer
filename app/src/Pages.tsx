// 레일 아래쪽에서 들어가는 화면들: 내 서랍(#/mine) · 비교(#/compare) · 새 소식(#/news)
import { useState } from 'react'
import { Copy, Download, FolderPlus, Link2, Trash2, Upload, X } from 'lucide-react'
import { DRAWERS, ENTRIES, byId, inDrawer, type Entry } from './data'
import { Grid } from './Grid'
import { Preview } from './Preview'
import { addFolder, importPrefs, removeFolder, setPrefs, streakDays, toggleCompare, usePrefs, weekId } from './prefs'
import { BASIC, NAMES, tellOf } from './lore'
import { NEWS } from './news'
import { PairStage, pairKind } from './PairStage'
import { NewsStage } from './NewsStage'
import { copyText, say } from './snack'
import './pages.css'

type Open = { onOpen: (id: string) => void; dex: Set<string> }
const ids2 = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean) as Entry[]

export function Mine({ onOpen, dex }: Open) {
  const p = usePrefs()
  const names = Object.keys(p.folders)
  const [folder, setFolder] = useState(names[0])
  const [tab, setTab] = useState<'got' | 'log' | 'set'>('got')
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
            <h2><button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{title} <small>{list.length}장</small></button></h2>
            <p className="pg-note">{note}</p>
            {open !== i && <div className="news-art" aria-hidden="true">{list.slice(0, 3).map((e) => <div key={e.id} className="news-art-pv"><Preview id={e.id} /></div>)}</div>}
            {open === i ? <Grid list={list} onOpen={onOpen} dex={dex} /> : <div className="news-peek">{list.slice(0, 8).map((e) => <button key={e.id} className="chip" onClick={() => onOpen(e.id)}>{e.ko}</button>)}{list.length > 8 && <button className="chip" onClick={() => setOpen(i)}>+{list.length - 8}</button>}</div>}
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
