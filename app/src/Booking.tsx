// 체험관 사이트 6: 예약 ‘몽글 빵 클래스’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 수업 고르기 → 날짜 띠 → 시간 칸 → 반복 · 시간대 → 내 예약 목록. 꽉 찬 수업은 대기 명단에 줄 서요.
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Check } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const CLASSES: [string, string, number, boolean][] = [['소금빵 원데이', '초급 · 2시간', 22, false], ['크루아상 결 만들기', '중급 · 3시간', 23, true], ['아이와 쿠키 굽기', '가족 · 1시간', 24, false]]
const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30']
const FULL = new Set(['11:30', '16:00'])
const ZONES: [string, number][] = [['서울', 0], ['런던', -9], ['뉴욕', -14]]

export const Booking = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Booking({ saw }, ref) {
  const [cls, setCls] = useState(0)
  const [day, setDay] = useState(2)
  const [slot, setSlot] = useState<string | null>(null)
  const [repeat, setRepeat] = useState<number[]>([])
  const [zone, setZone] = useState(0)
  const [mine, setMine] = useState<[string, string][]>([['17 월', '빵 반죽 기초 14:30']])
  const [queue, setQueue] = useState<number | null>(null)
  const at = (t: string) => { const [h, m] = t.split(':').map(Number); const hh = (h + ZONES[zone][1] + 24) % 24; return `${hh < 12 ? '오전' : '오후'} ${hh % 12 || 12}:${String(m).padStart(2, '0')}` }

  const book = () => {
    if (!slot) return
    setMine((m) => [...m, [`${17 + day} ${DAYS[day]}`, `${CLASSES[cls][0]} ${slot}${repeat.length ? ` · 매주 ${repeat.map((d) => DAYS[d]).join('·')}` : ''}`]])
    setSlot(null); saw('calendar-agenda')
  }

  useImperativeHandle(ref, () => ({
    demo(id) {
      // 대기 명단 말고는 예약할 수 있는 수업으로 돌아와서 보여 줘요
      if (id !== 'waitlist') { setCls(0); setQueue(null) }
      switch (id) {
        case 'waitlist': setCls(1); setQueue(4); saw(id); break
        case 'time-slots': setSlot('13:00'); saw(id); break
        case 'recurrence-picker': setRepeat([1, 3]); saw(id); break
        case 'timezone-picker': setZone(2); saw(id); break
        case 'calendar-agenda': setSlot('14:30'); setTimeout(book, 300); break
        default: saw(id)
      }
    },
  }))

  return (
    <div className="site bk2">
      <header className="site-bar"><b className="site-logo">몽글 빵 클래스</b><small className="bk2-mine">내 예약 {mine.length}</small></header>
      <div className="site-scroll bk2-body">
        <section className="bk2-classes">
          {CLASSES.map(([n, d, date, full], i) => (
            <button key={n} className={`bk2-ev${cls === i ? ' on' : ''}`} data-ui={i === 0 ? 'event-card' : undefined} onClick={() => { setCls(i); setQueue(null); saw('event-card') }}>
              <span className="d"><small>NOV</small><b>{date}</b></span>
              <span className="t"><b>{n}</b><small>{d}{full && ' · 마감'}</small></span>
            </button>
          ))}
        </section>

        {CLASSES[cls][3] ? (
          <section className="bk2-wait" data-ui="waitlist">
            <b>이 수업은 꽉 찼어요</b>
            {queue ? <p>대기 순번 <em>{queue}번</em> · 자리가 나면 문자로 알려 드려요</p> : <p>대기 명단에 이름을 올려 둘까요?</p>}
            {!queue && <button className="site-btn" onClick={() => { setQueue(4); saw('waitlist') }}>대기 명단에 올리기</button>}
          </section>
        ) : (
          <>
            <div className="bk2-week" data-ui="week-strip">
              {DAYS.map((d, i) => <button key={d} className={day === i ? 'on' : ''} onClick={() => { setDay(i); setSlot(null); saw('week-strip') }}><small>{d}</small><b>{17 + i}</b></button>)}
            </div>
            <div className="bk2-slots" data-ui="time-slots">
              {SLOTS.map((t) => <button key={t} disabled={FULL.has(t)} className={slot === t ? 'on' : ''} onClick={() => { setSlot(t); saw('time-slots') }}>{at(t)}{FULL.has(t) && <small>마감</small>}</button>)}
            </div>
            <div className="bk2-opts">
              <div data-ui="recurrence-picker"><small>매주 반복</small><span className="bk2-days">{DAYS.map((d, i) => <button key={d} aria-pressed={repeat.includes(i)} className={repeat.includes(i) ? 'on' : ''} onClick={() => { setRepeat((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i])); saw('recurrence-picker') }}>{d}</button>)}</span></div>
              <label data-ui="timezone-picker"><small>시간대</small><select value={zone} onChange={(e) => { setZone(+e.target.value); saw('timezone-picker') }}>{ZONES.map(([z], i) => <option key={z} value={i}>{z}</option>)}</select></label>
            </div>
            <button className="site-btn site-btn--wide" disabled={!slot} onClick={book}>{slot ? `${17 + day}일 ${at(slot)} 예약하기` : '시간을 골라 주세요'}</button>
          </>
        )}

        <section className="bk2-agenda" data-ui="calendar-agenda">
          <div data-h="3">내 예약</div>
          {mine.map(([d, t], i) => <div key={i} className={i === mine.length - 1 && i > 0 ? 'new' : ''}><b>{d}</b><span>{t}</span>{i === mine.length - 1 && i > 0 && <Check size={14} />}</div>)}
        </section>
      </div>
    </div>
  )
})
