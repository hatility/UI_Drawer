// Stageshow: 새 소식 머리 그림. 서랍에 새 카드가 하나씩 들어오고, 위의 카드 수가 함께 올라가요. 한 번만 재생해요.
import { Stage } from './kit/stage'
import { Bar, Window } from './kit/window'
import { Collapse } from './kit/motion/Collapse'
import { Count } from './kit/motion/Count'
import type { Act } from './kit/act'
import { ENTRIES } from './data'
import './pair.css'

type S = { n: number }
const NEW = ENTRIES.slice(-3).reverse()
const BASE = ENTRIES.length - NEW.length

async function script(a: Act<S>) {
  await a.wait(600)
  for (let i = 1; i <= NEW.length; i++) { await a.set({ n: i }); await a.wait(900) }
}

export function NewsStage() {
  return (
    <Stage<S> fill play="once" width={640} height={280} compact={{ below: 600, width: 358, height: 300 }} initial={{ n: 0 }} poster={{ n: NEW.length }} script={script} className="ns">
      {(s) => (
        <Window url="ui-drawer.app/새-소식" nav urlShape="pill" className="ns-win">
          <div className="ns-app">
            <div className="ns-head">
              <b>내 서랍</b>
              <span className="ns-count"><Count value={BASE + s.n} format={(v) => `${Math.round(v)}장`} /></span>
            </div>
            {NEW.map((e, i) => (
              <Collapse key={e.id} open={s.n > i}>
                <div className="ns-row"><i className="ns-dot" /><b>{e.ko}</b><span>{e.en}</span><em>새로</em></div>
              </Collapse>
            ))}
            {[70].map((w, i) => <div key={i} className="ns-row ns-row--old"><i className="ns-dot" /><Bar w={w} h={7} tone={4} /><Bar w={44} h={6} tone={3} /></div>)}
          </div>
        </Window>
      )}
    </Stage>
  )
}
