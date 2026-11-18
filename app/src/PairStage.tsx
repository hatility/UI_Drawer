// Stageshow: 헷갈리는 짝을 같은 행동으로 비교해요. 왼쪽 창과 오른쪽 창에서 같은 버튼을 누르면 결과가 다르게 나와요.
// 짝 셋: 모달 · 바텀시트 / 툴팁 · 팝오버 / 체크박스 · 토글. 나란히 보기(#/vs/…)에서 그 짝일 때만 보여요.
import { Stage } from './kit/stage'
import { Bar, Window } from './kit/window'
import { Phone } from './kit/phone'
import type { Act } from './kit/act'
import './pair.css'

export type PairKind = 'modal-sheet' | 'tip-pop' | 'check-toggle'
const KIND: Record<string, PairKind> = { 'bottom-sheet|modal': 'modal-sheet', 'popover|tooltip': 'tip-pop', 'checkbox|toggle': 'check-toggle' }
export const pairKind = (a: string, b: string) => KIND[[a, b].sort().join('|')]

type S = { a: boolean; b: boolean; saved: boolean }
const initial: S = { a: false, b: false, saved: false }
const POSTER: S = { a: true, b: true, saved: true }

const LABEL: Record<PairKind, [string, string, string]> = {
  'modal-sheet': ['모달', '바텀시트', '빵 옵션 고르기'],
  'tip-pop': ['툴팁', '팝오버', ''],
  'check-toggle': ['체크박스', '토글', ''],
}

/** 글자를 가리지 않게 오른쪽 아래쪽을 눌러요 */
const aside = (a: Act<S>, name: string) => { const r = a.rect(name); return { x: r.x + r.width * 0.86, y: r.y + r.height * 0.82 } }

function scriptOf(kind: PairKind) {
  return async (a: Act<S>) => {
    await a.wait(700)
    await a.move(aside(a, 'a-btn')); await a.wait(120)
    if (kind !== 'tip-pop') await a.click()
    await a.set({ a: true })
    await a.wait(kind === 'check-toggle' ? 700 : 1500)
    if (kind === 'check-toggle') { await a.move(aside(a, 'a-save')); await a.click(); await a.set({ saved: true }); await a.wait(900) }
    await a.move(aside(a, 'b-btn')); await a.wait(120)
    if (kind === 'tip-pop') await a.set({ a: false })
    await a.click()
    await a.set({ b: true })
    await a.wait(2200)
    // 닫는 이유가 보이게: 오른쪽은 닫기, 왼쪽은 다시 눌러 처음으로
    await a.move(aside(a, kind === 'check-toggle' ? 'b-btn' : 'b-close')); await a.click()
    await a.set({ b: false })
    await a.wait(400)
    if (kind !== 'tip-pop') { await a.move(aside(a, kind === 'check-toggle' ? 'a-btn' : 'a-close')); await a.click() }
    await a.set({ a: false, saved: false })
    await a.move('rest')
    await a.wait(800)
  }
}

function Side({ kind, side, s }: { kind: PairKind; side: 'a' | 'b'; s: S }) {
  const on = s[side]
  const [la, lb, act] = LABEL[kind]
  const t = (n: string) => `${side}-${n}`
  return (
    <div className={`ps-half ps-${side}`}>
      <div className="ps-app" data-on={on || undefined}>
        <span className="ps-tag">{side === 'a' ? la : lb}</span>
        <div className="ps-bar"><b>몽글 베이커리</b><Bar w={44} h={8} tone={3} /></div>
        <div className="ps-card"><i className="ps-img" /><div><b>소금빵</b><Bar w={60} h={6} tone={3} /></div>
          {kind === 'tip-pop' && <>
            <span className="ps-icon" data-target={t('btn')} data-cursor="pointer">?</span>
            {side === 'a' ? <span className="ps-tip">버터를 넣어 구워요</span> : (
              <div className="ps-pop"><b>소금빵이란?</b><span>버터를 넣어 구운 빵이에요.</span><span className="ps-x" data-target={t('close')} data-cursor="pointer">닫기</span></div>
            )}
          </>}
        </div>
        {kind === 'modal-sheet' && <>
          <span className="ps-btn" data-target={t('btn')} data-cursor="pointer">{act}</span>
          <div className="ps-scrim" />
          {side === 'a' ? (
            <div className="ps-modal"><b>빵 옵션</b><span className="ps-opt on">버터 추가</span><span className="ps-opt">그대로</span><span className="ps-x" data-target={t('close')} data-cursor="pointer">닫기</span></div>
          ) : (
            <div className="ps-sheet"><i className="ps-grab" /><b>빵 옵션</b><span className="ps-opt on">버터 추가</span><span className="ps-opt">그대로</span><span className="ps-x" data-target={t('close')} data-cursor="pointer">닫기</span></div>
          )}
        </>}
        {kind === 'check-toggle' && <>
          <div className="ps-row"><span>새 빵 알림</span>
            {side === 'a' ? <span className="ps-check" data-target={t('btn')} data-cursor="pointer" data-on={on || undefined} /> : <span className="ps-toggle" data-target={t('btn')} data-cursor="pointer" data-on={on || undefined}><i /></span>}
          </div>
          {side === 'a' ? <span className="ps-btn" data-target="a-save" data-cursor="pointer" data-done={s.saved || undefined}>{s.saved ? '저장했어요' : '저장'}</span> : <span className="ps-note">누르자마자 바뀌어요</span>}
        </>}
      </div>
    </div>
  )
}

export function PairStage({ kind }: { kind: PairKind }) {
  return (
    <Stage<S> fill width={720} height={380} compact={{ below: 640, width: 358, height: 580 }} initial={initial} poster={POSTER} script={scriptOf(kind)}
      cursor={{ at: { wide: { x: 380, y: 350 }, compact: { x: 300, y: 300 } } }} className={`ps ps--${kind}`}>
      {(s, _r, layout) => (
        <>
          {layout === 'wide' ? (
            <Window url="monggle-bakery.test" nav urlShape="pill" className="ps-win">
              <div className="ps-split"><Side kind={kind} side="a" s={s} /><Side kind={kind} side="b" s={s} /></div>
            </Window>
          ) : (
            <Phone width={300} className="ps-phone">
              <div className="ps-split"><Side kind={kind} side="a" s={s} /><Side kind={kind} side="b" s={s} /></div>
            </Phone>
          )}
          <span data-target="rest" className="ps-rest" />
        </>
      )}
    </Stage>
  )
}
