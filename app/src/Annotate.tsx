// 화면에 이름표 붙이기: 내 화면 사진(또는 예시)에 사전 카드 이름을 눌러 붙이고, 이미지로 내려받아요.
// 사진은 이 브라우저 안에서만 다루고 어디에도 올리지 않아요.
import { useRef, useState } from 'react'
import { Download, ImagePlus, Trash2 } from 'lucide-react'
import { ENTRIES, byId } from './data'
import { say } from './snack'
import './pages.css'

type Tag = { id: string; x: number; y: number }

export function Annotate({ onOpen }: { onOpen: (id: string) => void }) {
  const [src, setSrc] = useState('og.png')
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<number | null>(null)
  const pickId = () => ENTRIES.find((e) => e.ko === name.trim() || e.id === name.trim())?.id
  const at = (ev: { clientX: number; clientY: number }) => { const r = box.current!.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)) } }

  const place = (ev: React.MouseEvent) => {
    if ((ev.target as HTMLElement).closest('.an-tag')) return
    const id = pickId()
    if (!id) { say('먼저 붙일 카드 이름을 골라 주세요.'); return }
    setTags((t) => [...t, { id, ...at(ev) }])
  }
  const save = async () => {
    const img = new Image(); img.src = src; await img.decode()
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
    const g = c.getContext('2d')!; g.drawImage(img, 0, 0)
    const k = Math.max(1, c.width / 900)
    g.font = `600 ${14 * k}px system-ui, -apple-system, 'Apple SD Gothic Neo', sans-serif`
    for (const t of tags) {
      const label = byId.get(t.id)!.ko, w = g.measureText(label).width + 16 * k, h = 26 * k
      const x = t.x * c.width, y = t.y * c.height
      g.fillStyle = '#006a60'; g.beginPath(); g.roundRect(x, y - h, w, h, 6 * k); g.fill()
      g.fillRect(x, y - 2 * k, 2 * k, 10 * k)
      g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(label, x + 8 * k, y - h / 2)
    }
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'UI-이름표.png'; a.click()
    say('이름표를 붙인 그림을 내려받았어요.')
  }

  return (
    <div className="pg-page">
      <header className="pg-page-head">
        <h1>화면에 이름표 붙이기</h1>
        <p>내 화면 사진을 올리고, 카드 이름을 고른 다음 사진을 눌러 이름표를 붙여요. 붙인 이름표는 끌어서 옮길 수 있어요. 사진은 이 브라우저 밖으로 나가지 않아요.</p>
      </header>
      <div className="an-tools">
        <label className="btn-text"><ImagePlus size={16} />내 화면 사진 올리기<input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { setSrc(URL.createObjectURL(f)); setTags([]) } }} /></label>
        <input className="an-name" list="an-cards" value={name} onChange={(e) => setName(e.target.value)} placeholder="붙일 카드 이름 (예: 바텀시트)" aria-label="붙일 카드 이름" />
        <datalist id="an-cards">{ENTRIES.map((e) => <option key={e.id} value={e.ko} />)}</datalist>
        <button className="btn" onClick={save} disabled={!tags.length}><Download size={16} />그림으로 내려받기</button>
        {tags.length > 0 && <button className="btn-text" onClick={() => { const keep = tags; setTags([]); say('이름표를 모두 뗐어요.', () => setTags(keep)) }}><Trash2 size={16} />모두 떼기</button>}
      </div>
      <div className="an-box" ref={box} onClick={place}
        onPointerMove={(ev) => { if (drag.current === null) return; const p = at(ev); setTags((t) => t.map((x, i) => (i === drag.current ? { ...x, ...p } : x))) }}
        onPointerUp={() => { drag.current = null }}>
        <img src={src} alt="이름표를 붙일 화면" draggable={false} />
        {tags.map((t, i) => (
          <span key={i} className="an-tag" style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
            onPointerDown={(ev) => { ev.stopPropagation(); (ev.target as HTMLElement).setPointerCapture(ev.pointerId); drag.current = i }}
            onDoubleClick={() => onOpen(t.id)} title="끌어서 옮기기 · 두 번 눌러 카드 보기">
            {byId.get(t.id)!.ko}
            <button aria-label={`${byId.get(t.id)!.ko} 이름표 떼기`} onClick={(ev) => { ev.stopPropagation(); setTags((x) => x.filter((_, j) => j !== i)) }}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}
