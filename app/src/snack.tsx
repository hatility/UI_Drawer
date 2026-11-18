// 화면 아래 스낵바 하나로 알림을 모아요. 복사 · 저장 · 담기처럼 방금 한 일을 짧게 알려 주고, 되돌릴 수 있으면 ‘실행 취소’를 붙여요.
import { useEffect, useSyncExternalStore } from 'react'

type Snack = { msg: string; undo?: () => void; k: number } | null
let cur: Snack = null
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

/** say('링크를 복사했어요') · say('폴더에서 뺐어요', () => 되돌리기) */
export function say(msg: string, undo?: () => void) { cur = { msg, undo, k: Date.now() }; emit() }
/** 클립보드에 넣고 알려 줘요. 막힌 브라우저면 그렇다고 말해요 */
export function copyText(text: string, msg: string) {
  const ok = () => say(msg)
  const fail = () => say('복사하지 못했어요. 브라우저가 클립보드를 막고 있어요.')
  if (!navigator.clipboard) return fail()
  navigator.clipboard.writeText(text).then(ok, fail)
}

export function Snackbar() {
  const s = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => cur)
  useEffect(() => {
    if (!s) return
    // 실행 취소가 있으면 조금 더 오래 보여 줘요
    const t = setTimeout(() => { if (cur?.k === s.k) { cur = null; emit() } }, s.undo ? 6000 : 3500)
    return () => clearTimeout(t)
  }, [s])
  return (
    <div className="snack" role="status" aria-live="polite">
      {s && (
        <div className="snack-in" key={s.k}>
          <span>{s.msg}</span>
          {s.undo && <button onClick={() => { s.undo!(); cur = null; emit() }}>실행 취소</button>}
        </div>
      )}
    </div>
  )
}
