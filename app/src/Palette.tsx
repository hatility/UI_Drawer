// 빠른 이동(⌘K · Ctrl+K): 화면 · 설정 · 카드를 한 칸에서 찾아 바로 열어요.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { search } from './data'
import { setPrefs } from './prefs'
import { say } from './snack'

type Item = { label: string; hint: string; run: () => void }
const go = (hash: string) => () => { location.hash = hash }
const PAGES: Item[] = [
  { label: '홈', hint: '화면', run: go('#/') },
  { label: '사전', hint: '화면', run: go('#/dict') },
  { label: '배우기 · 헷갈리는 짝 비교', hint: '화면', run: go('#/learn/compare') },
  { label: '배우기 · 학습 코스', hint: '화면', run: go('#/learn/course') },
  { label: '배우기 · 스피드 퀴즈', hint: '화면', run: go('#/learn/speed') },
  { label: '체험관', hint: '화면', run: go('#/play') },
  { label: '어디서나 이름표', hint: '화면', run: go('#/tags') },
  { label: '내 서랍', hint: '화면', run: go('#/mine') },
  { label: '나란히 비교', hint: '화면', run: go('#/compare') },
  { label: '새 소식', hint: '화면', run: go('#/news') },
  { label: '디자인 시스템 점검표', hint: '화면', run: go('#/audit') },
  { label: '사용성 시험', hint: '화면', run: go('#/test') },
  { label: '화면에 이름표 붙이기', hint: '화면', run: go('#/annotate') },
  { label: '배우기 · 틀린 것만 다시', hint: '화면', run: go('#/learn/wrong') },
  { label: '어둡게 보기', hint: '설정', run: () => { setPrefs(() => ({ theme: 'dark' })); say('어둡게 바꿨어요.') } },
  { label: '밝게 보기', hint: '설정', run: () => { setPrefs(() => ({ theme: 'light' })); say('밝게 바꿨어요.') } },
  { label: '큰 글자 켜기 · 끄기', hint: '설정', run: () => setPrefs((p) => ({ view: { ...p.view, big: !p.view.big } })) },
  { label: '고대비 켜기 · 끄기', hint: '설정', run: () => setPrefs((p) => ({ view: { ...p.view, contrast: !p.view.contrast } })) },
  { label: 'English · 한국어', hint: '설정', run: () => setPrefs((p) => ({ lang: p.lang === 'ko' ? 'en' : 'ko' })) },
]

export function Palette({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const items = useMemo<Item[]>(() => {
    const t = q.trim()
    const pages = PAGES.filter((p) => !t || p.label.includes(t))
    const cards = t ? search(t).slice(0, 8).map((e) => ({ label: e.ko, hint: e.en, run: () => onOpen(e.id) })) : []
    return [...cards, ...pages]
  }, [q, onOpen])
  useEffect(() => setI(0), [q])
  useEffect(() => { box.current?.querySelector('[aria-selected=true]')?.scrollIntoView({ block: 'nearest' }) }, [i])
  const run = (it?: Item) => { if (!it) return; onClose(); it.run() }

  return (
    <div className="pal-scrim" onClick={onClose}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="빠른 이동" onClick={(e) => e.stopPropagation()}>
        <label className="pal-in"><Search size={20} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="카드 이름 · 화면 · 설정을 적어 보세요" role="combobox" aria-expanded aria-controls="pal-list" aria-activedescendant={`pal-${i}`}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(items.length - 1, x + 1)) }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)) }
              else if (e.key === 'Enter') { e.preventDefault(); run(items[i]) }
            }} />
          <kbd>Esc</kbd>
        </label>
        <div className="pal-list" id="pal-list" role="listbox" ref={box}>
          {items.length ? items.map((it, k) => (
            <div key={it.label + k} id={`pal-${k}`} role="option" aria-selected={k === i} className={k === i ? 'on' : ''} onMouseEnter={() => setI(k)} onClick={() => run(it)}>
              <span>{it.label}</span><small>{it.hint}</small>
            </div>
          )) : <p className="pal-empty">맞는 것이 없어요. 생김새로 적어 보세요.</p>}
        </div>
        <p className="pal-foot"><kbd>↑</kbd><kbd>↓</kbd> 고르기 · <kbd>Enter</kbd> 열기</p>
      </div>
    </div>
  )
}
