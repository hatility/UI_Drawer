// 체험관 사이트 7: 회원 가입 ‘몽글 회원’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 간편 로그인 → 아이디 중복 확인 → 비밀번호(보기 · 강도 · 규칙 · 확인) → 사람 확인 → 메일 보냄.
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Check, Eye, EyeOff, Mail } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const TAKEN = new Set(['mongle', 'admin', 'bread'])
const RULES: [string, (p: string) => boolean][] = [['8자 이상', (p) => p.length >= 8], ['숫자 포함', (p) => /\d/.test(p)], ['특수문자 포함', (p) => /[^\w\s]/.test(p)]]

export const Join = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Join({ saw }, ref) {
  const [idv, setIdv] = useState('')
  const [checked, setChecked] = useState<null | boolean>(null)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [show, setShow] = useState(false)
  const [human, setHuman] = useState(false)
  const [sent, setSent] = useState(false)
  const pass = RULES.filter(([, f]) => f(pw)).length
  const ok = checked === true && pass === 3 && pw === pw2 && human

  useImperativeHandle(ref, () => ({
    demo(id) {
      setSent(false)
      switch (id) {
        case 'availability-check': setIdv('mongle'); setChecked(false); break
        case 'password-toggle': setPw('bread2026!'); setShow(true); break
        case 'password-strength': case 'password-rules': setPw('bread20'); break
        case 'password-confirm': setPw('bread2026!'); setPw2('bread2026?'); break
        case 'captcha': setHuman(true); break
        case 'email-sent': setSent(true); break
      }
      saw(id)
    },
  }))

  return (
    <div className="site jn">
      <header className="site-bar"><b className="site-logo">몽글 회원</b><small>가입 · 로그인</small></header>
      <div className="site-scroll jn-body">
        {sent ? (
          <section className="jn-sent" data-ui="email-sent">
            <Mail size={40} /><b>메일을 보냈어요</b>
            <p>받은 편지함에서 ‘가입 확인’ 버튼을 누르면 끝나요. 메일이 없으면 스팸함도 봐 주세요.</p>
            <button className="site-btn site-btn--line" onClick={() => setSent(false)}>처음으로</button>
          </section>
        ) : (
          <form className="jn-form" onSubmit={(e) => { e.preventDefault(); if (ok) { setSent(true); saw('email-sent') } }}>
            <div className="jn-social" data-ui="social-login">
              <button type="button" className="jn-sns k" onClick={() => saw('social-login')}>카카오로 시작</button>
              <button type="button" className="jn-sns n" onClick={() => saw('social-login')}>네이버로 시작</button>
              <span className="jn-or">또는 직접 가입</span>
            </div>

            <label className="jn-label">아이디</label>
            <div className="jn-row" data-ui="availability-check">
              <input className="jn-in" value={idv} onChange={(e) => { setIdv(e.target.value.replace(/[^a-z0-9]/g, '')); setChecked(null) }} placeholder="영문 소문자 · 숫자" aria-describedby="jn-id-msg" />
              <button type="button" className="site-btn site-btn--line" disabled={!idv} onClick={() => { setChecked(!TAKEN.has(idv)); saw('availability-check') }}>중복 확인</button>
            </div>
            <small id="jn-id-msg" className={`jn-msg${checked === false ? ' bad' : checked ? ' good' : ''}`}>{checked === false ? '이미 쓰는 아이디예요' : checked ? '쓸 수 있는 아이디예요' : ' '}</small>

            <label className="jn-label">비밀번호</label>
            <div className="jn-pw" data-ui="password-toggle">
              <input className="jn-in" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} aria-describedby="jn-rules" />
              <button type="button" className="site-icon" aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'} onClick={() => { setShow(!show); saw('password-toggle') }}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="jn-meter" data-ui="password-strength" data-lv={pass} aria-label={`강도 ${['없음', '약함', '보통', '강함'][pass]}`}><i /><i /><i /><small>{['', '약함', '보통', '강함'][pass]}</small></div>
            <ul className="jn-rules" id="jn-rules" data-ui="password-rules">{RULES.map(([t, f]) => <li key={t} data-ok={f(pw) || undefined}><Check size={14} />{t}</li>)}</ul>

            <label className="jn-label">비밀번호 확인</label>
            <div data-ui="password-confirm">
              <input className="jn-in" type="password" value={pw2} onChange={(e) => { setPw2(e.target.value); saw('password-confirm') }} />
              <small className={`jn-msg${pw2 && pw !== pw2 ? ' bad' : pw2 ? ' good' : ''}`}>{pw2 ? (pw === pw2 ? '똑같아요' : '위와 달라요') : ' '}</small>
            </div>

            <label className="jn-cap" data-ui="captcha"><input type="checkbox" checked={human} onChange={(e) => { setHuman(e.target.checked); saw('captcha') }} /><span>로봇이 아닙니다</span><small>사람 확인</small></label>

            <button className="site-btn site-btn--wide" disabled={!ok}>가입하기</button>
          </form>
        )}
      </div>
    </div>
  )
})
