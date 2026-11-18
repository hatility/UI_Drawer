// 상세 창의 카드 시연 (Stageshow Stage).
// 커서가 그림의 주인공을 누르면 그 UI가 다시 움직여요. 두 번 눌러 처음 상태로 돌아오니 되감기에 이유가 있어요.
import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from './kit/stage'
import type { Act } from './kit/act'
import { Preview } from './Preview'

type S = { n: number }
const W = 432
const H = 240
// 그림 안에서 커서가 누를 주인공: 버튼 · 떠오르는 것 · 고른 것 순서로 찾아요
/** 자주 보는 카드는 커서가 누를 주인공을 직접 정해요 (나머지는 실제로 움직이는 것을 찾아요) */
export const FOCUS_OF: Record<string, string> = {
  snackbar: '.pv-toast b', modal: '.pv-modal .pv-btn', alert: '.pv-row2 .pv-btn:last-child', hotspot: '.px-hot i', 'toast-stack': '.px-tstack span', 'type-to-confirm': '.pv-input',
  'toggle-button': '.px-tbtn .on', 'multi-select': '.px-msl span:last-child', 'radio-card': '.px-rcard .on', 'color-swatch': '.px-sw .on', 'size-selector': '.px-size .on', 'emoji-reaction': '.px-react span:nth-child(2)',
  knob: '.px-knob', 'hold-to-confirm': '.px-hold', 'slide-to-confirm': '.px-slide i', 'resize-handle': '.px-rs .e', 'magnetic-button': '.px-mag', ripple: '.px-ripple', 'reorder-list': '.px-reo .lift',
  'close-icon': '.px-x', 'filter-icon': '.px-iconbig', 'like-icon': '.py-like .on', 'bell-icon': '.py-bell', 'cart-icon': '.py-cart', 'trash-icon': '.py-trash', 'search-icon': '.py-sx',
  'coupon-code': '.px-inv .pv-btn', 'payment-widget': '.py-pay .on', 'theme-toggle': '.py-sw b', 'drop-overlay': '.py-drop b', 'swipe-to-reply': '.py-str .pv-bubble', 'tap-to-focus': '.py-focus',
  'prompt-template': '.py-pt span:nth-child(2)', 'answer-compare': '.py-cmp2 .on', 'ai-persona': '.py-per .on', 'coupon-card': '.py-coupon > span', 'popular-badge': '.py-plan .on', 'time-slots': '.px-slots .on',
  'recurrence-picker': '.py-days .on', 'cooldown-button': '.py-cool', 'double-confirm-button': '.py-dbl', 'success-button': '.px-ok', 'destructive-button': '.px-danger', 'inline-confirm': '.pz-confirm .d',
  snooze: '.pz-noti .pv-chip', 'cart-item': '.pz-cart em', 'hover-zoom': '.pz-hz', 'button-badge': '.pz-bb', 'progress-button': '.pz-pb', 'account-type': '.px-rcard .on', 'availability-check': '.pv-input',
  'emoji-slider': '.pv-slider', 'hold-to-record': '.pz-rec .mic', 'circle-reveal': '.pz-circ i', 'page-curl': '.pz-curl i', 'week-strip': '.pz-week .on', 'option-sheet': '.pz-opt .pv-btn',
}
const FOCUS = '.pv-btn, .pv-pop, .px-on, .on, .pv-toggle, .pv-chip, .pv-input, .pv-modal, .pv-toast, .pv-badge, b, i'

async function script(a: Act<S>) {
  await a.wait(1200)
  await a.move('focus')
  await a.wait(150)
  await a.click()
  await a.set({ n: 1 })
  await a.move('rest')
  await a.wait(2600)
  await a.move('focus')
  await a.wait(150)
  await a.click()
  await a.set({ n: 0 })
  await a.move('rest')
  await a.wait(2200)
}

/** 그림 속 주인공의 가운데에 보이지 않는 과녁을 놓아요 (스테이지 좌표) */
function Focus({ n, id }: { n: number; id: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [at, setAt] = useState({ x: W / 2, y: H / 2 })
  useLayoutEffect(() => {
    const stage = ref.current?.parentElement
    const pv = stage?.querySelector('.pv')
    if (!stage || !pv) return
    const big = (x: Element) => { const r = x.getBoundingClientRect(); return r.width > 6 && r.height > 6 }
    // 실제로 움직이는 것이 주인공이에요. 없으면 버튼 · 떠오르는 것 순서로 찾아요
    const moving = pv.getAnimations({ subtree: true }).map((a) => (a.effect as KeyframeEffect | null)?.target).filter((t): t is HTMLElement => !!t && t !== pv && big(t))
    const fixed = FOCUS_OF[id] ? pv.querySelector<HTMLElement>(FOCUS_OF[id]) : null
    const el = (fixed && big(fixed) ? fixed : null) ?? moving.find((t) => t.matches(FOCUS)) ?? moving[0] ?? [...pv.querySelectorAll<HTMLElement>(FOCUS)].find(big) ?? pv
    const s = stage.getBoundingClientRect()
    const k = s.width / stage.offsetWidth || 1
    const r = el.getBoundingClientRect()
    setAt({ x: Math.round((r.left + r.width / 2 - s.left) / k), y: Math.round((r.top + r.height / 2 - s.top) / k) })
  }, [n, id])
  return <span ref={ref} data-target="focus" data-cursor="pointer" className="cd-focus" style={{ left: at.x, top: at.y }} />
}

export function CardDemo({ id }: { id: string }) {
  return (
    <Stage<S> width={W} height={H} compact={{ below: 420, width: 358, height: 220 }} initial={{ n: 0 }} poster={{ n: 0 }} script={script}
      cursor={{ at: { wide: { x: W - 48, y: H - 36 }, compact: { x: 310, y: 184 } } }} className="cd">
      {(s, _r, layout) => (
        <>
          <Preview key={s.n} id={id} size="large" />
          <Focus n={s.n} id={id} />
          {/* 쉬는 자리 = 커서가 시작하는 자리라서 한 바퀴가 이음매 없이 이어져요 */}
          <span data-target="rest" className="cd-rest" style={layout === 'wide' ? { left: W - 48, top: H - 36 } : { left: 310, top: 184 }} />
        </>
      )}
    </Stage>
  )
}
