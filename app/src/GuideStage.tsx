// 체험관 첫 안내 그림 (Stageshow Stage). 이야기 한 줄:
// 이름표 스위치를 켜면 화면 속 UI마다 이름이 붙고 → ‘카드’ 이름표를 누르면 옆에서 설명이 나와요.
// 설명을 닫고 스위치를 끄면 처음으로 돌아가요 (되감기에 이유가 있게).
import { Stage } from './kit/stage'
import { Bar, Text, Window } from './kit/window'
import { Toggle } from './kit/controls/Toggle'
import { Segmented } from './kit/controls/Segmented'
import type { Act } from './kit/act'
import './guide.css'

type S = { on: boolean; sheet: boolean }
const initial: S = { on: false, sheet: false }

/** 글자를 가리지 않게 버튼의 오른쪽 아래쪽을 눌러요 (Stageshow: aim off the label) */
const aside = (a: { rect: (n: string) => { x: number; y: number; width: number; height: number } }, name: string) => { const r = a.rect(name); return { x: r.x + r.width * 0.86, y: r.y + r.height * 0.82 } }
async function script(a: Act<S>) {
  await a.wait(800)
  await a.move('sw')
  await a.wait(150)
  await a.click()
  await a.set({ on: true })
  await a.wait(1500)
  await a.move(aside(a, 'pin-card'))
  await a.wait(150)
  await a.click()
  await a.set({ sheet: true })
  await a.move('rest')
  await a.wait(2600)
  await a.move('x')
  await a.click()
  await a.set({ sheet: false })
  await a.wait(400)
  await a.move('sw')
  await a.wait(150)
  await a.click()
  await a.set({ on: false })
  await a.move('rest')
  await a.wait(900)
}

/** 이름표: 켜지면 차례로 붙어요 (d: 몇 번째인지) */
const Pin = ({ d, name, target }: { d: number; name: string; target?: string }) => (
  <i className="gs-pin" style={{ ['--d' as string]: d }} data-target={target} data-cursor={target ? 'pointer' : undefined}>{name}</i>
)

export function GuideStage() {
  return (
    <Stage<S> fill width={640} height={300} compact={{ below: 560, width: 358, height: 300 }} initial={initial} poster={{ on: true, sheet: true }} script={script}
      cursor={{ at: { wide: { x: 300, y: 250 }, compact: { x: 180, y: 250 } } }} className="gs">
      {(s, _r, layout) => (
        <>
          <Window url="ui-drawer.app/체험관" nav urlShape="pill" className="gs-win">
            <div className="gs-tools">
              <Segmented items={layout === 'wide' ? ['빵집', '커뮤니티', '은행'] : ['빵집', '은행']} value={0} />
              <span className="gs-sw"><Text>이름표</Text><Toggle on={s.on} data-target="sw" data-cursor="pointer" aria-label="이름표" /></span>
            </div>
            <div className="gs-page" data-on={s.on || undefined}>
              <div className="gs-head">
                <span className="gs-wrap"><Pin d={0} name="GNB" /><b className="gs-logo">몽글 베이커리</b></span>
                {layout === 'wide' ? <span className="gs-wrap"><Pin d={1} name="검색바" /><Bar w={150} h={28} r={14} tone={2} /></span> : <Bar w={84} h={28} r={14} tone={2} />}
              </div>
              <div className="gs-cards">
                <div className="gs-card gs-wrap gs-focus">
                  <Pin d={2} name="카드" target="pin-card" />
                  <i className="gs-img gs-img--bread" />
                  <Text className="gs-name">소금빵</Text>
                  <span className="gs-wrap gs-btnwrap"><Pin d={3} name="버튼" /><span className="gs-btn">담기</span></span>
                </div>
                {[0, 1].slice(0, layout === 'wide' ? 2 : 1).map((i) => (
                  <div className="gs-card" key={i}><i className="gs-img" /><Bar w={[60, 48][i]} h={7} tone={4} /><Bar w={38} h={6} tone={3} /></div>
                ))}
              </div>
            </div>
          </Window>
          <div className="gs-sheet" data-show={s.sheet || undefined}>
            <div className="gs-sheet-head"><b>카드</b><span className="gs-x" data-target="x" data-cursor="pointer"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6l12 12M18 6 6 18" /></svg></span></div>
            <small>Card</small>
            <p>내용을 한 덩어리로 묶은 상자예요.</p>
            <span className="gs-sheet-btn">사전에서 보기</span>
          </div>
          <span data-target="rest" className="gs-rest" />
        </>
      )}
    </Stage>
  )
}
