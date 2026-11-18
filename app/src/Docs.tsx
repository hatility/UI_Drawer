// 체험관 사이트 11: 문서 편집기 ‘몽글 문서’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 목차 · 글 고르면 뜨는 서식 줄 · / 명령 · 댓글 · 함께 보는 커서 · 자동 저장 · 동기화 · 되돌리기 · 버전 기록.
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Bold, History, Italic, Link2, MessageSquare, Redo2, Undo2 } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const HEADS = ['반죽 준비', '1차 발효', '굽기']
const CMDS = ['제목', '체크리스트', '표', '사진']
const VERSIONS: [string, string][] = [['지금', '김몽글'], ['오늘 10:20', '이반죽'], ['어제 18:05', '김몽글']]

export const Docs = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Docs({ saw }, ref) {
  const [sel, setSel] = useState(false)
  const [slash, setSlash] = useState(false)
  const [comment, setComment] = useState(false)
  const [hist, setHist] = useState(false)
  const [saved, setSaved] = useState<'saving' | 'saved'>('saved')
  const [sync, setSync] = useState<'on' | 'off'>('on')
  const [steps, setSteps] = useState(['굽기 온도 200도로 바꿈', '사진 넣음'])
  const [at, setAt] = useState(0)
  useEffect(() => { if (saved !== 'saving') return; const t = setTimeout(() => setSaved('saved'), 900); return () => clearTimeout(t) }, [saved])
  const edit = () => { setSaved('saving'); saw('autosave') }

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'floating-toolbar': setSel(true); break
        case 'slash-command': setSlash(true); break
        case 'doc-comment': setComment(true); break
        case 'version-history': setHist(true); break
        case 'autosave': setSaved('saving'); break
        case 'sync-status': setSync('off'); break
        case 'undo-history': setSteps((s) => s.slice(0, -1)); break
        case 'table-of-contents': setAt(2); break
      }
      saw(id)
    },
  }))

  return (
    <div className="site dc">
      <header className="site-bar">
        <b className="site-logo">몽글 문서</b>
        <span className="dc-sync" data-ui="sync-status" data-s={sync} onClick={() => { setSync(sync === 'on' ? 'off' : 'on'); saw('sync-status') }}>{sync === 'on' ? '모두에게 저장됨' : '오프라인 · 다시 연결되면 올려요'}</span>
        <span className="dc-save" data-ui="autosave" aria-live="polite">{saved === 'saving' ? '저장 중…' : '방금 저장됨'}</span>
        <span className="dc-undo" data-ui="undo-history">
          <button className="site-icon" aria-label={`되돌리기 (${steps.length}개)`} disabled={!steps.length} title={steps[steps.length - 1]} onClick={() => { setSteps((s) => s.slice(0, -1)); saw('undo-history') }}><Undo2 size={18} /></button>
          <button className="site-icon" aria-label="다시 하기" disabled><Redo2 size={18} /></button>
        </span>
        <span className="dc-cursors" data-ui="live-cursors" aria-label="함께 보는 사람 2명"><i style={{ background: '#8f4c38' }}>이</i><i style={{ background: '#3a6ea5' }}>박</i></span>
        <button className="site-icon" aria-label="버전 기록" aria-expanded={hist} onClick={() => { setHist(!hist); saw('version-history') }}><History size={18} /></button>
      </header>
      <div className="site-scroll dc-body">
        <nav className="dc-toc" data-ui="table-of-contents" aria-label="목차">
          <small>목차</small>
          {HEADS.map((h, i) => <button key={h} className={at === i ? 'on' : ''} onClick={() => { setAt(i); saw('table-of-contents') }}>{h}</button>)}
        </nav>
        <article className="dc-page" onInput={edit}>
          <div className="dc-title" data-h="1">소금빵 굽는 법</div>
          {HEADS.map((h, i) => (
            <section key={h} className={at === i ? 'on' : ''}>
              <div className="dc-h" data-h="2">{h}</div>
              {i === 0 && <p>강력분 500g에 버터를 넣고 <span className={`dc-sel${sel ? ' on' : ''}`} data-ui="floating-toolbar" onMouseUp={() => { setSel(true); saw('floating-toolbar') }}>10분 동안 치대요.{sel && <span className="dc-float" role="toolbar" aria-label="서식"><button aria-label="굵게"><Bold size={14} /></button><button aria-label="기울임"><Italic size={14} /></button><button aria-label="링크"><Link2 size={14} /></button><button aria-label="댓글" onClick={(e) => { e.stopPropagation(); setComment(true); setSel(false); saw('doc-comment') }}><MessageSquare size={14} /></button></span>}</span></p>}
              {i === 1 && <p data-ui="doc-comment" className={comment ? 'dc-commented' : ''}>따뜻한 곳에서 <mark>40분</mark> 쉬게 둬요.{comment && <span className="dc-comment"><b>이반죽</b> 겨울에는 50분이 좋아요.<small>방금</small></span>}</p>}
              {i === 2 && <p data-ui="slash-command" className="dc-slash" onClick={() => { setSlash(true); saw('slash-command') }}>{slash ? '/' : '여기를 눌러 / 를 적어 보세요'}{slash && <span className="dc-menu" role="listbox">{CMDS.map((c, k) => <button key={c} role="option" aria-selected={k === 0} onClick={(e) => { e.stopPropagation(); setSlash(false); edit() }}>{c}</button>)}</span>}</p>}
            </section>
          ))}
        </article>
        {hist && (
          <aside className="dc-hist" data-ui="version-history" aria-label="버전 기록">
            <b>버전 기록</b>
            {VERSIONS.map(([t, who], i) => <button key={t} className={i === 0 ? 'on' : ''}><span>{t}</span><small>{who}</small></button>)}
          </aside>
        )}
      </div>
    </div>
  )
})
