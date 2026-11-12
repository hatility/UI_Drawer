// 체험관 PC · 모바일이 함께 쓰는 이름표와 반짝 표시.
// box 안에서 data-ui="사전 id" 가 달린 요소를 찾아 이름표를 붙이고, spot(id) 로 그 자리를 반짝여요.
import { useCallback, useEffect, useState, type ReactNode, type RefObject } from 'react'
import { byId } from './data'

export type Rect = { x: number; y: number; w: number; h: number }
/** box 기준 위치. box 가 줄어 그려진 곳(Phone 화면)이면 그 배율만큼 되돌려요. */
export const relRect = (el: Element, box: HTMLElement): Rect => {
  const a = el.getBoundingClientRect()
  const b = box.getBoundingClientRect()
  const k = box.offsetWidth ? b.width / box.offsetWidth : 1
  return { x: (a.left - b.left) / k, y: (a.top - b.top) / k, w: a.width / k, h: a.height / k }
}

export function useLabels(box: RefObject<HTMLElement | null>, on: boolean, onOpen: (id: string) => void) {
  const [pins, setPins] = useState<{ id: string; x: number; y: number }[]>([])
  const [flash, setFlash] = useState<Rect | null>(null)

  // 화면에 보이는 data-ui 마다 이름표 하나 (같은 이름은 첫 번째만)
  const measure = useCallback(() => {
    const el = box.current
    if (!el) return
    const h = el.offsetHeight
    const seen = new Set<string>()
    // 겹치면 오른쪽으로 비켜 앉아요.
    // ponytail: 글자 수로 너비를 어림해요. 이름표가 아주 많아지면 실제 너비를 재도록.
    const placed: { x: number; y: number; w: number }[] = []
    const out: { id: string; x: number; y: number }[] = []
    el.querySelectorAll<HTMLElement>('[data-ui]').forEach((t) => {
      const id = t.dataset.ui!
      if (seen.has(id) || !byId.has(id) || t.closest('[data-hidden]')) return
      const r = relRect(t, el)
      if (r.w === 0 || r.y + r.h < 0 || r.y > h) return
      seen.add(id)
      const w = byId.get(id)!.ko.length * 11 + 26
      let x = Math.max(4, r.x)
      const y = Math.max(4, r.y - 11)
      const hit = () => placed.find((q) => Math.abs(q.y - y) < 20 && x < q.x + q.w && q.x < x + w)
      for (let q = hit(); q; q = hit()) x = q.x + q.w + 4
      placed.push({ x, y, w })
      out.push({ id, x, y })
    })
    setPins(out)
  }, [box])

  useEffect(() => {
    if (!on) return
    measure()
    const t = setInterval(measure, 400)
    return () => clearInterval(t)
  }, [on, measure])

  const spot = useCallback((id: string) => {
    const el = box.current
    const t = [...(el?.querySelectorAll<HTMLElement>(`[data-ui="${id}"]`) ?? [])].find((x) => !x.closest('[data-hidden]'))
    if (!el || !t) return
    t.scrollIntoView({ block: 'center', behavior: 'smooth' })
    setTimeout(() => setFlash(relRect(t, el)), 420)
    setTimeout(() => setFlash(null), 2000)
  }, [box])

  const overlay: ReactNode = (
    <>
      {on && (
        <div className="pg-pins">
          {pins.map((p) => <button key={p.id} className="pg-pin" style={{ left: p.x, top: p.y }} onClick={() => onOpen(p.id)}>{byId.get(p.id)!.ko}</button>)}
        </div>
      )}
      {flash && <span className="pg-flash" style={{ left: flash.x - 6, top: flash.y - 6, width: flash.w + 12, height: flash.h + 12 }} />}
    </>
  )
  return { overlay, spot, measure }
}
