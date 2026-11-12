// 첫 화면 그림 (Stageshow Stage). 이야기 한 줄:
// 하트를 누르면 스낵바가 뜨고 → 이름표가 붙고 → 이름표를 누르면 옆에서 시트(드로어)가 나와요.
// 시트를 닫고 '실행 취소'를 누르면 하트도 풀려서 처음으로 돌아가요 (되감기에 이유가 있게).
import { Stage } from './kit/stage'
import { Bar, Text, Window } from './kit/window'
import type { Act } from './kit/act'
import './hero.css'

type S = { liked: boolean; snack: boolean; tag: boolean; sheet: boolean }

const initial: S = { liked: false, snack: false, tag: false, sheet: false }
const POSTER: S = { liked: true, snack: true, tag: true, sheet: true }

async function script(a: Act<S>) {
  await a.wait(700)
  // 1. 하트 → 스낵바
  await a.move('heart')
  await a.wait(150)
  await a.click()
  await a.set({ liked: true, snack: true })
  await a.wait(650)
  // 2. 이름표가 붙어요
  await a.set({ tag: true })
  await a.wait(900)
  // 3. 이름표를 누르면 시트가 밀려 나와요
  await a.move('tag')
  await a.wait(150)
  await a.click()
  await a.set({ sheet: true })
  await a.move('rest')
  await a.wait(2600)
  // 4. 시트를 닫고 실행 취소 → 처음으로
  await a.move('sheet-close')
  await a.click()
  await a.set({ sheet: false })
  await a.wait(450)
  await a.move('undo')
  await a.wait(150)
  await a.click()
  await a.set({ liked: false, snack: false, tag: false })
  await a.move('rest')
  await a.wait(900)
}

export function HeroStage() {
  return (
    <Stage<S> width={640} height={380} initial={initial} poster={POSTER} script={script} cursor={{ at: { x: 300, y: 250 } }} className="hs">
      {(s) => (
        <>
          <Window url="monggle-bakery.test" nav urlShape="pill" className="hs-win">
            <div className="hs-app">
              <div className="hs-bar">
                <span className="hs-logo">몽글 베이커리</span>
                <span className="hs-sp" />
                <Bar w={120} h={30} r={15} tone={2} />
                <Bar w={30} h={30} r={15} tone={3} />
              </div>
              <div className="hs-grid">
                <div className="hs-card">
                  <div className="hs-img hs-img--bread">
                    <span data-target="heart" data-cursor="pointer" className="hs-heart" data-on={s.liked || undefined}>
                      <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1Z" /></svg>
                    </span>
                  </div>
                  <Text className="hs-name" style={{ fontSize: 14 }}>소금빵</Text>
                  <Text className="hs-price" style={{ fontSize: 12 }}>3,500원</Text>
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div className="hs-card" key={i}>
                    <div className="hs-img" />
                    <Bar w={[62, 50, 56, 44, 60][i]} h={7} tone={4} />
                    <Bar w={38} h={6} tone={3} />
                  </div>
                ))}
              </div>

              {/* M3 스낵바 + UI Drawer 이름표 */}
              <div className="hs-snack" data-show={s.snack || undefined}>
                <span>찜 목록에 담았어요</span>
                <span className="hs-undo" data-target="undo" data-cursor="pointer">실행 취소</span>
                <span className="hs-tag" data-target="tag" data-cursor="pointer" data-show={s.tag || undefined}>
                  <i />스낵바
                </span>
              </div>
            </div>
          </Window>

          {/* M3 사이드 시트: 창의 오른쪽 가장자리에 걸쳐 나와요 */}
          <div className="hs-sheet" data-show={s.sheet || undefined}>
            <div className="hs-sheet-head">
              <span className="hs-sheet-title">스낵바</span>
              <span className="hs-x" data-target="sheet-close" data-cursor="pointer">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </span>
            </div>
            <span className="hs-sheet-en">Snackbar</span>
            <div className="hs-sheet-pv">
              <span className="hs-mini-snack"><Bar w={54} h={5} tone={1} style={{ background: 'rgba(255,255,255,.4)' }} /><b>실행 취소</b></span>
            </div>
            <p className="hs-sheet-desc">버튼이 하나 붙은 짧은 알림이에요.</p>
            <Bar w={150} h={6} tone={3} />
            <Bar w={110} h={6} tone={3} />
            <span className="hs-sheet-btn">체험관에서 보기</span>
          </div>
          <span data-target="rest" className="hs-rest" />
        </>
      )}
    </Stage>
  )
}
