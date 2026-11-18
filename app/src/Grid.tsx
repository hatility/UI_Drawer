// 이름 카드 격자. 사전 · 홈에서 함께 써요.
import { Check } from 'lucide-react'
import type { Entry } from './data'
import { Preview } from './Preview'
import { watchInView } from './inView'
import { usePrefs } from './prefs'

export function Grid({ list, onOpen, dex }: { list: Entry[]; onOpen: (id: string) => void; dex?: Set<string> }) {
  const en = usePrefs().lang === 'en'
  return (
    <div className="grid">
      {list.map((e) => (
        <button key={e.id} ref={watchInView} className="ec" data-card={e.id} onClick={() => onOpen(e.id)}>
          <div className="ec-pv"><Preview id={e.id} /></div>
          <b>{en ? e.en : e.ko}</b>
          <span>{en ? e.ko : e.en}</span>
          {dex?.has(e.id) && <i className="ec-got" title="내 서랍에 모았어요"><Check size={14} /></i>}
        </button>
      ))}
    </div>
  )
}
