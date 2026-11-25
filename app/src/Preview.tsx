// 카드마다 들어가는 작은 그림. Stageshow 규칙대로:
// 주변은 회색 뼈대(Bar), 주인공 하나만 색과 진짜 글자를 가져요.
// 카드에 마우스를 올리면 주인공이 한 번 움직여요 (preview.css).
import type { ReactNode } from 'react'
import { Bar } from './kit/window'
import { MOTION } from './motion'
import { byId } from './data'
import { scene, PIC_MOTION } from './PreviewMore'
import './preview.css'

const Lines = ({ n = 3, w = [80, 64, 72, 56] }: { n?: number; w?: number[] }) => (
  <div className="pv-lines">{Array.from({ length: n }, (_, i) => <Bar key={i} w={`${w[i % w.length]}%`} h={5} tone={3} />)}</div>
)

/** 화면 한 장: 위에 머리줄, 안에 뼈대 */
const Screen = ({ children, head = true, className = '' }: { children?: ReactNode; head?: boolean; className?: string }) => (
  <div className={`pv-screen ${className}`}>
    {head && <div className="pv-head"><Bar w={22} h={6} tone={4} /><span className="pv-sp" /><Bar w={10} h={10} r={5} tone={3} /></div>}
    {children}
  </div>
)

/** 아이콘 선 그림: 스테이지 리셋을 피하려고 인라인으로 */
const SV = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const Dots = ({ dir }: { dir: 'v' | 'h' }) => <span className={`pv-dots pv-dots--${dir}`}><i /><i /><i /></span>

function body(id: string): ReactNode {
  const pic = byId.get(id)?.pic
  if (pic) return scene(pic)
  switch (id) {
    case 'toast': return <Screen><Lines /><div className="pv-toast pv-pop">찜 목록에 저장했어요</div></Screen>
    case 'snackbar': return <Screen><Lines /><div className="pv-toast pv-toast--wide pv-pop">삭제했어요 <b>실행 취소</b></div></Screen>
    case 'banner': return <Screen head={false}><div className="pv-banner pv-drop">오늘 밤 12시 점검이 있어요 <span>✕</span></div><div className="pv-head"><Bar w={22} h={6} tone={4} /></div><Lines /></Screen>
    case 'modal': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>쿠폰을 받을까요?</b><Bar w={70} h={5} tone={3} /><span className="pv-btn">받기</span></div></Screen>
    case 'alert': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-modal--sm pv-pop"><b>정말 지울까요?</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn">지우기</span></div></div></Screen>
    case 'tooltip': return <Screen><Lines n={2} /><div className="pv-anchor"><span className="pv-ico">?</span><span className="pv-tip pv-fade">무료배송 기준 3만 원</span></div></Screen>
    case 'popover': return <Screen><Lines n={2} /><div className="pv-anchor pv-anchor--r"><span className="pv-ico">⋮</span><div className="pv-pop-menu pv-pop"><span>수정</span><span>공유</span><span className="pv-danger">삭제</span></div></div></Screen>
    case 'coachmark': return <Screen className="pv-dim"><Lines n={2} /><span className="pv-spot" /><div className="pv-coach pv-fade"><b>여기서 찾아요</b><small>1 / 3</small></div></Screen>
    case 'badge': return <div className="pv-center"><span className="pv-bigicon">🛒<em className="pv-badge pv-pop">3</em></span><span className="pv-bigicon">🔔<em className="pv-badge pv-badge--dot pv-pop" /></span></div>
    case 'inline-error': return <div className="pv-form"><small>이메일</small><span className="pv-input pv-input--err">hello@</span><span className="pv-err pv-fade">이메일 형식이 맞지 않아요</span></div>
    case 'spinner': return <div className="pv-center"><span className="pv-btn pv-btn--lg"><i className="pv-spin" /> 담는 중</span></div>
    case 'skeleton': return <Screen><div className="pv-sk"><i className="pv-sk-img" /><div><i /><i /><i /></div></div><div className="pv-sk"><i className="pv-sk-img" /><div><i /><i /></div></div></Screen>
    case 'progress': return <div className="pv-form"><small>무료배송까지 <b>3,000원</b></small><span className="pv-progress"><i className="pv-grow" /></span></div>
    case 'pull-refresh': return <Screen><span className="pv-pull"><i className="pv-spin" /></span><Lines /></Screen>
    case 'infinite-scroll': return <Screen><Lines n={4} /><span className="pv-more"><i className="pv-spin" /></span></Screen>
    case 'text-field': return <div className="pv-form"><small>이름</small><span className="pv-input pv-input--focus">김몽글<i className="pv-caret" /></span></div>
    case 'select': return <div className="pv-form"><span className="pv-input">강남점 <span className="pv-chev">⌄</span></span><div className="pv-list pv-drop"><span>강남점</span><span className="on">성수점</span><span>합정점</span></div></div>
    case 'checkbox': return <div className="pv-form pv-gap"><label className="pv-check on"><span>소금빵</span></label><label className="pv-check on"><span>바게트</span></label><label className="pv-check"><span>스콘</span></label></div>
    case 'radio': return <div className="pv-form pv-gap"><label className="pv-radio"><span>매장 픽업</span></label><label className="pv-radio on"><span>택배</span></label><label className="pv-radio"><span>퀵</span></label></div>
    case 'toggle': return <div className="pv-form pv-gap"><div className="pv-setting"><span>알림 받기</span><span className="pv-toggle on" /></div><div className="pv-setting"><Bar w={60} h={5} tone={3} /><span className="pv-toggle" /></div></div>
    case 'segmented': return <div className="pv-center"><span className="pv-seg"><i className="pv-seg-k" /><span className="on">인기</span><span>신상</span><span>가격</span></span></div>
    case 'stepper': return <div className="pv-center"><span className="pv-stepper"><b>−</b><span>2</span><b>+</b></span></div>
    case 'slider': return <div className="pv-form"><small>가격 <b>5천 ~ 2만 원</b></small><span className="pv-slider"><i /><b className="pv-knob" /><b className="pv-knob pv-knob--r" /></span></div>
    case 'chip': return <div className="pv-center pv-wrap"><span className="pv-chip on">비건 ✕</span><span className="pv-chip">통밀</span><span className="pv-chip">무설탕</span></div>
    case 'autocomplete': return <div className="pv-form"><span className="pv-input pv-input--focus">소금<i className="pv-caret" /></span><div className="pv-list pv-drop"><span><b>소금</b>빵</span><span><b>소금</b>빵 세트</span><span><b>소금</b> 버터롤</span></div></div>
    case 'date-picker': return <div className="pv-cal pv-drop"><b>11월</b><div>{Array.from({ length: 21 }, (_, i) => <i key={i} className={i === 11 ? 'on' : ''}>{i + 1}</i>)}</div></div>
    case 'rating': return <div className="pv-center"><span className="pv-stars">★★★★<em>★</em></span></div>
    case 'gnb': return <Screen head={false}><div className="pv-gnb"><Bar w={20} h={7} tone={5} /><span className="on">빵</span><span>케이크</span><span>쿠키</span></div><Lines /></Screen>
    case 'lnb': return <Screen head={false} className="pv-split"><div className="pv-lnb"><span className="on">주문 내역</span><span>쿠폰</span><span>설정</span></div><Lines n={4} /></Screen>
    case 'breadcrumb': return <Screen><div className="pv-crumb">홈 <i>›</i> 빵 <i>›</i> <b>소금빵</b></div><Lines n={2} /></Screen>
    case 'tabs': return <Screen><div className="pv-tabs"><span className="on">상세</span><span>리뷰</span><span>문의</span><i className="pv-tab-k" /></div><Lines n={2} /></Screen>
    case 'drawer': return <Screen className="pv-dim"><Lines /><div className="pv-drawer pv-slide"><b>장바구니</b><Bar w="70%" h={5} tone={3} /><Bar w="50%" h={5} tone={3} /><span className="pv-btn">주문하기</span></div></Screen>
    case 'bottom-sheet': return <div className="pv-phone pv-dim"><Lines /><div className="pv-sheet pv-rise"><i className="pv-grab" /><b>공유하기</b><Bar w="70%" h={5} tone={3} /></div></div>
    case 'hamburger-menu': return <Screen head={false} className="pv-dim"><div className="pv-head"><span className="pv-ham">☰</span></div><div className="pv-drawer pv-drawer--l pv-slide"><span>빵</span><span>케이크</span><span>쿠키</span></div></Screen>
    case 'mega-menu': return <Screen head={false}><div className="pv-gnb"><Bar w={20} h={7} tone={5} /><span className="on">전체 ⌄</span><span>행사</span></div><div className="pv-mega pv-drop">{['빵', '케이크', '쿠키'].map((t) => <div key={t}><b>{t}</b><Bar w="80%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /></div>)}</div></Screen>
    case 'pagination': return <div className="pv-center"><span className="pv-pages"><i>‹</i><i className="on">1</i><i>2</i><i>3</i><i>›</i></span></div>
    case 'tab-bar': return <div className="pv-phone"><Lines n={4} /><div className="pv-tabbar"><i className="on">⌂</i><i>⌕</i><i>♡</i><i>☺</i></div></div>
    case 'sticky-header': return <Screen head={false} className="pv-scroll"><div className="pv-head pv-head--sticky"><Bar w={22} h={6} tone={5} /><span className="pv-sp" /><Bar w={10} h={10} r={5} tone={4} /></div><div className="pv-scroller"><Lines n={8} /></div></Screen>
    case 'fab': return <Screen><Lines n={4} /><span className="pv-fab pv-pop">↑</span></Screen>
    case 'card': return <div className="pv-center"><div className="pv-card pv-lift"><i className="pv-img" /><b>소금빵</b><small>3,500원</small></div><div className="pv-card pv-card--ghost"><i className="pv-img" /><Bar w="60%" h={5} tone={3} /></div></div>
    case 'accordion': return <div className="pv-form pv-acc"><div className="pv-acc-row">배송은 언제 와요? <span>⌃</span></div><div className="pv-acc-body pv-open"><Bar w="80%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /></div><div className="pv-acc-row pv-acc-row--c"><Bar w="50%" h={5} tone={4} /><span>⌄</span></div></div>
    case 'carousel': return <div className="pv-carousel"><div className="pv-slides"><i /><i className="on">겨울 신상 20%</i><i /></div><span className="pv-cdots"><i /><i className="on" /><i /></span></div>
    case 'hero': return <Screen><div className="pv-hero"><b>갓 구운 아침</b><Bar w="60%" h={5} tone={3} /><span className="pv-btn">둘러보기</span></div></Screen>
    case 'table': return <div className="pv-table">{[0, 1, 2, 3].map((r) => <div key={r} className={r === 0 ? 'th' : ''}>{r === 0 ? <><span>주문</span><span>날짜</span><span>금액</span></> : <><Bar w="70%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /><Bar w="50%" h={5} tone={3} /></>}</div>)}</div>
    case 'avatar': return <div className="pv-center"><span className="pv-avatar">몽</span><span className="pv-avatar pv-avatar--2">B</span><span className="pv-avatar pv-avatar--3">+3</span></div>
    case 'empty-state': return <div className="pv-center pv-col"><span className="pv-empty">⌕</span><b className="pv-emptyt">검색 결과가 없어요</b><span className="pv-chip">다른 말로 찾기</span></div>
    case 'swipe': return <div className="pv-form pv-gap"><div className="pv-swipe"><span className="pv-swipe-bg">삭제</span><div className="pv-swipe-row"><Bar w="60%" h={5} tone={4} /></div></div><div className="pv-swipe-row"><Bar w="50%" h={5} tone={3} /></div></div>
    case 'drag-drop': return <div className="pv-form pv-gap"><div className="pv-dd"><Bar w="50%" h={5} tone={3} /></div><div className="pv-dd pv-dd--lift">⠿ 소금빵</div><div className="pv-dd pv-dd--slot" /></div>
    case 'long-press': return <div className="pv-center"><span className="pv-press">꾹</span><div className="pv-pop-menu pv-pop"><span>복사</span><span>답장</span></div></div>
    case 'pinch-zoom': return <div className="pv-center"><span className="pv-pinch"><i className="pv-zoom" /></span></div>
    case 'parallax': return <div className="pv-parallax"><i className="pv-par-bg" /><i className="pv-par-fg" /></div>
    case 'micro-interaction': return <div className="pv-center"><span className="pv-heart">♥</span></div>
    case 'hamburger': return <div className="pv-center"><span className="pv-glyph">☰</span></div>
    case 'kebab': return <div className="pv-center"><Dots dir="v" /></div>
    case 'meatball': return <div className="pv-center"><Dots dir="h" /></div>
    case 'bento': return <div className="pv-center"><span className="pv-bento">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span></div>
    case 'doner': return <div className="pv-center"><span className="pv-doner"><i /><i /><i /></span></div>
    case 'clear-icon': return <div className="pv-form"><span className="pv-input pv-input--focus">소금빵 <span className="pv-clear">✕</span></span></div>
    case 'prompt-box': return <div className="pv-ai"><Lines n={2} /><div className="pv-prompt">소금빵 굽는 법 알려 줘<i className="pv-caret" /><span className="pv-send">↑</span></div></div>
    case 'streaming': return <div className="pv-ai"><div className="pv-bubble">반죽에 버터를 <span className="pv-type">넣고 30분 쉬게 두세요</span></div></div>
    case 'suggestion-chips': return <div className="pv-ai"><div className="pv-center pv-wrap"><span className="pv-chip">오늘 뭐 먹지?</span><span className="pv-chip">빵 추천</span></div><div className="pv-prompt"><Bar w="40%" h={5} tone={3} /><span className="pv-send">↑</span></div></div>
    case 'citation': return <div className="pv-ai"><div className="pv-bubble">소금빵은 일본에서 처음 만들었어요 <sup className="pv-cite">1</sup></div><span className="pv-chip pv-chip--sm">빵의 역사 ↗</span></div>
    case 'confirmshaming': return <Screen className="pv-dim"><div className="pv-modal pv-pop"><b>10% 할인 받기</b><span className="pv-btn">받을래요</span><small className="pv-shame">아니요, 저는 할인이 싫어요</small></div></Screen>
    case 'false-urgency': return <div className="pv-center pv-col"><span className="pv-timer">02:59:<i className="pv-tick">12</i></span><small>마감 임박!</small></div>
    case 'preselection': return <div className="pv-form pv-gap"><label className="pv-check on"><span>(필수) 이용약관</span></label><label className="pv-check on pv-warn"><span>(선택) 광고 문자 받기</span></label></div>
    case 'roach-motel': return <div className="pv-center pv-col"><span className="pv-btn">1초 가입</span><small className="pv-maze">탈퇴 › 설정 › 계정 › 기타 › …</small></div>
    case 'sneak-basket': return <div className="pv-form pv-gap"><div className="pv-setting"><span>소금빵 ×2</span><small>7,000</small></div><div className="pv-setting pv-warn"><span>포장 보험 ✓</span><small>990</small></div></div>
    // ─── 0.3.0 에 더한 카드 ───
    case 'callout': return <Screen><Lines n={2} /><div className="pv-callout pv-fade"><b>ⓘ</b><span>주문은 오후 2시까지 받아요</span></div></Screen>
    case 'push-notification': return <div className="pv-phone pv-lock"><div className="pv-push pv-drop"><i /><div><b>몽글 베이커리</b><span>소금빵이 나왔어요</span></div></div></div>
    case 'success-state': return <div className="pv-center pv-col"><span className="pv-success pv-pop">✓</span><b>주문했어요</b><Bar w={90} h={5} tone={3} /></div>
    case 'dialog-fullscreen': return <div className="pv-phone"><div className="pv-fsd pv-rise"><div><span>✕</span><b>새 주소</b><em>저장</em></div><span className="pv-input" /><span className="pv-input" /></div></div>
    case 'progress-circular': return <div className="pv-center"><span className="pv-ring pv-ring--grow"><b>72%</b></span></div>
    case 'load-more': return <Screen><Lines n={4} /><span className="pv-loadmore">더보기 ⌄</span></Screen>
    case 'lazy-loading': return <div className="pv-center"><div className="pv-card"><i className="pv-img pv-fadein" /><Bar w="70%" h={5} tone={3} /></div><div className="pv-card pv-card--ghost"><i className="pv-img pv-blank" /><Bar w="50%" h={5} tone={3} /></div></div>
    case 'optimistic-ui': return <div className="pv-center pv-col"><span className="pv-heart pv-heart--sm">♥</span><small>서버 대답 전에 이미 빨개요</small></div>
    case 'splash': return <div className="pv-phone pv-splash"><span className="pv-pop">몽글</span></div>
    case 'search-bar': return <div className="pv-form"><span className="pv-input pv-input--pill">⌕ <span className="pv-ph">빵 이름으로 찾기</span></span></div>
    case 'floating-label': return <div className="pv-form"><span className="pv-input pv-input--focus pv-fl"><em className="pv-fl-label">이메일</em>hello@mong.gl</span></div>
    case 'password-toggle': return <div className="pv-form"><span className="pv-input">●●●●●●●● <span className="pv-eye">👁</span></span></div>
    case 'otp-input': return <div className="pv-center pv-otp">{['3', '7', '1', ''].map((d, i) => <i key={i} className={i === 3 ? 'on' : ''}>{d}{i === 3 && <span className="pv-caret" />}</i>)}</div>
    case 'textarea': return <div className="pv-form"><span className="pv-textarea">빵이 정말 부드러워요<i className="pv-caret" /><small>11 / 500</small></span></div>
    case 'file-upload': return <div className="pv-center"><div className="pv-drop-zone"><b>⇪</b><span>여기에 끌어다 놓기</span></div></div>
    case 'tag-input': return <div className="pv-form"><span className="pv-input pv-input--focus pv-tags"><i>버터 ✕</i><i>소금 ✕</i>통밀<span className="pv-caret" /></span></div>
    case 'time-picker': return <div className="pv-center pv-time"><span>09</span><b>:</b><span className="on">30</span><small>오전</small></div>
    case 'color-picker': return <div className="pv-center"><div className="pv-color"><i className="pv-color-sat"><b /></i><i className="pv-color-hue" /></div></div>
    case 'searchable-select': return <div className="pv-form"><span className="pv-input pv-input--focus">강<i className="pv-caret" /><span className="pv-chev">⌄</span></span><div className="pv-list pv-drop"><span className="on"><b>강</b>남점</span><span><b>강</b>릉점</span></div></div>
    case 'top-app-bar': return <div className="pv-phone"><div className="pv-appbar"><span>‹</span><b>장바구니</b><span>⋮</span></div><Lines n={4} /></div>
    case 'navigation-rail': return <Screen head={false} className="pv-split pv-split--rail"><div className="pv-rail"><i className="on">⌂</i><i>⌕</i><i>♡</i></div><Lines n={4} /></Screen>
    case 'steps': return <div className="pv-center pv-steps"><i className="done">✓</i><em className="done" /><i className="on">2</i><em /><i>3</i></div>
    case 'context-menu': return <Screen><Lines n={3} /><div className="pv-ctx pv-pop"><span>복사</span><span>이름 바꾸기</span><span className="pv-danger">삭제</span></div></Screen>
    case 'command-palette': return <div className="pv-center"><div className="pv-cmd pv-pop"><span className="pv-cmd-in">⌕ 소금<i className="pv-caret" /><kbd>⌘K</kbd></span><span className="on">소금빵 열기</span><span><Bar w={70} h={5} tone={3} /></span></div></div>
    case 'scroll-spy': return <Screen head={false} className="pv-split pv-split--spy"><Lines n={6} /><div className="pv-spy"><span>소개</span><span className="on">재료</span><span>굽기</span></div></Screen>
    case 'back-button': return <div className="pv-phone"><div className="pv-appbar"><span className="pv-back">‹ 뒤로</span><span /><span /></div><Lines n={4} /></div>
    case 'list-item': return <div className="pv-form pv-gap">{[0, 1, 2].map((i) => <div key={i} className="pv-li"><i className="pv-li-img" />{i === 0 ? <div><b>소금빵</b><small>3,500원</small></div> : <div><Bar w={60} h={5} tone={4} /><Bar w={40} h={5} tone={3} /></div>}<span>›</span></div>)}</div>
    case 'masonry': return <div className="pv-masonry">{[40, 58, 30, 46, 50, 80].map((h, i) => <i key={i} style={{ height: h }} className={i === 1 ? 'on' : ''} />)}</div>
    case 'lightbox': return <div className="pv-lightbox pv-fade"><span>‹</span><i className="pv-img pv-zoomed" /><span>›</span><b>✕</b></div>
    case 'timeline': return <div className="pv-form pv-tl">{['주문했어요', '', ''].map((t, i) => <div key={i} className={i === 0 ? 'on' : ''}><i />{t ? <b>{t}</b> : <Bar w={70} h={5} tone={3} />}</div>)}</div>
    case 'stat-card': return <div className="pv-center"><div className="pv-stat"><small>오늘 주문</small><b>128</b><em>▲ 12%</em></div></div>
    case 'chart': return <div className="pv-center pv-bars">{[30, 50, 40, 70, 55, 85].map((h, i) => <i key={i} style={{ height: h }} className={i === 5 ? 'on' : ''} />)}</div>
    case 'kanban': return <div className="pv-kanban">{['할 일', '하는 중', '끝'].map((t, i) => <div key={t}><small>{t}</small><i className={i === 1 ? 'on' : ''} /><i />{i === 0 && <i />}</div>)}</div>
    case 'story': return <div className="pv-center pv-stories">{['몽글', '', '', ''].map((t, i) => <span key={i}><i className={i < 2 ? 'on' : ''} />{t ? <small>{t}</small> : <Bar w={22} h={4} tone={3} />}</span>)}</div>
    case 'marquee': return <div className="pv-marquee"><span>갓 구운 소금빵 · 오늘만 무료배송 · 갓 구운 소금빵 · 오늘만 무료배송 ·</span></div>
    case 'divider': return <div className="pv-form pv-gap"><Bar w="80%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /><hr className="pv-divider" /><Bar w="70%" h={5} tone={3} /><Bar w="50%" h={5} tone={3} /></div>
    case 'footer': return <Screen><Lines n={2} /><div className="pv-footer"><b>몽글 베이커리</b><Bar w={60} h={4} tone={2} /><Bar w={90} h={4} tone={2} /></div></Screen>
    case 'sticky-cta': return <div className="pv-phone"><Lines n={5} /><div className="pv-cta pv-rise">3,500원 담기</div></div>
    case 'hover-card': return <Screen><div className="pv-crumb">글쓴이 <b className="pv-link">@몽글</b></div><div className="pv-hovercard pv-pop"><span className="pv-avatar pv-avatar--sm">몽</span><div><b>몽글 베이커리</b><Bar w={60} h={4} tone={3} /></div></div></Screen>
    case 'aurora': return <div className="pv-sty pv-aurora"><b>새벽 빵</b></div>
    case 'y2k': return <div className="pv-sty pv-y2k"><b>BREAD 2000</b><span>✦</span></div>
    case 'swiss': return <div className="pv-sty pv-swiss"><b>빵<br />01</b><i /></div>
    case 'memphis': return <div className="pv-sty pv-memphis"><i className="m1" /><i className="m2" /><i className="m3" /><b>빵!</b></div>
    case 'pixel': return <div className="pv-sty pv-pixel"><b>BREAD</b><i /></div>
    case 'hand-drawn': return <div className="pv-sty pv-hand"><div><b>소금빵</b><span>담기</span></div></div>
    case 'grain': return <div className="pv-sty pv-grain"><b>따뜻한 빵</b></div>
    case 'isometric': return <div className="pv-sty pv-iso"><i /></div>
    case 'double-tap': return <div className="pv-center"><div className="pv-dtap"><i className="pv-img" /><span className="pv-heart pv-heart--burst">♥</span></div></div>
    case 'edge-swipe': return <div className="pv-phone pv-edge"><div className="pv-edge-page"><Lines n={4} /></div><span className="pv-edge-arrow">‹</span></div>
    case 'scroll-snap': return <div className="pv-snap"><i /><i className="on" /><i /></div>
    case 'earcon': return <div className="pv-center pr-snd"><span className="pr-spk">🔔</span><span className="pr-waves"><i /><i /><i /></span></div>
    case 'success-sound': return <div className="pv-center pr-snd"><span className="pr-notes up"><i>♪</i><i>♪</i></span><span className="pr-ok">완료</span></div>
    case 'error-sound': return <div className="pv-center pr-snd"><span className="pr-notes down"><i>♪</i><i>♪</i></span><span className="pr-err">실패</span></div>
    case 'haptic-pattern': return <div className="pv-center pr-hp">{([['톡', 'a'], ['토톡', 'b'], ['길게', 'c']] as const).map(([t, k]) => <span key={k} className={`pr-hp-row ${k}`}><b>{t}</b><span className="pr-hp-bar"><i /><i /><i /></span></span>)}</div>
    case 'sound-toggle': return <div className="pv-center pr-snd"><span className="pr-mute"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 9h4l5-4v14l-5-4H4z" /><path className="w" d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11" /><path className="x" d="M16 9l6 6M22 9l-6 6" /></svg></span></div>
    case 'click-sound': return <div className="pv-center pr-snd"><span className="pr-keys">{[1, 2, 3].map((k) => <b key={k}>{k}</b>)}</span><span className="pr-tick">톡</span></div>
    case 'haptic': return <div className="pv-center"><span className="pv-haptic">꾹</span></div>
    case 'rubber-band': return <Screen><div className="pv-rubber"><Lines n={4} /></div></Screen>
    case 'hover': return <div className="pv-center"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn pv-hovered">담기</span><span className="pv-cursor">↖</span></div>
    case 'drag-to-dismiss': return <div className="pv-phone pv-dim"><Lines /><div className="pv-sheet pv-dismiss"><i className="pv-grab" /><b>옵션</b><Bar w="70%" h={5} tone={3} /></div></div>
    case 'chevron': return <div className="pv-center"><span className="pv-glyph">‹ ›</span></div>
    case 'caret': return <div className="pv-center"><span className="pv-glyph pv-glyph--sm">정렬 ▾</span></div>
    case 'drag-handle': return <div className="pv-center"><span className="pv-glyph">⠿</span></div>
    case 'grabber': return <div className="pv-center"><span className="pv-grabber" /></div>
    case 'share-icon': return <div className="pv-center pv-share"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M12 3v12M8 7l4-4 4 4M6 11v9h12v-9" /></svg><svg viewBox="0 0 24 24" width="40" height="40"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></svg></div>
    case 'gear': return <div className="pv-center"><span className="pv-glyph">⚙</span></div>
    case 'typing-indicator': return <div className="pv-ai"><div className="pv-bubble pv-typing"><i /><i /><i /></div></div>
    case 'thinking': return <div className="pv-ai"><div className="pv-thinking">생각하는 중 <span>⌄</span></div><Lines n={2} /></div>
    case 'regenerate': return <div className="pv-ai"><div className="pv-bubble"><Bar w="90%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /></div><div className="pv-ai-actions"><span className="on">↻ 다시</span><span>⧉</span></div></div>
    case 'feedback-thumbs': return <div className="pv-ai"><div className="pv-bubble"><Bar w="90%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /></div><div className="pv-ai-actions"><span className="on">👍</span><span>👎</span></div></div>
    case 'attachment-chip': return <div className="pv-ai"><span className="pv-chip pv-chip--sm pv-attach">📄 레시피.pdf ✕</span><div className="pv-prompt"><Bar w="40%" h={5} tone={3} /><span className="pv-send">↑</span></div></div>
    case 'voice-input': return <div className="pv-ai"><div className="pv-prompt pv-voice">{[6, 12, 18, 10, 16, 8, 14, 6].map((h, i) => <i key={i} style={{ height: h }} />)}<span className="pv-send">🎙</span></div></div>
    case 'canvas-panel': return <Screen head={false} className="pv-split pv-split--canvas"><div className="pv-ai"><div className="pv-bubble"><Bar w="80%" h={4} tone={3} /></div></div><div className="pv-canvas pv-slide"><b>레시피.md</b><Bar w="90%" h={4} tone={3} /><Bar w="70%" h={4} tone={3} /><Bar w="80%" h={4} tone={3} /></div></Screen>
    case 'nagging': return <Screen className="pv-dim"><div className="pv-modal pv-modal--sm pv-pop"><b>알림을 켤까요? (3번째)</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">나중에</span><span className="pv-btn">켜기</span></div></div></Screen>
    case 'disguised-ads': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg">⬇ 다운로드</span><small className="pv-adtag">광고</small></div>
    case 'trick-question': return <div className="pv-form"><label className="pv-check on pv-warn"><span>소식을 받지 않으려면 체크하지 마세요</span></label></div>
    case 'forced-continuity': return <div className="pv-center pv-col"><b>무료 체험 7일</b><small className="pv-fine">이후 매월 9,900원 자동 결제</small></div>
    case 'hidden-costs': return <div className="pv-form pv-gap"><div className="pv-setting"><span>소금빵</span><small>3,500</small></div><div className="pv-setting pv-warn"><span>서비스 수수료</span><small>+1,900</small></div></div>
    case 'bait-switch': return <Screen className="pv-dim"><div className="pv-modal pv-modal--sm pv-pop"><b>앱 설치하기</b><span className="pv-x-trick">✕ 누르면 설치</span></div></Screen>
    // ─── 0.4.0 에 더한 카드 ───
    case 'notification-center': return <Screen><div className="pv-anchor pv-anchor--r"><span className="pv-ico">🔔</span><div className="pv-pop-menu pv-ncenter pv-pop"><b>알림</b>{['주문이 접수됐어요', '', ''].map((t, i) => <span key={i} className={i === 0 ? 'new' : ''}>{t || <Bar w={70} h={4} tone={3} />}</span>)}</div></div></Screen>
    case 'presence-dot': return <div className="pv-center"><span className="pv-presence"><span className="pv-avatar">몽</span><i /></span><span className="pv-presence"><span className="pv-avatar pv-avatar--2">B</span><i className="off" /></span></div>
    case 'status-pill': return <div className="pv-form pv-gap">{[['배송 중', 'go'], ['', 'done'], ['', 'wait']].map(([t, k], i) => <div key={i} className="pv-setting"><Bar w={50} h={5} tone={3} /><span className={`pv-pill pv-pill--${k}`}>{t || (k === 'done' ? '완료' : '대기')}</span></div>)}</div>
    case 'live-validation': return <div className="pv-form"><span className="pv-input pv-input--focus">●●●●●●<i className="pv-caret" /></span><span className="pv-check-line ok">✓ 8자 이상</span><span className="pv-check-line">✕ 숫자 포함</span></div>
    case 'cookie-banner': return <Screen><Lines /><div className="pv-cookie pv-rise"><span>쿠키를 써도 될까요?</span><span className="pv-btn">허용</span></div></Screen>
    case 'daily-popup': return <Screen className="pv-dim"><div className="pv-modal pv-modal--daily pv-pop"><i className="pv-daily-img" /><div className="pv-daily-foot"><span>오늘 하루 보지 않기</span><b>닫기</b></div></div></Screen>
    case 'error-404': return <div className="pv-center pv-col"><b className="pv-404">404</b><small>페이지를 찾을 수 없어요</small><span className="pv-btn">홈으로</span></div>
    case 'permission-prompt': return <div className="pv-phone pv-dim"><Lines /><div className="pv-modal pv-modal--sm pv-perm pv-pop"><b>위치를 쓸까요?</b><small>가까운 매장을 찾아요</small><span className="pv-btn">허용</span><span className="pv-perm-no">허용 안 함</span></div></div>
    case 'blur-up': return <div className="pv-center"><i className="pv-blurup" /></div>
    case 'loading-dots': return <div className="pv-center"><span className="pv-btn pv-btn--lg pv-ldots"><i /><i /><i /></span></div>
    case 'top-loading-bar': return <Screen head={false}><span className="pv-topbar"><i /></span><div className="pv-head"><Bar w={22} h={6} tone={4} /></div><Lines /></Screen>
    case 'retry-state': return <div className="pv-center pv-col"><span className="pv-empty">!</span><b className="pv-emptyt">불러오지 못했어요</b><span className="pv-btn">↻ 다시 시도</span></div>
    case 'offline-banner': return <div className="pv-phone"><div className="pv-offline pv-drop">인터넷 연결이 끊겼어요</div><Lines n={4} /></div>
    case 'icon-button': return <div className="pv-center pv-iconbtns"><i>♡</i><i className="on">⤴</i><i>✕</i></div>
    case 'button-hierarchy': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg">주문하기</span><span className="pv-btn pv-btn--outline">장바구니</span><span className="pv-btn-text">나중에</span></div>
    case 'split-button': return <div className="pv-center"><span className="pv-split-btn"><b>저장</b><i>▾</i></span></div>
    case 'agree-all': return <div className="pv-form pv-gap"><label className="pv-check on pv-agree"><span><b>전체 동의</b></span></label><hr className="pv-hr" /><label className="pv-check on"><span>(필수) 이용약관</span></label><label className="pv-check"><span>(선택) 혜택 알림</span></label></div>
    case 'social-login': return <div className="pv-form pv-gap"><span className="pv-social pv-social--k">카카오로 시작하기</span><span className="pv-social pv-social--n">네이버로 시작하기</span><span className="pv-social">Google로 시작하기</span></div>
    case 'postcode': return <div className="pv-form pv-gap"><div className="pv-row2"><span className="pv-input">06236</span><span className="pv-btn">우편번호 찾기</span></div><span className="pv-input">서울 강남구 테헤란로</span><span className="pv-input pv-input--focus"><span className="pv-ph">상세 주소</span></span></div>
    case 'signature-pad': return <div className="pv-center"><div className="pv-sign"><svg viewBox="0 0 120 50"><path d="M8 34c10-20 18-24 20-12s-6 18 4 6 14-22 18-10-2 16 8 6 12-12 20-6 10 4 30-4" /></svg><small>다시 쓰기</small></div></div>
    case 'emoji-picker': return <div className="pv-center"><div className="pv-emoji pv-pop">{['😀', '😍', '🥐', '👍', '🎉', '😢', '🍞', '❤️'].map((e) => <i key={e}>{e}</i>)}</div></div>
    case 'mention': return <div className="pv-form"><span className="pv-input pv-input--focus">맛있어요 <b className="pv-link">@몽</b><i className="pv-caret" /></span><div className="pv-list pv-drop"><span className="on"><span className="pv-avatar pv-avatar--xs">몽</span> 몽글 베이커리</span><span><span className="pv-avatar pv-avatar--xs pv-avatar--2">B</span> <Bar w={40} h={4} tone={3} /></span></div></div>
    case 'rich-text-editor': return <div className="pv-form"><div className="pv-rte"><div className="pv-rte-bar"><b>B</b><i>I</i><u>U</u><span>☰</span></div><p>오늘 구운 <b>소금빵</b><i className="pv-caret" /></p></div></div>
    case 'captcha': return <div className="pv-center"><div className="pv-captcha"><i className="on">✓</i><span>로봇이 아닙니다</span></div></div>
    case 'scrollable-tabs': return <Screen><div className="pv-tabs pv-tabs--scroll"><span className="on">전체</span><span>빵</span><span>케이크</span><span>쿠키</span><span>음료</span><i className="pv-tab-k" /></div><Lines n={2} /></Screen>
    case 'table-of-contents': return <div className="pv-form pv-toc"><small>목차</small><span>1. 재료</span><span className="on">2. 반죽하기</span><span>3. 굽기</span></div>
    case 'skip-link': return <Screen><span className="pv-skip pv-drop">본문 바로가기</span><Lines /></Screen>
    case 'quick-menu': return <Screen><Lines n={4} /><div className="pv-quick"><small>최근 본</small><i /><i /><b>TOP</b></div></Screen>
    case 'master-detail': return <Screen head={false} className="pv-split pv-split--md"><div className="pv-md-list"><span className="on">소금빵</span><span><Bar w={40} h={4} tone={3} /></span><span><Bar w={50} h={4} tone={3} /></span></div><div className="pv-md-detail"><b>소금빵</b><Lines n={3} /></div></Screen>
    case 'tree-view': return <div className="pv-form pv-tree"><span>▾ 빵</span><span className="in on">▸ 소금빵</span><span className="in">▸ 식빵</span><span>▸ 케이크</span></div>
    case 'dock': return <div className="pv-dock-wrap"><div className="pv-dock">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={i === 2 ? 'on' : ''} />)}</div></div>
    case 'sitemap': return <div className="pv-sitemap">{['빵', '케이크', '고객센터'].map((t) => <div key={t}><b>{t}</b><Bar w="80%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /><Bar w="70%" h={4} tone={3} /></div>)}</div>
    case 'ribbon': return <div className="pv-center"><div className="pv-card pv-ribbon-card"><i className="pv-img" /><span className="pv-ribbon">BEST</span><Bar w="70%" h={5} tone={3} /></div></div>
    case 'sale-price': return <div className="pv-center pv-col pv-sale"><span><b className="pv-off">20%</b> <b>2,800원</b></span><s>3,500원</s></div>
    case 'thumbnail-gallery': return <div className="pv-center pv-col"><i className="pv-thumb-big" /><div className="pv-thumbs"><i className="on" /><i /><i /><i /></div></div>
    case 'pricing-table': return <div className="pv-pricing">{['기본', '추천', '프로'].map((t, i) => <div key={t} className={i === 1 ? 'on' : ''}><small>{t}</small>{i === 1 ? <b>9,900원</b> : <Bar w="70%" h={6} tone={4} />}<Bar w="80%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /></div>)}</div>
    case 'testimonial': return <div className="pv-center"><div className="pv-quote-card"><b className="pv-qmark">“</b><span>아침마다 생각나는 맛</span><div><span className="pv-avatar pv-avatar--xs">김</span><Bar w={40} h={4} tone={3} /></div></div></div>
    case 'blockquote': return <div className="pv-form pv-gap"><Bar w="80%" h={5} tone={3} /><blockquote className="pv-bq">빵은 기다림이 반이다</blockquote><Bar w="70%" h={5} tone={3} /></div>
    case 'code-block': return <div className="pv-center"><div className="pv-code"><span className="pv-code-copy">⧉</span><p><i className="k">const</i> bread = <i className="s">'소금빵'</i></p><p><i className="k">bake</i>(bread)</p></div></div>
    case 'map-pin': return <div className="pv-map"><i className="pv-road1" /><i className="pv-road2" /><span className="pv-pin pv-drop" /><span className="pv-pin-tip">몽글 성수점</span></div>
    case 'calendar-view': return <div className="pv-month">{Array.from({ length: 21 }, (_, i) => <i key={i}>{i + 1}{i === 9 && <em>빵 클래스</em>}{(i === 3 || i === 15) && <em className="g" />}</i>)}</div>
    case 'before-after': return <div className="pv-center"><div className="pv-ba"><i className="b" /><i className="a" /><span className="pv-ba-handle">⇆</span></div></div>
    case 'truncation': return <div className="pv-form pv-gap"><div className="pv-li"><i className="pv-li-img" /><div><b className="pv-ellipsis">겨울 한정 밤 식빵 버터 듬뿍 우유 크림 …</b><small>더보기</small></div></div></div>
    case 'liquid-glass': return <div className="pv-sty pv-lglass"><div><b>소금빵</b><span>담기</span></div></div>
    case 'cyberpunk': return <div className="pv-sty pv-cyber"><b>NEON BREAD</b></div>
    case 'monochrome': return <div className="pv-sty pv-mono"><div><i /><b>소금빵</b><span>담기</span></div></div>
    case 'duotone': return <div className="pv-sty pv-duo"><i /><b>BAKE</b></div>
    case 'bauhaus': return <div className="pv-sty pv-bauhaus"><i className="c" /><i className="s" /><i className="t" /></div>
    case 'corporate-memphis': return <div className="pv-sty pv-corp"><svg viewBox="0 0 120 90"><circle cx="60" cy="18" r="9" fill="#2d2a5a" /><path d="M48 30h24l10 34H38z" fill="#6c63ff" /><path d="M46 34 18 52M74 34l30 10" stroke="#f4a3a8" strokeWidth="7" strokeLinecap="round" /><path d="M50 64 42 88M70 64l12 24" stroke="#2d2a5a" strokeWidth="8" strokeLinecap="round" /></svg></div>
    case 'editorial': return <div className="pv-sty pv-editorial"><div><small>ISSUE 04</small><b>빵의 시간</b><Bar w={90} h={4} tone={3} /><Bar w={70} h={4} tone={3} /></div></div>
    case 'blob': return <div className="pv-sty pv-blob"><i className="b1" /><i className="b2" /><b>말랑</b></div>
    case 'swipe-cards': return <div className="pv-center pv-swipecards"><i className="back" /><i className="front"><span>좋아요</span></i></div>
    case 'shake-undo': return <div className="pv-phone pv-shake"><div className="pv-modal pv-modal--sm"><b>실행 취소할까요?</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn">되돌리기</span></div></div></div>
    case 'scroll-reveal': return <Screen><Lines n={2} /><div className="pv-reveal"><i /><i /><i /></div></Screen>
    case 'shared-element': return <div className="pv-center pv-shared"><i className="small" /><span>→</span><div className="big"><i /><Bar w="70%" h={5} tone={3} /></div></div>
    case 'easing': return <div className="pv-center"><svg className="pv-curve" viewBox="0 0 100 70"><path className="axis" d="M8 62H94M8 62V6" /><path className="line" d="M8 62C30 62 34 8 94 8" /><circle className="dot" r="4" cx="94" cy="8" /></svg></div>
    case 'spring': return <div className="pv-center"><span className="pv-springball" /></div>
    case 'info-icon': return <div className="pv-center"><span className="pv-glyph">ⓘ</span></div>
    case 'external-link': return <div className="pv-center"><span className="pv-glyph pv-glyph--sm">몽글 블로그 ↗</span></div>
    case 'hamburger-morph': return <div className="pv-center pv-morph"><span className="pv-ham3"><i /><i /><i /></span></div>
    case 'bookmark-icon': return <div className="pv-center"><svg viewBox="0 0 24 24" width="44" height="44" className="pv-bookmark"><path d="M6 3h12v18l-6-4-6 4z" /></svg></div>
    case 'refresh-icon': return <div className="pv-center"><span className="pv-glyph pv-spin-slow">↻</span></div>
    case 'model-picker': return <div className="pv-ai"><span className="pv-model pv-drop">빠른 모델 ▾</span><div className="pv-prompt"><Bar w="40%" h={5} tone={3} /><span className="pv-send">↑</span></div></div>
    case 'stop-button': return <div className="pv-ai"><div className="pv-bubble">반죽은 버터를 <span className="pv-type">넣고</span><i className="pv-caret" /></div><div className="pv-prompt"><Bar w="40%" h={5} tone={2} /><span className="pv-send pv-stop">■</span></div></div>
    case 'copy-button': return <div className="pv-center"><div className="pv-code"><span className="pv-code-copy pv-copied">✓ 복사됨</span><p><i className="k">bake</i>(<i className="s">'소금빵'</i>)</p></div></div>
    case 'chat-history': return <Screen head={false} className="pv-split pv-split--hist"><div className="pv-hist"><span className="pv-hist-new">+ 새 대화</span><span className="on">소금빵 레시피</span><span><Bar w={50} h={4} tone={3} /></span><span><Bar w={40} h={4} tone={3} /></span></div><div className="pv-ai"><div className="pv-bubble"><Bar w="80%" h={4} tone={3} /></div></div></Screen>
    case 'tool-call': return <div className="pv-ai"><div className="pv-toolcall">⌕ 웹에서 찾는 중<span className="pv-ldots-sm"><i /><i /><i /></span></div><Lines n={2} /></div>
    case 'smart-reply': return <div className="pv-ai"><div className="pv-bubble">내일 빵 찾으러 갈게요</div><div className="pv-center pv-wrap"><span className="pv-chip">좋아요!</span><span className="pv-chip">몇 시쯤요?</span></div></div>
    case 'fake-social-proof': return <div className="pv-center pv-col"><span className="pv-fomo">👀 지금 23명이 보고 있어요</span><Bar w={100} h={5} tone={3} /></div>
    case 'fake-scarcity': return <div className="pv-center pv-col"><b>소금빵</b><span className="pv-fomo">🔥 2개 남았어요</span></div>
    case 'friend-spam': return <div className="pv-phone"><div className="pv-modal pv-modal--sm"><b>연락처를 불러올까요?</b><small className="pv-fine">친구 312명에게 초대를 보내요</small><span className="pv-btn">확인</span></div></div>
    case 'misdirection': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg">구독 유지하기</span><small className="pv-maze">해지</small></div>
    case 'autoplay-next': return <div className="pv-center"><div className="pv-video"><span className="pv-next">다음 화 <b>5</b></span><i className="pv-next-bar" /></div></div>
    // ─── UI 부품 더하기 (0.5.0 개편) ───
    case 'popconfirm': return <Screen><Lines n={2} /><div className="pv-anchor pv-anchor--r"><span className="pv-ico">🗑</span><div className="pv-popconfirm pv-pop"><b>지울까요?</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn">지우기</span></div></div></div></Screen>
    case 'loading-overlay': return <Screen><Lines n={4} /><div className="pv-overlay"><i className="pv-spin" /><small>불러오는 중</small></div></Screen>
    case 'progress-toast': return <Screen><Lines /><div className="pv-toast pv-ptoast pv-pop"><span>사진 올리는 중 72%</span><i><b /></i></div></Screen>
    case 'rich-tooltip': return <Screen><Lines n={1} /><div className="pv-anchor pv-anchor--low"><span className="pv-ico">?</span><div className="pv-richtip pv-fade"><b>무료배송</b><small>3만 원 넘게 사면 배송비가 없어요</small><em>자세히</em></div></div></Screen>
    case 'number-input': return <div className="pv-form"><small>인원</small><span className="pv-input pv-input--focus pv-numin">2<span className="pv-numarrows"><i>▲</i><i>▼</i></span></span></div>
    case 'range-slider': return <div className="pv-form"><span className="pv-slider pv-range-s"><i /><b className="pv-knob"><em>5천</em></b><b className="pv-knob pv-knob--r"><em>2만</em></b></span></div>
    case 'masked-input': return <div className="pv-form"><small>휴대폰 번호</small><span className="pv-input pv-input--focus">010-1234-5<i className="pv-caret" /></span><small className="pv-okhint">하이픈은 저절로 들어가요</small></div>
    case 'currency-input': return <div className="pv-form"><span className="pv-input pv-input--focus pv-money"><b>12,000</b>원</span><small>만 이천 원</small></div>
    case 'cascader': return <div className="pv-cascade">{[['서울', '부산'], ['강남구', '성동구'], ['역삼동', '삼성동']].map((col, c) => <div key={c}>{col.map((v, i) => <span key={v} className={i === 0 ? 'on' : ''}>{v}{c < 2 && i === 0 && ' ›'}</span>)}</div>)}</div>
    case 'transfer-list': return <div className="pv-center pv-transfer"><div><span className="on">소금빵</span><span><Bar w={30} h={4} tone={3} /></span><span><Bar w={36} h={4} tone={3} /></span></div><div className="pv-transfer-btns"><i>›</i><i>‹</i></div><div><span><Bar w={34} h={4} tone={3} /></span></div></div>
    case 'inline-edit': return <div className="pv-form pv-gap"><div className="pv-setting"><small>가게 이름</small><span className="pv-input pv-input--focus pv-inlined">몽글 베이커리<i className="pv-caret" /></span></div><div className="pv-row2 pv-inline-actions"><span>✓</span><span>✕</span></div></div>
    case 'image-cropper': return <div className="pv-center"><div className="pv-crop"><i className="pv-crop-frame"><b /><b /><b /><b /></i></div></div>
    case 'speed-dial': return <Screen><Lines n={4} /><div className="pv-dial">{['사진', '투표'].map((t) => <span key={t} className="pv-pop"><small>{t}</small><i /></span>)}<span className="pv-fab pv-dial-main">✕</span></div></Screen>
    case 'bottom-app-bar': return <div className="pv-phone"><Lines n={4} /><div className="pv-bab"><i>☰</i><i>⌕</i><i>⋯</i><span className="pv-fab">+</span></div></div>
    case 'dropdown-menu': return <div className="pv-form"><span className="pv-sortbtn">편집 ▾</span><div className="pv-list pv-drop pv-ddmenu"><span>복사 <kbd>⌘C</kbd></span><span>붙여넣기 <kbd>⌘V</kbd></span><hr /><span className="pv-danger">삭제</span></div></div>
    case 'floating-toolbar': return <div className="pv-form"><div className="pv-ftool pv-pop"><b>B</b><i>I</i><span>🔗</span></div><p className="pv-ftext">버터 향이 <mark>정말 좋아요</mark> 다음에도</p></div>
    case 'tabs-vertical': return <Screen head={false} className="pv-split"><div className="pv-vtabs"><span className="on">계정</span><span>알림</span><span>결제</span></div><Lines n={4} /></Screen>
    case 'avatar-group': return <div className="pv-center pv-col"><span className="pv-facepile">{['몽', 'B', '반', '크'].map((t, i) => <i key={t} style={{ zIndex: 5 - i }}>{t}</i>)}<i className="more">+5</i></span><small>지금 9명이 보는 중</small></div>
    case 'description-list': return <div className="pv-form pv-dl">{[['주문번호', '2026-1117'], ['날짜', '11월 17일'], ['상태', '배송 중']].map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}</div>
    case 'sortable-table': return <div className="pv-table pv-sorttable"><div className="th"><span className="on">가격 ▲</span><span>이름</span><span>별점</span></div>{[0, 1, 2].map((r) => <div key={r}><Bar w="50%" h={5} tone={3} /><Bar w="70%" h={5} tone={3} /><Bar w="40%" h={5} tone={3} /></div>)}</div>
    case 'kbd': return <div className="pv-center pv-keys"><kbd>⌘</kbd><span>+</span><kbd>K</kbd></div>
    case 'video-player': return <div className="pv-center"><div className="pv-player"><span className="pv-play">▶</span><div className="pv-player-bar"><i><b /></i><small>1:24 / 3:10</small></div></div></div>
    case 'chat-bubble': return <div className="pv-form pv-chat"><span className="them">빵 몇 시에 나와요?</span><span className="me">아침 9시요!</span><span className="them"><Bar w={50} h={5} tone={3} /></span></div>
    case 'comment-thread': return <div className="pv-form pv-thread"><div><span className="pv-avatar pv-avatar--xs">몽</span><b>맛있어 보여요</b></div><div className="reply"><span className="pv-avatar pv-avatar--xs pv-avatar--2">B</span><Bar w={70} h={5} tone={3} /></div><div className="reply"><span className="pv-avatar pv-avatar--xs">몽</span><Bar w={50} h={5} tone={3} /></div></div>
    case 'countdown': return <div className="pv-center pv-col"><div className="pv-countdown">{[['02', '시'], ['14', '분'], ['37', '초']].map(([n, u]) => <span key={u}><b>{n}</b><small>{u}</small></span>)}</div><small>사전 예약 마감까지</small></div>
    case 'funnel': return <div className="pv-center"><svg viewBox="0 0 24 24" width="46" height="46" className="pv-line-icon"><path d="M3 5h18l-7 8v6l-4 2v-8z" /></svg></div>
    case 'adjust-icon': return <div className="pv-center"><svg viewBox="0 0 24 24" width="46" height="46" className="pv-line-icon"><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2.2" /><circle cx="15" cy="12" r="2.2" /><circle cx="10" cy="18" r="2.2" /></svg></div>
    case 'peek-preview': return <div className="pv-center pv-peek"><Screen><Lines n={4} /></Screen><div className="pv-peekcard pv-pop"><i /><b>소금빵</b><Bar w={70} h={4} tone={3} /></div></div>
    case 'drag-select': return <div className="pv-dragsel">{Array.from({ length: 8 }, (_, i) => <i key={i} className={[1, 2, 5, 6].includes(i) ? 'on' : ''} />)}<span className="pv-lasso" /></div>
    case 'ai-summary': return <div className="pv-ai"><div className="pv-summary"><b>📄 요약</b><span>· 버터 향이 좋아요</span><span>· 아침에 빨리 품절돼요</span><Bar w="60%" h={4} tone={3} /></div></div>
    case 'voice-orb': return <div className="pv-center pv-col"><span className="pv-orb" /><small>듣고 있어요</small></div>
    case 'agent-steps': return <div className="pv-form pv-agent"><span className="done">✓ 빵집 검색</span><span className="done">✓ 리뷰 정리</span><span className="now"><i className="pv-spin" /> 추천 쓰는 중</span></div>
    // ─── 0.5.0 주제별 카드 ───
    // 가격의 심리
    case 'anchoring': return <div className="pv-form pv-gap"><div className="pv-setting pv-dimrow"><span>프리미엄 세트</span><b>39,000원</b></div><div className="pv-setting pv-onrow"><span>소금빵 세트</span><b>9,900원</b></div><div className="pv-setting pv-dimrow"><Bar w={50} h={5} tone={3} /><Bar w={40} h={5} tone={3} /></div></div>
    case 'decoy': return <div className="pv-center pv-cups">{[['S', '3,000'], ['M', '4,800'], ['L', '5,000']].map(([k, p], i) => <div key={k} className={i === 2 ? 'on' : i === 1 ? 'decoy' : ''}><i style={{ height: 20 + i * 12 }} /><b>{k}</b><small>{p}</small>{i === 2 && <em>인기</em>}</div>)}</div>
    case 'charm-pricing': return <div className="pv-center pv-col pv-charm"><s>10,000원</s><b>9,900원</b></div>
    case 'free-shipping-bar': return <div className="pv-form"><small><b>3,000원</b> 더 담으면 무료배송</small><span className="pv-progress"><i style={{ width: '82%' }} /></span></div>
    case 'bundle': return <div className="pv-center pv-bundle"><i /><span>+</span><i /><span>=</span><div><s>12,000원</s><b>세트 9,900원</b></div></div>
    case 'unit-price': return <div className="pv-center pv-col pv-unit"><b>19,800원</b><small>12개 · 개당 1,650원</small></div>
    case 'annual-toggle': return <div className="pv-center pv-col"><span className="pv-seg pv-seg--wide"><i className="pv-seg-k pv-seg-k--r" /><span>월간</span><span className="on">연간</span></span><small className="pv-save">2개월 무료</small></div>
    case 'free-trial': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg">7일 무료로 써 보기</span><small>이후 월 4,900원 · 언제든 해지</small></div>
    // 리서치 방법
    case 'user-interview': return <div className="pv-center pv-interview"><span className="pv-avatar">몽</span><div className="pv-bubble pv-pop">왜 그렇게 고르셨어요?</div><span className="pv-avatar pv-avatar--2">B</span></div>
    case 'usability-test': return <Screen><div className="pv-task pv-drop"><b>과제</b> 소금빵을 장바구니에 담아 보세요</div><Lines n={2} /><span className="pv-stuck">⏱ 0:42</span></Screen>
    case 'ab-test': return <div className="pv-center pv-ab">{['A', 'B'].map((k, i) => <div key={k} className={i ? 'win' : ''}><small>{k}안</small><i className={i ? 'b' : 'a'} /><b>{i ? '18%' : '12%'}</b></div>)}</div>
    case 'survey': return <div className="pv-form pv-gap"><b>만족하셨나요?</b><div className="pv-scale">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n === 4 ? 'on' : ''}>{n}</i>)}</div><Bar w="70%" h={5} tone={3} /></div>
    case 'card-sorting': return <div className="pv-center pv-sort"><div><small>빵</small><i>소금빵</i><i /></div><div><small>음료</small><i /><i /></div><i className="pv-sort-fly">식빵</i></div>
    case 'persona': return <div className="pv-center"><div className="pv-persona"><span className="pv-avatar">김</span><div><b>김몽글, 28세</b><small>목표: 출근 전 빵 사기</small><Bar w={70} h={4} tone={3} /></div></div></div>
    case 'journey-map': return <div className="pv-center"><svg className="pv-journey" viewBox="0 0 160 80"><path className="grid" d="M5 40H155" /><path className="line" d="M10 40 C30 20 40 20 50 30 S70 70 90 62 S120 15 150 18" />{[10, 50, 90, 150].map((x, i) => <circle key={x} cx={x} cy={[40, 30, 62, 18][i]} r="4" />)}<text x="80" y="76">결제에서 짜증</text></svg></div>
    case 'heatmap-research': return <Screen><Lines /><span className="pv-heat pv-heat--1" /><span className="pv-heat pv-heat--2" /><span className="pv-heat pv-heat--3" /></Screen>
    case 'five-second-test': return <div className="pv-center pv-five"><Screen><Lines n={2} /></Screen><b>5</b></div>
    // 빈 화면
    case 'first-use-empty': return <div className="pv-center pv-col"><span className="pv-empty">✎</span><b className="pv-emptyt">첫 글을 써 볼까요?</b><span className="pv-btn">글쓰기</span></div>
    case 'no-results': return <div className="pv-center pv-col"><span className="pv-empty">⌕</span><b className="pv-emptyt">‘소굼빵’ 결과가 없어요</b><span className="pv-chip">소금빵 으로 찾기</span></div>
    case 'all-done-empty': return <div className="pv-center pv-col"><span className="pv-success pv-pop">✓</span><b className="pv-emptyt">모두 읽었어요</b><small>새 알림이 오면 알려 드릴게요</small></div>
    case 'no-access': return <div className="pv-center pv-col"><span className="pv-empty">🔒</span><b className="pv-emptyt">볼 수 있는 권한이 없어요</b><span className="pv-btn pv-btn--outline">권한 요청하기</span></div>
    // 인디케이터
    case 'page-dots': return <div className="pv-center pv-col"><i className="pv-thumb-big" /><span className="pv-cdots"><i /><i className="on" /><i /><i /></span></div>
    case 'reading-progress': return <Screen head={false}><span className="pv-topbar pv-topbar--read"><i /></span><div className="pv-head"><Bar w={22} h={6} tone={4} /></div><Lines n={4} /></Screen>
    case 'unread-dot': return <div className="pv-form pv-gap">{[0, 1, 2].map((i) => <div key={i} className="pv-li pv-li--dot">{i === 0 && <em className="pv-udot" />}<i className="pv-li-img" />{i === 0 ? <div><b>주문이 접수됐어요</b><small>방금</small></div> : <div><Bar w={60} h={5} tone={3} /><Bar w={40} h={4} tone={2} /></div>}</div>)}</div>
    case 'carousel-arrows': return <div className="pv-center pv-arrows"><span>‹</span><i className="pv-thumb-big" /><span>›</span></div>
    // 별점
    case 'half-star': return <div className="pv-center pv-col"><span className="pv-stars">★★★★<em className="half">★</em></span><b>4.5</b></div>
    case 'rating-breakdown': return <div className="pv-form pv-breakdown">{[72, 18, 6, 2, 2].map((v, i) => <div key={i}><small>{5 - i}</small><span><i style={{ width: `${v}%` }} /></span></div>)}</div>
    case 'emoji-rating': return <div className="pv-center pv-col"><b>오늘 빵 어땠나요?</b><div className="pv-emojis">{['😡', '😐', '😊', '😍'].map((e, i) => <i key={e} className={i === 3 ? 'on' : ''}>{e}</i>)}</div></div>
    case 'nps': return <div className="pv-center pv-col"><small>친구에게 추천할 만한가요?</small><div className="pv-nps">{Array.from({ length: 11 }, (_, i) => <i key={i} className={i === 9 ? 'on' : ''}>{i}</i>)}</div></div>
    // 완료 표시
    case 'check-animation': return <div className="pv-center"><svg className="pv-checkdraw" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" /><path d="M15 27l7 7 15-16" /></svg></div>
    case 'confetti': return <div className="pv-center pv-confetti">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 5) * 0.08}s`, background: ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', 'var(--ss-accent)'][i % 5] }} />)}<b>첫 주문 축하해요!</b></div>
    case 'checklist-progress': return <div className="pv-form pv-gap pv-checklist"><small>2 / 3 완료</small><label className="pv-check on"><span>프로필 사진</span></label><label className="pv-check on"><span>관심사 고르기</span></label><label className="pv-check"><span>첫 주문</span></label></div>
    case 'autosave': return <Screen><span className="pv-saved pv-fade">저장됨 ✓</span><Lines n={4} /></Screen>
    case 'receipt': return <div className="pv-center"><div className="pv-receipt"><b>몽글 베이커리</b><div><Bar w={50} h={4} tone={3} /><Bar w={24} h={4} tone={3} /></div><div><Bar w={40} h={4} tone={3} /><Bar w={24} h={4} tone={3} /></div><div className="sum"><span>합계</span><b>7,000원</b></div></div></div>
    // 공유
    case 'share-sheet': return <div className="pv-phone pv-dim"><Lines /><div className="pv-sheet pv-rise"><i className="pv-grab" /><b>공유하기</b><div className="pv-apps">{['#fee500', '#03c75a', '#111'].map((c) => <i key={c} style={{ background: c }} />)}</div></div></div>
    case 'copy-link': return <div className="pv-form"><div className="pv-row2 pv-copylink"><span className="pv-input">mong.gl/bread</span><span className="pv-btn">복사</span></div><span className="pv-toast pv-toast--inline pv-pop">링크를 복사했어요</span></div>
    case 'qr-share': return <div className="pv-center"><div className="pv-qr">{Array.from({ length: 81 }, (_, i) => <i key={i} className={(i * 7 + (i >> 2)) % 3 === 0 || [0, 1, 2, 9, 11, 18, 19, 20, 6, 7, 8, 15, 17, 24, 25, 26, 54, 55, 56, 63, 65, 72, 73, 74].includes(i) ? 'on' : ''} />)}</div></div>
    case 'social-share': return <div className="pv-center pv-socials"><i className="k">톡</i><i className="x">X</i><i className="f">f</i><i className="l">🔗</i></div>
    // 화면 전환
    case 'fade-transition': return <div className="pv-center pv-trans"><div className="pv-tscreen a"><Lines n={3} /></div><div className="pv-tscreen b pv-xfade"><b>다음 화면</b><Lines n={2} /></div></div>
    case 'slide-push': return <div className="pv-center pv-trans"><div className="pv-tscreen a pv-pushout"><Lines n={3} /></div><div className="pv-tscreen b pv-pushin"><b>상세</b><Lines n={2} /></div></div>
    case 'cover-up': return <div className="pv-phone"><Lines n={4} /><div className="pv-cover pv-rise"><span>✕</span><b>글쓰기</b><Lines n={2} /></div></div>
    case 'zoom-transition': return <div className="pv-center pv-trans"><i className="pv-zoomsrc" /><div className="pv-tscreen b pv-zoomin"><b>소금빵</b><Lines n={2} /></div></div>
    case 'flip-transition': return <div className="pv-center pv-flipwrap"><div className="pv-flipcard"><div className="front"><b>BREAD</b></div><div className="back"><b>빵</b></div></div></div>
    // 텍스트 등장
    case 'typewriter': return <div className="pv-center"><b className="pv-tw"><span className="pv-type">갓 구운 아침을</span><i className="pv-caret" /></b></div>
    case 'stagger-text': return <div className="pv-center pv-stagger">{['오늘도', '빵', '굽는', '중'].map((w, i) => <b key={w} style={{ animationDelay: `${i * 0.12}s` }}>{w}</b>)}</div>
    case 'count-up': return <div className="pv-center pv-col pv-countup"><b>12,345</b><small>오늘 구운 빵</small></div>
    case 'blur-in-text': return <div className="pv-center"><b className="pv-blurtext">천천히, 따뜻하게</b></div>
    case 'word-rotate': return <div className="pv-center pv-rotate"><span className="pv-rot-box"><i>빵을</i><i className="on">케이크를</i></span><b>굽다</b></div>
    case 'scramble-text': return <div className="pv-center"><b className="pv-scramble">소<span>%</span>빵<span>#@</span></b></div>
    // 버튼 상태
    case 'btn-pressed': return <div className="pv-center pv-states"><div><span className="pv-btn pv-btn--lg">담기</span><small>기본</small></div><div><span className="pv-btn pv-btn--lg pv-pressed">담기</span><small>눌림</small></div></div>
    case 'focus-ring': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg pv-focused">담기</span><kbd className="pv-kbd">Tab</kbd></div>
    case 'disabled': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg pv-disabled">다음</span><small>필수 항목을 채워 주세요</small></div>
    case 'loading-button': return <div className="pv-center"><span className="pv-btn pv-btn--lg"><i className="pv-spin" /> 결제하는 중</span></div>
    case 'selected-state': return <div className="pv-center pv-wrap"><span className="pv-chip on">✓ 비건</span><span className="pv-chip">통밀</span><span className="pv-chip on">✓ 무설탕</span></div>
    // 앱 첫 화면
    case 'walkthrough': return <div className="pv-phone pv-onb"><i className="pv-onb-art" /><b>빵을 담아 보세요</b><Bar w="60%" h={4} tone={3} /><span className="pv-cdots"><i /><i className="on" /><i /></span><span className="pv-btn">다음</span></div>
    case 'interest-picker': return <div className="pv-form pv-gap"><b>좋아하는 걸 골라요</b><div className="pv-wrap pv-center">{['빵', '케이크', '쿠키', '음료', '샐러드'].map((t, i) => <span key={t} className={`pv-chip${i < 3 ? ' on' : ''}`}>{t}</span>)}</div><span className="pv-btn">3개 골랐어요</span></div>
    case 'skip-button': return <div className="pv-phone pv-onb"><span className="pv-skipbtn">건너뛰기</span><i className="pv-onb-art" /><Bar w="60%" h={5} tone={4} /><span className="pv-cdots"><i className="on" /><i /><i /></span></div>
    case 'signup-wall': return <div className="pv-phone pv-onb"><span className="pv-logo-dot">몽글</span><span className="pv-btn pv-btn--wide">3초 만에 시작하기</span><small>먼저 둘러보기</small></div>
    // 날짜 고르기
    case 'date-range': return <div className="pv-cal pv-range"><b>11월</b><div>{Array.from({ length: 21 }, (_, i) => <i key={i} className={i === 7 ? 'start' : i === 11 ? 'end' : i > 7 && i < 11 ? 'mid' : ''}>{i + 1}</i>)}</div></div>
    case 'wheel-picker': return <div className="pv-center"><div className="pv-wheel">{[['2007', '2008', '2009'], ['4월', '5월', '6월'], ['11', '12', '13']].map((col, c) => <div key={c}>{col.map((v, i) => <span key={v} className={i === 1 ? 'on' : ''}>{v}</span>)}</div>)}<i className="band" /></div></div>
    case 'quick-dates': return <div className="pv-form pv-gap"><div className="pv-wrap pv-center">{['오늘', '7일', '1개월', '3개월'].map((t, i) => <span key={t} className={`pv-chip${i === 2 ? ' on' : ''}`}>{t}</span>)}</div><small className="pv-center">2026.10.17 ~ 2026.11.17</small></div>
    case 'birthday-input': return <div className="pv-form"><small>생년월일</small><div className="pv-row2 pv-bday"><span className="pv-input">2008</span><span className="pv-input">05</span><span className="pv-input pv-input--focus">12<i className="pv-caret" /></span></div></div>
    case 'relative-time': return <div className="pv-form pv-gap">{['방금', '3분 전', '어제'].map((t, i) => <div key={t} className="pv-li"><i className="pv-li-img" /><div><Bar w={60 - i * 8} h={5} tone={3} /></div><small className={i === 0 ? 'pv-now' : ''}>{t}</small></div>)}</div>
    // 목록 보여 주기
    case 'grid-view': return <div className="pv-gridview">{Array.from({ length: 6 }, (_, i) => <i key={i} className={i === 0 ? 'on' : ''} />)}</div>
    case 'view-toggle': return <div className="pv-form pv-gap"><span className="pv-seg pv-viewtog"><span>☰</span><span className="on">▦</span></span><div className="pv-gridview pv-gridview--sm">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div></div>
    case 'grouped-list': return <div className="pv-form pv-grouped"><small>오늘</small><div className="pv-li"><i className="pv-li-img" /><div><b>소금빵 2개</b></div><span>-7,000</span></div><small>어제</small><div className="pv-li"><i className="pv-li-img" /><div><Bar w={50} h={5} tone={3} /></div><span /></div></div>
    case 'feed': return <div className="pv-form pv-gap pv-feed">{[0, 1].map((i) => <div key={i} className="pv-post"><div><span className="pv-avatar pv-avatar--xs">{i ? 'B' : '몽'}</span>{i ? <Bar w={40} h={4} tone={3} /> : <b>몽글</b>}</div><i className={i ? '' : 'on'} /></div>)}</div>
    // 그래프
    case 'bar-chart': return <div className="pv-center pv-bars">{[30, 50, 40, 70, 55, 85].map((h, i) => <i key={i} style={{ height: h }} className={i === 5 ? 'on' : ''} />)}</div>
    case 'line-chart': return <div className="pv-center"><svg className="pv-svgchart" viewBox="0 0 160 90"><path className="grid" d="M5 85H155M5 55H155M5 25H155" /><path className="line" d="M8 70 L36 52 L64 60 L92 34 L120 42 L150 14" /><circle className="dot" cx="150" cy="14" r="4" /></svg></div>
    case 'area-chart': return <div className="pv-center"><svg className="pv-svgchart" viewBox="0 0 160 90"><path className="area" d="M8 70 L36 52 L64 60 L92 34 L120 42 L150 14 V85 H8 Z" /><path className="line" d="M8 70 L36 52 L64 60 L92 34 L120 42 L150 14" /></svg></div>
    case 'pie-chart': return <div className="pv-center"><i className="pv-pie" /></div>
    case 'donut-chart': return <div className="pv-center"><span className="pv-pie pv-donut"><b>72만</b></span></div>
    case 'sparkline': return <div className="pv-center"><div className="pv-stat pv-stat--spark"><small>이번 주 방문</small><div><b>1,284</b><svg viewBox="0 0 60 20"><path d="M2 16 L12 12 L22 14 L32 8 L42 10 L58 3" /></svg></div></div></div>
    case 'gauge': return <div className="pv-center pv-col"><svg className="pv-gauge" viewBox="0 0 120 70"><path className="track" d="M10 62 A50 50 0 0 1 110 62" /><path className="val" d="M10 62 A50 50 0 0 1 92 26" /><path className="needle" d="M60 62 L90 30" /></svg><b>820점</b></div>
    case 'heatmap-chart': return <div className="pv-center"><div className="pv-heatgrid">{Array.from({ length: 35 }, (_, i) => <i key={i} style={{ opacity: [0.15, 0.4, 0.7, 1, 0.25][(i * 3 + (i >> 2)) % 5] }} />)}</div></div>
    case 'radar-chart': return <div className="pv-center"><svg className="pv-radar" viewBox="0 0 100 100"><polygon className="web" points="50,8 90,36 76,84 24,84 10,36" /><polygon className="web" points="50,28 71,42 63,68 37,68 29,42" /><polygon className="val" points="50,14 82,38 66,74 30,78 20,40" /></svg></div>
    // 글자 스타일
    case 'serif': return <div className="pv-center pv-col pv-typesample pv-serif"><b>빵의 시간</b><span>Aa 가나다</span></div>
    case 'sans-serif': return <div className="pv-center pv-col pv-typesample pv-sans"><b>빵의 시간</b><span>Aa 가나다</span></div>
    case 'monospace': return <div className="pv-center pv-col pv-typesample pv-monotype"><span>iiii 0123</span><span>mmmm 4567</span></div>
    case 'display-font': return <div className="pv-center pv-typesample pv-displayfont"><b>BREAD!</b></div>
    case 'type-scale': return <div className="pv-form pv-scale-type"><b className="h1">제목</b><b className="h2">부제목</b><span>본문 글자예요</span><small>캡션</small></div>
    case 'font-weight': return <div className="pv-center pv-weights"><span style={{ fontWeight: 300 }}>가</span><span style={{ fontWeight: 500 }}>가</span><span style={{ fontWeight: 900 }}>가</span></div>
    case 'letter-spacing': return <div className="pv-center pv-col pv-tracking"><b className="tight">소금빵</b><b className="wide">소금빵</b></div>
    case 'line-height': return <div className="pv-center pv-leading"><div className="tight"><Bar w="90%" h={4} tone={4} /><Bar w="80%" h={4} tone={4} /><Bar w="85%" h={4} tone={4} /></div><div className="loose"><Bar w="90%" h={4} tone={4} /><Bar w="80%" h={4} tone={4} /><Bar w="85%" h={4} tone={4} /></div></div>
    case 'caption': return <div className="pv-center pv-col"><i className="pv-thumb-big" /><small className="pv-captiontext">새벽 5시에 구운 소금빵</small></div>
    // 검색 화면
    case 'recent-searches': return <div className="pv-form"><span className="pv-input pv-input--focus pv-input--pill">⌕<i className="pv-caret" /></span><small>최근 검색어</small>{['소금빵', '바게트'].map((t) => <div key={t} className="pv-recent"><span>🕘 {t}</span><i>✕</i></div>)}</div>
    case 'trending-keywords': return <div className="pv-form pv-trend">{['소금빵', '', ''].map((t, i) => <div key={i}><b>{i + 1}</b>{t ? <span>{t}</span> : <Bar w={60 - i * 10} h={5} tone={3} />}{i === 0 && <em>▲</em>}</div>)}</div>
    case 'filter-panel': return <div className="pv-form pv-gap"><div className="pv-wrap"><span className="pv-chip on pv-chip--sm">비건 ✕</span></div><label className="pv-check on"><span>비건</span></label><label className="pv-check"><span>통밀</span></label><label className="pv-check"><span>무설탕</span></label></div>
    case 'sort-menu': return <div className="pv-form"><span className="pv-sortbtn">추천순 ▾</span><div className="pv-list pv-drop"><span className="on">추천순</span><span>낮은 가격순</span><span>최신순</span></div></div>
    case 'search-highlight': return <div className="pv-form pv-gap">{[['버터 ', '소금빵', ''], ['', '소금빵', ' 세트']].map(([a, m, b]) => <div key={a + b} className="pv-li"><i className="pv-li-img" /><div><span>{a}<mark>{m}</mark>{b}</span></div></div>)}</div>
    case 'search-scope': return <Screen><div className="pv-tabs"><span className="on">전체</span><span>상품</span><span>리뷰</span><i className="pv-tab-k" /></div><Lines n={2} /></Screen>
    // 권한 묻기
    case 'pre-permission': return <div className="pv-phone pv-onb"><span className="pv-permart">📍</span><b>가까운 매장을 찾을게요</b><small>위치는 매장 찾기에만 써요</small><span className="pv-btn pv-btn--wide">계속</span></div>
    case 'system-permission': return <div className="pv-phone pv-dim"><Lines /><div className="pv-ios-alert pv-pop"><b>위치를 허용할까요?</b><span>앱을 쓰는 동안 허용</span><span>한 번 허용</span><span>허용 안 함</span></div></div>
    case 'denied-guide': return <div className="pv-center pv-col"><span className="pv-empty">📷</span><b className="pv-emptyt">카메라가 꺼져 있어요</b><small>설정 → 몽글 → 카메라를 켜 주세요</small><span className="pv-btn">설정 열기</span></div>
    case 'notification-optin': return <div className="pv-center pv-col"><div className="pv-push pv-push--demo"><i /><div><b>몽글 베이커리</b><span>빵이 곧 도착해요</span></div></div><span className="pv-btn">알림 받기</span><small>나중에</small></div>
    case 'photo-access': return <div className="pv-phone pv-dim"><Lines /><div className="pv-ios-alert pv-pop"><b>사진 접근을 허용할까요?</b><span>사진 선택…</span><span>모든 사진 허용</span><span>허용 안 함</span></div></div>
    // 스크롤 움직임
    case 'hide-on-scroll': return <Screen head={false} className="pv-scroll"><div className="pv-head pv-head--sticky pv-hidebar"><Bar w={22} h={6} tone={5} /><span className="pv-sp" /><Bar w={10} h={10} r={5} tone={4} /></div><div className="pv-scroller"><Lines n={8} /></div></Screen>
    case 'scrollytelling': return <Screen head={false} className="pv-split pv-split--story"><div className="pv-steps-text"><span className="on">1. 반죽</span><span>2. 숙성</span><span>3. 굽기</span></div><div className="pv-story-art"><i /></div></Screen>
    case 'horizontal-scroll': return <Screen><Lines n={1} /><div className="pv-hscroll"><i /><i className="on" /><i /><i /></div></Screen>
    case 'back-to-top': return <Screen><Lines n={4} /><span className="pv-top-btn pv-pop">↑<small>TOP</small></span></Screen>
    // 화면 배치
    case 'f-pattern': return <Screen><Lines n={5} /><svg className="pv-eye" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ stroke: 'var(--md-primary)' }}><path d="M8 18H92M8 18V45H70M8 45V92" /></svg></Screen>
    case 'z-pattern': return <Screen><div className="pv-zlayout"><Bar w={20} h={8} tone={5} /><Bar w={40} h={5} tone={3} /><i className="pv-zimg" /><span className="pv-btn">시작하기</span></div><svg className="pv-eye" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ stroke: 'var(--md-primary)' }}><path d="M10 14H90L12 88H90" /></svg></Screen>
    case 'grid-system': return <div className="pv-grid12">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}<b className="g1" /><b className="g2" /><b className="g3" /></div>
    case 'holy-grail': return <div className="pv-holy"><i className="h" /><i className="l" /><i className="m" /><i className="r" /><i className="f" /></div>
    case 'sidebar-layout': return <div className="pv-holy pv-sidebar-l"><i className="l" /><i className="m" /></div>
    case 'split-screen': return <div className="pv-splitscreen"><i /><div><b>로그인</b><span className="pv-input" /><span className="pv-input" /><span className="pv-btn">시작하기</span></div></div>
    case 'single-column': return <div className="pv-onecol"><div><b>빵의 시간</b><Bar w="100%" h={4} tone={3} /><Bar w="90%" h={4} tone={3} /><Bar w="95%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /></div></div>
    case 'card-grid': return <div className="pv-gridview pv-cardgrid">{Array.from({ length: 6 }, (_, i) => <i key={i}><b /></i>)}</div>
    case 'responsive': return <div className="pv-center pv-devices"><div className="d pc">{[0, 1, 2].map((i) => <i key={i} />)}</div><div className="d tab">{[0, 1].map((i) => <i key={i} />)}</div><div className="d mob"><i /></div></div>
    case 'material': case 'flat': case 'skeuomorphism': case 'neumorphism': case 'glassmorphism': case 'claymorphism': case 'brutalism': case 'minimalism': case 'dark-mode':
      return <div className={`pv-sty pv-sty--${id}`}><div className="pv-sty-card"><i className="pv-sty-img" /><b>소금빵</b><span className="pv-sty-btn">담기</span></div></div>
    case 'bento-grid': return <div className="pv-bentogrid">{['a', 'b', 'c', 'd', 'e'].map((k) => <i key={k} className={`pv-bg-${k}`}>{k === 'a' ? '한눈에 보기' : null}</i>)}</div>
    case 'toast-stack': return <Screen><Lines /><div className="px-tstack"><i /><i /><span>업로드를 마쳤어요</span></div></Screen>
    case 'type-to-confirm': return <div className="pv-form"><small>지우려면 <b>몽글빵집</b> 입력</small><span className="pv-input pv-input--focus">몽글빵<i className="pv-caret" /></span><span className="pv-btn px-danger px-off">영구 삭제</span></div>
    case 'hotspot': return <Screen><Lines n={2} /><div className="px-hot"><span className="pv-btn pv-btn--ghost">내보내기</span><i /></div></Screen>
    case 'background-task': return <Screen><Lines /><div className="px-bgtask"><small>사진 3장 올리는 중</small><span className="pv-progress"><i /></span></div></Screen>
    case 'queue-position': return <div className="pv-center pv-col px-queue"><small>내 앞에 기다리는 사람</small><b>1,284명</b><span className="pv-progress"><i /></span><small>예상 2분</small></div>
    case 'upload-progress': return <div className="pv-form px-up"><span><b>표지.png</b><em>✓</em></span><span><b>본문.pdf</b><span className="pv-progress"><i /></span></span><span><b>영상.mp4</b><small>대기</small></span></div>
    case 'indeterminate-progress': return <div className="pv-form"><small>연결하는 중</small><span className="pv-progress px-indet"><i /></span></div>
    case 'loading-tips': return <div className="pv-center pv-col"><i className="pv-spin px-big" /><small className="pv-fade">팁: 두 번 누르면 바로 찜돼요</small></div>
    case 'toggle-button': return <div className="pv-center px-tbtn"><span className="on"><b>B</b></span><span><i>I</i></span><span><u>U</u></span></div>
    case 'indeterminate-checkbox': return <div className="pv-form px-tri"><span><i className="px-cb on">−</i><b>전체</b></span><span className="in"><i className="px-cb on">✓</i>사과</span><span className="in"><i className="px-cb" />배</span></div>
    case 'phone-input': return <div className="pv-form"><small>휴대폰 번호</small><span className="pv-input px-phone"><span>🇰🇷 +82 ⌄</span>010-1234-5678</span></div>
    case 'secure-keypad': return <div className="pv-center pv-col px-keypad"><span className="px-pin"><i className="on" /><i className="on" /><i /><i /><i /><i /></span><div>{['7', '2', '9', '4', '0', '1', '8', '5', '3', '6', '⌫', '✓'].map((k) => <span key={k}>{k}</span>)}</div></div>
    case 'pattern-lock': return <div className="pv-center"><svg className="px-pattern" viewBox="0 0 90 90" width="96" height="96"><polyline points="15,15 45,45 75,15 75,75 45,75" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }} />{[15, 45, 75].flatMap((y) => [15, 45, 75].map((x) => <circle key={x + '-' + y} cx={x} cy={y} r="5" style={{ fill: 'var(--ss-ink-5)' }} />))}</svg></div>
    case 'password-strength': return <div className="pv-form"><small>비밀번호</small><span className="pv-input pv-input--focus">●●●●●●●</span><span className="px-meter"><i className="on" /><i className="on" /><i className="on" /><i /><em>보통</em></span></div>
    case 'character-counter': return <div className="pv-form"><span className="pv-textarea">빵이 정말 부드럽고 맛있어요<i className="pv-caret" /></span><small className="px-count">15 / 100</small></div>
    case 'input-addon': return <div className="pv-form px-addon"><span className="pv-input"><em>https://</em><span>mongle.shop</span></span><span className="pv-input"><span>3,500</span><em>원</em></span></div>
    case 'multi-select': return <div className="pv-form"><span className="pv-input px-ms"><span className="pv-chip pv-chip--sm">빵 ✕</span><span className="pv-chip pv-chip--sm">커피 ✕</span><span className="pv-chev">⌄</span></span><div className="pv-list pv-drop px-msl"><span><i className="px-cb on">✓</i>빵</span><span><i className="px-cb on">✓</i>커피</span><span><i className="px-cb" />케이크</span></div></div>
    case 'radio-card': return <div className="pv-center px-rcard"><span><i />일반 배송<small>무료 · 2일</small></span><span className="on"><i />빠른 배송<small>3,000원 · 내일</small></span></div>
    case 'color-swatch': return <div className="pv-center pv-col"><small>색상: <b>세이지</b></small><div className="px-sw">{['#e9e4da', '#9bb59a', '#2f3a4a', '#c86b5a', '#e7c25d'].map((c, i) => <i key={c} className={i === 1 ? 'on' : ''} style={{ background: c }} />)}</div></div>
    case 'size-selector': return <div className="pv-center px-size">{['S', 'M', 'L', 'XL'].map((s) => <span key={s} className={s === 'M' ? 'on' : s === 'XL' ? 'out' : ''}>{s}</span>)}</div>
    case 'emoji-reaction': return <div className="pv-center pv-col"><div className="px-react pv-pop">{['👍', '❤️', '😂', '😮', '😢'].map((e) => <span key={e}>{e}</span>)}</div><span className="pv-bubble">내일 빵 사러 갈래?</span></div>
    case 'biometric-prompt': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><svg viewBox="0 0 24 24" width="34" height="34" style={{ ...SV, stroke: 'var(--md-primary)' }}><path d="M6.5 10a5.5 5.5 0 0 1 11 0v2M9 10a3 3 0 0 1 6 0v3c0 2-.6 3.8-1.6 5.2M12 10v4c0 2.4-.8 4.4-2.2 6M6.5 13.5c0 2.2-.5 4-1.3 5.3M17.5 15c-.2 1.6-.7 3-1.4 4.2" /></svg><b>지문을 대 주세요</b><small>결제 12,000원</small></div></Screen>
    case 'knob': return <div className="pv-center pv-col"><span className="px-knob"><i /></span><small>음량 <b>72</b></small></div>
    case 'slash-command': return <div className="pv-form"><span className="pv-input pv-input--focus">/표<i className="pv-caret" /></span><div className="pv-list pv-drop"><span className="on">▦ 표</span><span>H 제목</span><span>▣ 그림</span></div></div>
    case 'center-tab-button': return <Screen head={false}><Lines n={4} /><div className="pv-tabbar px-ctab"><i>⌂</i><i>⌕</i><b>＋</b><i>♡</i><i>☺</i></div></Screen>
    case 'collapsible-sidebar': return <Screen head={false} className="px-csb"><div className="px-csb-side"><span className="px-csb-x">«</span><span>⌂ 홈</span><span>▤ 주문</span><span>☺ 고객</span></div><div className="px-csb-main"><Lines /></div></Screen>
    case 'alphabet-index': return <Screen><div className="px-idx-list"><small>ㅂ</small><span>박지민</span><span>배수지</span><small>ㅅ</small><span>서하늘</span></div><div className="px-idx">{'ㄱㄴㄷㄹㅁㅂㅅㅇㅈ'.split('').map((c) => <i key={c} className={c === 'ㅂ' ? 'on' : ''}>{c}</i>)}</div></Screen>
    case 'account-menu': return <Screen head={false}><div className="pv-head"><Bar w={22} h={6} tone={4} /><span className="pv-sp" /><span className="pv-avatar pv-avatar--xs">몽</span></div><div className="pv-list pv-drop px-acct"><span><b>김몽글</b><small>mongle@mail.com</small></span><span>설정</span><span className="pv-danger">로그아웃</span></div></Screen>
    case 'pill-nav': return <Screen head={false}><Lines n={5} /><div className="px-pill"><span className="on">홈</span><span>소식</span><span>가게</span></div></Screen>
    case 'prev-next': return <div className="pv-center px-pn"><span><small>← 이전 글</small><b>소금빵 굽는 법</b></span><span className="r"><small>다음 글 →</small><b>크루아상의 결</b></span></div>
    case 'tag-cloud': return <div className="pv-center px-cloud">{([['소금빵', 2], ['쫄깃', 1.2], ['버터', 1.6], ['바삭', 1], ['선물', 0.9], ['재구매', 1.3], ['고소', 1.05]] as const).map(([t, s]) => <span key={t} style={{ fontSize: `${s}em` }}>{t}</span>)}</div>
    case 'spoiler': return <div className="pv-form"><b>후기</b><span>배우들 연기는 정말 좋았고</span><span className="px-spoil">마지막에 범인은 집사였어요</span></div>
    case 'footnote': return <Screen head={false}><div className="px-fn"><p>천연 발효종<sup>1</sup>으로 하루 숙성해요.</p><Bar w="80%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /><hr /><small><sup>1</sup> 밀가루와 물로 키운 효모</small></div></Screen>
    case 'comparison-table': return <div className="px-cmp"><span /><b>기본</b><b className="on">프로</b><span>저장</span><i>5GB</i><i className="on">1TB</i><span>공유</span><i>✓</i><i className="on">✓</i><span>광고 제거</span><i className="x">✕</i><i className="on">✓</i></div>
    case 'leaderboard': return <div className="pv-form px-lb">{([['🥇', '하늘', '1,280'], ['🥈', '몽글', '1,140'], ['🥉', '지민', '990']] as const).map(([m, n, s]) => <span key={n} className={n === '몽글' ? 'me' : ''}><em>{m}</em><b>{n}</b><small>{s}점</small></span>)}</div>
    case 'sticky-note': return <div className="pv-center px-notes"><span>버터 줄이기</span><span className="b">포장 바꾸기?</span><span className="c">주말 할인</span></div>
    case 'infinite-canvas': return <div className="px-canvas"><span className="n">아이디어</span><i className="s" /><i className="c" /><small>− 75% ＋</small></div>
    case 'minimap': return <Screen head={false}><div className="px-code">{[70, 45, 82, 30, 66, 52, 74, 40].map((w, i) => <Bar key={i} w={`${w}%`} h={4} tone={i % 3 ? 3 : 4} />)}</div><div className="px-mini">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ width: `${30 + ((i * 37) % 60)}%` }} />)}<b /></div></Screen>
    case 'diff-view': return <div className="px-diff"><span className="del">− 가격: 3,000원</span><span className="add">+ 가격: 3,500원</span><span>  포장: 종이 봉투</span><span className="add">+ 리본 추가</span></div>
    case 'audio-waveform': return <div className="pv-center"><span className="px-wave"><b>▶</b><span>{[6, 12, 18, 10, 22, 14, 8, 16, 20, 9, 13, 6, 11, 17, 7].map((h, i) => <i key={i} style={{ height: h }} className={i < 6 ? 'on' : ''} />)}</span><small>0:12</small></span></div>
    case 'image-hotspot': return <div className="px-shot"><i className="d1" /><i className="d2" /><span className="pv-pop">원목 의자 <b>89,000원</b></span></div>
    case 'map-cluster': return <div className="px-map"><b className="c1">24</b><b className="c2">8</b><b className="c3">132</b></div>
    case 'read-receipt': return <div className="pv-center pv-col px-rr"><span><em>1</em><small>오후 3:12</small><span className="px-me">지금 출발해요</span></span><span><em>3</em><small>오후 3:13</small><span className="px-me">빵 사 갈게요</span></span></div>
    case 'reply-quote': return <div className="pv-center"><span className="px-rq"><span><b>하늘</b> 몇 시에 만나?</span>3시 어때요?</span></div>
    case 'pinned-message': return <Screen><div className="px-pin2">📌 <b>토요일 2시 성수점에서 모여요</b></div><Lines /></Screen>
    case 'date-divider': return <div className="pv-form px-dd2"><span className="pv-bubble">내일 봬요!</span><em>11월 17일 월요일</em><span className="pv-bubble r">좋은 아침이에요</span></div>
    case 'system-message': return <div className="pv-form px-dd2"><span className="pv-bubble">다들 모였어요?</span><em className="px-sys">지민님이 들어왔어요</em><span className="pv-bubble r">안녕하세요!</span></div>
    case 'hold-to-confirm': return <div className="pv-center"><span className="px-hold"><i /><span>꾹 눌러 보내기</span></span></div>
    case 'slide-to-confirm': return <div className="pv-center"><span className="px-slide"><i>›</i><span>밀어서 결제하기</span></span></div>
    case 'resize-handle': return <div className="pv-center"><div className="px-rs"><Lines n={2} /><i className="e" /><i className="c" /><span>↔</span></div></div>
    case 'magnetic-button': return <div className="pv-center"><span className="pv-btn pv-btn--lg px-mag">시작하기</span><i className="px-cur" /></div>
    case 'cursor-follower': return <div className="pv-center"><span className="px-follow"><i /><b>보기</b></span></div>
    case 'tilt-card': return <div className="pv-center px-tiltwrap"><div className="px-tilt"><b>멤버십 카드</b><small>MONGLE · 2026</small></div></div>
    case 'ripple': return <div className="pv-center"><span className="pv-btn pv-btn--lg px-ripple"><i />장바구니 담기</span></div>
    case 'reorder-list': return <div className="pv-form px-reo"><span><i>⠿</i>반죽 만들기</span><span className="lift"><i>⠿</i>오븐 예열</span><span><i>⠿</i>굽기</span></div>
    case 'close-icon': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-modal--sm"><span className="px-x">✕</span><b>쿠폰 도착!</b><Bar w={70} h={5} tone={3} /></div></Screen>
    case 'filter-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 5h18l-7 8v6l-4-2v-4z" /></svg><em className="pv-badge">2</em></span></div>
    case 'sort-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4" /></svg></span><span className="px-th">가격 <b>↓</b></span></div>
    case 'globe-icon': return <div className="pv-center"><span className="px-lang"><svg viewBox="0 0 24 24" width="16" height="16" style={SV}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>한국어 ⌄</span><div className="pv-list pv-drop"><span className="on">한국어</span><span>English</span><span>日本語</span></div></div>
    case 'fullscreen-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></span><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg></span></div>
    case 'pin-icon': return <div className="pv-form px-pinlist"><span><b>공지방</b><svg viewBox="0 0 24 24" width="13" height="13" style={SV}><path d="M9 4h6l-1 5 3 3H7l3-3zM12 12v8" /></svg></span><span><b>빵 모임</b></span><span><b>가족</b></span></div>
    case 'memory-indicator': return <div className="pv-form pv-chat"><span className="pv-bubble px-q">저 우유 못 먹어요</span><span className="px-mem pv-fade">◎ 기억함 · 우유를 못 먹어요 <u>관리</u></span><span className="pv-bubble">그럼 우유 없는 빵만 고를게요.</span></div>
    case 'branch-navigator': return <div className="pv-form pv-chat"><span className="pv-bubble">소금빵은 버터를 반죽에 말아 구워요.</span><span className="px-branch">‹ <b>2 / 3</b> ›</span></div>
    case 'edit-prompt': return <div className="pv-form"><span className="pv-input pv-input--focus">소금빵 칼로리<i className="pv-caret" /></span><div className="pv-row2 px-end"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn">보내기</span></div></div>
    case 'context-meter': return <div className="pv-form"><span className="pv-input pv-input--pill px-ctx"><span>무엇이든 물어보세요</span><i /><small>78%</small></span></div>
    case 'ai-disclaimer': return <div className="pv-form"><span className="pv-input pv-input--pill px-faint">메시지 보내기</span><small className="px-disc">AI는 실수할 수 있어요. 중요한 건 한 번 더 확인하세요.</small></div>
    case 'reasoning-toggle': return <div className="pv-form"><span className="pv-input">어떤 빵이 많이 남을까?</span><div className="pv-row2"><span className="pv-chip px-on">◐ 깊게 생각</span><span className="pv-chip">＋</span></div></div>
    case 'image-gen-grid': return <div className="px-gen">{['#f3d9b1', '#d8e6c8', '#f2c7c0', '#cfd9ee'].map((c, i) => <i key={c} className={i === 1 ? 'on' : ''} style={{ background: `radial-gradient(circle at ${30 + i * 12}% 60%, #c9844a 0 18%, transparent 19%), ${c}` }} />)}</div>
    case 'inline-ai': return <Screen head={false}><div className="px-ia"><Bar w="80%" h={4} tone={3} /><span><mark>빵이 엄청 진짜 맛있어요</mark></span><Bar w="66%" h={4} tone={3} /><div className="px-ia-menu pv-pop"><b>다듬기</b><span>줄이기</span><span>번역</span></div></div></Screen>
    case 'ghost-text': return <div className="pv-form"><span className="pv-textarea">내일 오후 3시에<i className="pv-caret" /><span className="px-ghost"> 성수점에서 만나요</span></span><small><span className="pv-kbd">Tab</span> 눌러 넣기</small></div>
    case 'approval-request': return <div className="px-appr"><small>에이전트가 허락을 기다려요</small><b>주문 메일 보내기</b><span>받는 사람: 몽글 베이커리</span><div className="pv-row2"><span className="pv-btn pv-btn--ghost">거절</span><span className="pv-btn">허락</span></div></div>
    case 'fake-close': return <div className="px-ad"><b>단 하루 90% 할인!</b><Bar w={80} h={5} tone={3} /><span className="px-fx">✕</span><span className="px-realx">닫기</span></div>
    case 'hidden-unsubscribe': return <Screen head={false}><div className="px-mail"><b>이번 주 특가 🎉</b><Lines n={2} /><span className="pv-btn">지금 사러 가기</span><p>본 메일은 발신 전용입니다. 수신을 원하지 않으시면 <u>여기</u>를 눌러 설정을 바꿀 수 있습니다. 사업자 등록 번호 …</p></div></Screen>
    case 'streak-pressure': return <div className="pv-center pv-col px-streak"><b>🔥 120일</b><small>오늘 안 하면 기록이 <em>0일</em>로 돌아가요</small><span className="pv-btn">지금 하기</span></div>
    case 'last-step-paywall': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>결제해야 저장돼요</b><small>프로 월 14,900원</small><span className="pv-btn">결제하기</span></div></Screen>
    case 'per-day-price': return <div className="pv-center pv-col px-pday"><small>프로 멤버십</small><b>하루 <em>330</em>원</b><small>1년 119,000원</small></div>
    case 'tiered-discount': return <div className="pv-center px-tier">{([['1개', '3,500', ''], ['2개', '6,300', '−10%'], ['3개', '8,400', '−20%']] as const).map(([n, p, d]) => <span key={n} className={n === '3개' ? 'on' : ''}><b>{n}</b><small>{p}원</small>{d && <em>{d}</em>}</span>)}</div>
    case 'member-price': return <div className="pv-form px-mp"><span><small>판매가</small><s>12,000원</s></span><span className="on"><small>회원가</small><b>9,900원</b></span><small className="px-mp-cta">가입하고 2,100원 아끼기 ›</small></div>
    case 'coupon-price': return <div className="pv-form px-cp"><span>12,000원</span><span className="px-cp-tag">쿠폰 쓰면 <b>8,900원</b><em>최대 할인</em></span><span className="pv-btn">쿠폰 받기</span></div>
    case 'installment': return <div className="pv-center pv-col px-pday"><small>588,000원</small><b>월 <em>49,000</em>원</b><span className="pv-chip pv-chip--sm">12개월 무이자</span></div>
    case 'sample-data': return <Screen><div className="px-sample"><span className="pv-chip pv-chip--sm">예시 데이터</span><div className="pv-center pv-bars">{[40, 64, 30, 80, 52].map((h, i) => <i key={i} style={{ height: h * 0.6 }} className={i === 3 ? 'on' : ''} />)}</div></div></Screen>
    case 'maintenance-page': return <div className="pv-center pv-col"><span className="pv-bigicon">🛠</span><b>지금은 점검 중이에요</b><small>새벽 2:00 ~ 4:00 · 다시 열면 알려 드릴게요</small></div>
    case 'coming-soon': return <div className="pv-center pv-col"><span className="pv-chip pv-chip--sm">12월 오픈</span><b>빵 정기 배송, 곧 열려요</b><span className="pv-row2"><span className="pv-input px-w110">이메일</span><span className="pv-btn">알림 받기</span></span></div>
    case 'live-badge': return <div className="px-live"><span><i />LIVE</span><small>👁 1.2만</small></div>
    case 'new-badge': return <div className="pv-form px-new"><span>오늘의 빵 소식 <em>N</em></span><span>주말 할인 안내 <em>N</em></span><span>11월 휴무일</span></div>
    case 'sync-status': return <div className="pv-center pv-col px-sync"><span><i className="pv-spin" /> 동기화 중…</span><span className="ok">☁ 모든 기기에 저장됨</span></div>
    case 'privacy-indicator': return <div className="px-pi"><span className="px-pi-bar"><b>9:41</b><i className="g" /><span className="px-pi-sp" />▮▮▮</span><span className="pv-pop px-pi-tip"><i className="g" />카메라 사용 중</span></div>
    case 'location-precision': return <div className="pv-center px-loc"><span className="on"><i className="m"><b className="pin" /></i>정확한 위치</span><span><i className="m"><b className="area" /></i>대략 위치</span></div>
    case 'order-tracker': return <div className="pv-form px-track"><b>오늘 도착 예정</b><div>{['주문', '준비', '배송 중', '도착'].map((t, i) => <span key={t} className={i < 3 ? 'on' : ''}><i />{t}</span>)}</div></div>
    case 'invite-link': return <div className="pv-form"><b>팀에 초대하기</b><span className="pv-input px-inv"><span>mongle.app/j/8fK2</span><span className="pv-btn">복사</span></span><small>7일 뒤 만료 · 보기 권한</small></div>
    case 'share-card': return <div className="pv-center"><div className="px-scard"><small>2026 나의 빵</small><b>소금빵 87개</b><span>상위 3%</span></div><div className="pv-center pv-col"><span className="pv-btn">이미지 저장</span><span className="pv-btn pv-btn--ghost">공유</span></div></div>
    case 'morph': return <div className="pv-center"><span className="px-morph"><b>＋</b><span>새 메모</span></span></div>
    case 'stagger-list': return <div className="pv-form px-stg">{[0, 1, 2, 3].map((i) => <span key={i} className="pv-li" style={{ animationDelay: `${i * 0.12}s` }}><span className="pv-avatar pv-avatar--xs" /><Bar w="60%" h={5} tone={3} /></span>)}</div>
    case 'gradient-text': return <div className="pv-center"><b className="px-grad">오늘도 갓 구운</b></div>
    case 'highlight-marker': return <div className="pv-center"><span className="px-hl-line">매일 아침 <span className="px-hl">새로 구워요</span></span></div>
    case 'split-flap': return <div className="pv-center px-flap">{['0', '9', ':', '4', '1'].map((c, i) => <span key={i} className={c === ':' ? 'sep' : ''}>{c}</span>)}</div>
    case 'text-shimmer': return <div className="pv-center"><b className="px-shim">답을 찾는 중…</b></div>
    case 'success-button': return <div className="pv-center"><span className="pv-btn pv-btn--lg">담기</span><span className="px-arrow">→</span><span className="pv-btn pv-btn--lg px-ok">✓ 담았어요</span></div>
    case 'destructive-button': return <div className="pv-center pv-col"><div className="pv-row2"><span className="pv-btn pv-btn--ghost">취소</span><span className="pv-btn px-danger">삭제</span></div><span className="px-danger-o">계정 탈퇴</span></div>
    case 'time-slots': return <div className="px-slots">{['10:00', '10:30', '11:00', '11:30', '13:00', '13:30'].map((t) => <span key={t} className={t === '11:00' ? 'on' : t === '10:30' || t === '13:00' ? 'off' : ''}>{t}</span>)}</div>
    case 'month-picker': return <div className="px-month"><b>‹ 2026 ›</b><div>{Array.from({ length: 12 }, (_, i) => <span key={i} className={i === 10 ? 'on' : ''}>{i + 1}월</span>)}</div></div>
    case 'density-toggle': return <div className="pv-form"><div className="pv-row2"><span className="pv-chip pv-chip--sm">넓게</span><span className="pv-chip pv-chip--sm px-on">촘촘</span></div><div className="px-dlist">{[80, 64, 72, 56, 70].map((w, i) => <Bar key={i} w={`${w}%`} h={5} tone={3} />)}</div></div>
    case 'sticky-section-header': return <Screen><div className="px-ssh"><b>오늘</b><span /><span /><b>어제</b><span /></div></Screen>
    case 'shelf': return <Screen head={false} className="px-shelf">{['요즘 뜨는 빵', '다시 보기'].map((t, k) => <div key={t}><b>{t}</b><div>{[0, 1, 2, 3].map((i) => <i key={i} style={{ background: ['#f1d9b8', '#cfe0d0', '#f2cbc3', '#d6dcef'][(i + k) % 4] }} />)}</div></div>)}</Screen>
    case 'contribution-graph': return <div className="px-grass">{Array.from({ length: 7 * 16 }, (_, i) => <i key={i} className={`l${(i * 7 + (i % 5) * 3 + (i >> 3)) % 5}`} />)}</div>
    case 'treemap': return <div className="px-tree"><i className="a">빵 48%</i><i className="b">음료 22%</i><i className="c">케이크</i><i className="d" /></div>
    case 'sankey': return <svg viewBox="0 0 230 120" width="210" height="110"><path d="M30 10 C100 10 100 5 170 5 L170 55 C100 55 100 60 30 60Z" style={{ fill: 'var(--md-primary)', opacity: 0.35 }} /><path d="M30 60 C100 60 100 65 170 65 L170 90 C100 90 100 85 30 85Z" style={{ fill: '#e6a23c', opacity: 0.45 }} /><path d="M30 85 C100 85 100 100 170 100 L170 115 C100 115 100 100 30 100Z" style={{ fill: '#c8506a', opacity: 0.4 }} /><rect x="20" y="10" width="10" height="90" style={{ fill: 'var(--md-primary)' }} /><rect x="170" y="5" width="8" height="50" style={{ fill: 'var(--md-primary)' }} /><rect x="170" y="65" width="8" height="25" style={{ fill: '#e6a23c' }} /><rect x="170" y="100" width="8" height="15" style={{ fill: '#c8506a' }} /><text x="184" y="34" style={{ fontSize: 11, fill: 'currentColor' }}>빵</text><text x="184" y="81" style={{ fontSize: 11, fill: 'currentColor' }}>음료</text><text x="184" y="112" style={{ fontSize: 11, fill: 'currentColor' }}>기타</text></svg>
    case 'scatter-plot': return <div className="px-scatter">{[[10, 70], [18, 62], [25, 58], [32, 50], [40, 52], [48, 40], [55, 36], [63, 30], [70, 22], [78, 20], [30, 30], [60, 62]].map(([x, y], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%` }} className={i > 9 ? 'o' : ''} />)}</div>
    case 'candlestick': return <div className="pv-center px-candle">{[[30, 20, 22, 38, 1], [34, 16, 26, 32, 0], [40, 24, 32, 40, 1], [52, 18, 44, 34, 1], [46, 14, 40, 28, 0], [56, 22, 50, 34, 1], [62, 16, 56, 30, 1]].map(([b, h, wb, wh, up], i) => <span key={i}><i style={{ bottom: wb, height: wh }} /><b className={up ? 'up' : 'dn'} style={{ bottom: b, height: h }} /></span>)}</div>
    case 'stacked-bar': return <div className="pv-center px-stack">{[[30, 20, 14], [36, 24, 10], [28, 30, 20], [40, 26, 16], [34, 22, 24]].map((v, i) => <span key={i}>{v.map((h, k) => <i key={k} style={{ height: h }} className={`s${k}`} />)}</span>)}</div>
    case 'waterfall-chart': return <div className="pv-center px-fall">{([[0, 60, 't'], [60, 25, 'u'], [55, 30, 'd'], [40, 15, 'd'], [0, 40, 't']] as const).map(([b, h, k], i) => <span key={i}><b className={k} style={{ bottom: b, height: h }} /></span>)}</div>
    case 'bullet-chart': return <div className="pv-form px-bullet">{([['매출', 72, 80], ['방문', 90, 75], ['리뷰', 40, 60]] as const).map(([t, v, g]) => <span key={t}><small>{t}</small><i><b style={{ width: `${v}%` }} /><em style={{ left: `${g}%` }} /></i></span>)}</div>
    case 'drop-cap': return <div className="px-drop"><p><b>빵</b>은 시간이 만드는 음식이에요. 반죽이 쉬는 동안 맛이 깊어지고, 오븐 안에서 겉은 바삭하게 속은 촉촉하게 익어요.</p></div>
    case 'tabular-nums': return <div className="pv-center px-tnum"><div><small>보통</small><span>1,111원</span><span>8,888원</span></div><div className="on"><small>고정폭</small><span>1,111원</span><span>8,888원</span></div></div>
    case 'variable-font': return <div className="pv-center pv-col"><b className="px-var">몽글</b><span className="px-varbar"><i /></span><small>굵기 100 → 900</small></div>
    case 'did-you-mean': return <Screen head={false}><div className="pv-head"><span>⌕ 소굼빵</span></div><div className="px-dym"><small>혹시 <b>소금빵</b>을 찾으세요?</small><Lines n={2} /></div></Screen>
    case 'visual-search': return <div className="px-vs"><span className="px-vs-frame"><i /><i /><i /><i /></span><span className="pv-chip pv-chip--sm pv-pop">비슷한 빵 12개</span></div>
    case 'scroll-shadow': return <div className="pv-center px-ss2"><div><i /><Lines n={3} /></div><div className="on"><i /><Lines n={3} /></div></div>
    case 'scroll-fade': return <div className="px-sfade">{['소금빵', '크루아상', '베이글', '식빵', '스콘'].map((t) => <span key={t} className="pv-chip">{t}</span>)}</div>
    case 'dashboard-layout': return <div className="px-dash"><i className="k" /><i className="k" /><i className="k" /><i className="g" /><i className="t" /></div>
    case 'above-the-fold': return <Screen><div className="px-fold"><Bar w="60%" h={8} tone={4} /><Bar w="40%" h={5} tone={3} /><span className="pv-btn">시작하기</span><em>여기까지 처음 보여요</em><Bar w="70%" h={4} tone={3} /></div></Screen>
    case 'safe-area': return <div className="px-safe"><i className="notch" /><div className="in"><Lines n={3} /></div><i className="home" /></div>
    case 'whitespace': return <div className="pv-center px-ws"><div className="tight"><b>소금빵</b><Bar w="90%" h={4} tone={3} /><Bar w="80%" h={4} tone={3} /><span className="pv-btn">담기</span></div><div><b>소금빵</b><Bar w="70%" h={4} tone={3} /><span className="pv-btn">담기</span></div></div>
    case 'vaporwave': return <div className="px-vapor"><i className="sun" /><i className="floor" /><b>D R E A M</b></div>
    case 'material-you': return <div className="pv-center px-myou"><i className="photo" /><b className="ar">→</b><div><span className="btn">확인</span><span className="chip">소금빵</span><span className="tg"><i /></span></div></div>
    case 'neon': return <div className="px-neon"><b>OPEN</b><span>24시간 빵집</span></div>
    case 'gradient-mesh': return <div className="px-mesh"><b>Hello, 몽글</b></div>
    case 'high-contrast': return <div className="pv-center px-hc"><div className="lo"><b>소금빵</b><small>3,500원</small><span>담기</span></div><div className="hi"><b>소금빵</b><small>3,500원</small><span>담기</span></div></div>
    case 'frutiger-aero': return <div className="px-aero"><i className="b1" /><i className="b2" /><span>시작</span></div>
    case 'action-sheet': return <Screen className="pv-dim"><Lines /><div className="py-as"><div><span>공유하기</span><span className="pv-danger">삭제</span></div><b>취소</b></div></Screen>
    case 'undo-history': return <div className="pv-form py-hist">{['열기', '밝기 +20', '자르기', '글자 넣기'].map((t, i) => <span key={t} className={i === 2 ? 'on' : i > 2 ? 'off' : ''}><i />{t}</span>)}</div>
    case 'popup-blocked': return <Screen head={false}><div className="py-url"><span>mongle.shop</span><b>⊘</b></div><div className="py-pb pv-drop">팝업이 차단됐어요 <u>허용</u></div><Lines n={2} /></Screen>
    case 'session-timeout': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b className="py-big">0:59</b><small>곧 자동 로그아웃돼요</small><span className="pv-btn">연장하기</span></div></Screen>
    case 'whats-new': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><span className="pv-chip pv-chip--sm">NEW</span><i className="py-art" /><b>사진으로 빵 찾기</b><span className="py-dots"><i className="on" /><i /><i /></span></div></Screen>
    case 'feedback-widget': return <Screen><Lines n={4} /><span className="py-fw">의견</span><div className="py-fwbox pv-pop"><b>어떤 점이 불편했나요?</b><span className="pv-input" /><span className="pv-btn">보내기</span></div></Screen>
    case 'unsaved-changes': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-modal--sm pv-pop"><b>저장하지 않고 나갈까요?</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">나가기</span><span className="pv-btn">저장</span></div></div></Screen>
    case 'step-loader': return <div className="pv-center pv-col py-step"><i className="pv-spin px-big" /><div><span>주문 확인 중</span><span>포장 준비 중</span><span>거의 다 됐어요</span></div></div>
    case 'mascot-loader': return <div className="pv-center pv-col"><span className="py-bun"><i /><i /></span><small>빵 굽는 중…</small></div>
    case 'coupon-code': return <div className="pv-form"><small>쿠폰 코드</small><span className="pv-input px-inv"><span>MONGLE3000</span><span className="pv-btn">적용</span></span><small className="py-ok pv-fade">✓ 3,000원 할인됐어요</small></div>
    case 'eyedropper': return <div className="pv-center"><div className="py-photo"><i className="py-loupe" /></div><span className="py-chipc"><i />#E2A86D</span></div>
    case 'draft-restore': return <Screen><div className="py-draft pv-drop"><span>어제 쓰던 글이 있어요</span><b>이어 쓰기</b></div><Lines /></Screen>
    case 'payment-widget': return <div className="pv-form py-pay">{['신용 · 체크카드', '간편결제', '계좌이체'].map((t, i) => <span key={t} className={i === 1 ? 'on' : ''}><i />{t}</span>)}</div>
    case 'card-number-input': return <div className="pv-center pv-col"><div className="py-card"><i /><b>4321 •••• •••• 1234</b></div><span className="pv-input pv-input--focus py-cn">4321 5678 9012 1234</span></div>
    case 'drop-overlay': return <Screen><Lines n={4} /><div className="py-drop"><b>⇩</b>여기에 놓으면 올라가요</div></Screen>
    case 'photo-grid-upload': return <div className="py-pgu"><span className="add">＋<small>3/10</small></span>{['#f1d9b8', '#cfe0d0', '#f2cbc3'].map((c, i) => <i key={c} style={{ background: c }}>{i === 0 && <em>대표</em>}</i>)}</div>
    case 'font-size-control': return <div className="pv-center pv-col"><div className="pv-row2"><span className="pv-chip">가−</span><span className="pv-chip px-on">가+</span></div><p className="py-fs">빵은 시간이 만드는 음식이에요.</p></div>
    case 'theme-toggle': return <div className="py-theme"><span className="py-sw"><i>☀</i><i>☾</i><b /></span></div>
    case 'scroll-to-agree': return <div className="pv-form"><div className="py-terms"><Lines n={6} /></div><span className="pv-btn py-agree">끝까지 읽고 동의</span></div>
    case 'link-preview': return <div className="pv-form"><span className="pv-bubble py-lp"><u>mongle.shop/bread</u><span className="py-lpc pv-pop"><i /><b>몽글 베이커리 소금빵</b><small>mongle.shop</small></span></span></div>
    case 'infinite-carousel': return <div className="py-inf"><div>{[0, 1, 2, 3, 0, 1, 2, 3].map((k, i) => <i key={i} style={{ background: ['#f1d9b8', '#cfe0d0', '#f2cbc3', '#d6dcef'][k] }}>{k + 1}</i>)}</div></div>
    case 'frozen-column': return <div className="py-fz"><div className="col">{['이름', '소금빵', '크루아상', '베이글'].map((t) => <span key={t}>{t}</span>)}</div><div className="rest"><div>{[['1월', '2월', '3월', '4월'], ['12', '15', '9', '20'], ['8', '7', '11', '6'], ['5', '9', '4', '10']].map((r, i) => <span key={i}>{r.map((c, j) => <i key={j}>{c}</i>)}</span>)}</div></div></div>
    case 'product-card': return <div className="py-prod"><i><em>♥</em></i><b>버터 소금빵</b><span><em>20%</em> 2,800원</span><small>★ 4.8 (1,204)</small></div>
    case 'ticket': return <div className="py-tk"><div><small>서울 → 제주</small><b>KE 1201</b></div><div className="stub"><small>탑승구</small><b>12</b></div></div>
    case 'widget': return <div className="py-home">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <i key={i} />)}<div className="py-wd"><small>오늘 배송</small><b>오후 2시</b><span>도착 예정</span></div></div>
    case 'badge-collection': return <div className="py-badges">{['🥐', '🥖', '🍰', '🔒', '🔒', '🔒'].map((b, i) => <span key={i} className={i < 3 ? 'on' : ''}>{b}</span>)}</div>
    case 'profile-card': return <div className="py-pc"><span className="pv-avatar">몽</span><b>김몽글</b><div><span><b>128</b>글</span><span><b>2.4천</b>팔로워</span></div><span className="pv-btn">팔로우</span></div>
    case 'doc-comment': return <Screen head={false}><div className="py-dc"><div><Bar w="90%" h={4} tone={3} /><span>버터를 <mark>30g</mark> 넣어요</span><Bar w="70%" h={4} tone={3} /></div><div className="py-dcc pv-pop"><b>하늘</b><small>20g 아닌가요?</small></div></div></Screen>
    case 'version-history': return <div className="pv-form py-vh">{([['오늘 14:20', '지금 버전'], ['오늘 11:05', '하늘'], ['어제 18:40', '몽글']] as const).map(([t, w], i) => <span key={t} className={i === 1 ? 'on' : ''}><b>{t}</b><small>{w}</small></span>)}<span className="pv-btn py-vb">이 버전으로 되돌리기</span></div>
    case 'live-cursors': return <Screen head={false}><Lines n={5} /><span className="py-lc a"><i /><b>하늘</b></span><span className="py-lc b"><i /><b>지민</b></span></Screen>
    case 'poll': return <div className="pv-form py-poll"><b>내일 모임 빵은?</b>{([['소금빵', 62], ['베이글', 28], ['스콘', 10]] as const).map(([t, p]) => <span key={t} className={t === '소금빵' ? 'on' : ''}><i style={{ width: `${p}%` }} /><em>{t}</em><small>{p}%</small></span>)}</div>
    case 'audio-player': return <div className="py-ap"><i /><div><b>아침 빵 굽는 소리</b><span className="pv-progress"><i /></span><small>1:12 / 3:40</small></div><span className="py-play">❚❚</span></div>
    case 'more-tab': return <Screen head={false}><div className="pv-list pv-drop py-more"><span>설정</span><span>고객센터</span><span>공지사항</span></div><div className="pv-tabbar"><i>⌂</i><i>⌕</i><i>♡</i><i className="on">⋯</i></div></Screen>
    case 'workspace-switcher': return <Screen head={false}><div className="pv-head"><span className="py-ws"><i>몽</i><b>몽글 팀</b> ⌄</span></div><div className="pv-list pv-drop py-wsl"><span className="on"><i>몽</i>몽글 팀</span><span><i className="b">하</i>하늘 회사</span><span>＋ 새 공간</span></div></Screen>
    case 'swipe-tabs': return <Screen head={false}><div className="py-stab"><span>추천</span><span>빵</span><span>음료</span><i /></div><div className="py-spg"><div><Lines /></div><div><Lines n={2} /></div></div></Screen>
    case 'two-finger-rotate': return <div className="pv-center"><span className="py-rot"><i className="f1" /><i className="f2" /></span></div>
    case 'tap-to-focus': return <div className="py-cam"><span className="py-focus" /></div>
    case 'scrubbing': return <div className="pv-form"><small>투명도</small><span className="pv-input py-scrub"><b>↔</b><em>72%</em></span></div>
    case 'swipe-to-reply': return <div className="pv-center py-str"><b>↩</b><span className="pv-bubble">내일 몇 시에 만나?</span></div>
    case 'inertia-scroll': return <Screen><div className="py-inr">{Array.from({ length: 10 }, (_, i) => <span key={i}><span className="pv-avatar pv-avatar--xs" /><Bar w={`${50 + ((i * 13) % 40)}%`} h={5} tone={3} /></span>)}</div></Screen>
    case 'like-icon': return <div className="pv-center py-like"><span>♡</span><span className="on">♥</span><b>129</b></div>
    case 'bell-icon': return <div className="pv-center"><span className="px-iconbig py-bell"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" /></svg><em className="pv-badge pv-badge--dot" /></span></div>
    case 'search-icon': return <div className="pv-center"><span className="py-sx"><svg viewBox="0 0 24 24" width="22" height="22" style={SV}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg><em>빵 찾기</em></span></div>
    case 'default-avatar': return <div className="pv-center"><span className="py-dav"><i /><b /></span><span className="pv-avatar">몽</span></div>
    case 'cart-icon': return <div className="pv-center"><span className="px-iconbig py-cart"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 4h2l2 11h11l2-8H6.5M9 20h.01M17 20h.01" /></svg><em className="pv-badge">3</em></span></div>
    case 'trash-icon': return <div className="pv-center"><span className="px-iconbig py-trash"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path className="lid" d="M4 7h16M10 4h4" /><path d="M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg></span></div>
    case 'edit-icon': return <div className="pv-center"><span className="py-edit">김몽글<svg viewBox="0 0 24 24" width="16" height="16" style={SV}><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" /></svg></span></div>
    case 'logout-icon': return <div className="pv-center"><span className="px-iconbig py-lo"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M10 4H5v16h5" /><path className="ar" d="M14 8l4 4-4 4M18 12H9" /></svg></span></div>
    case 'prompt-template': return <div className="py-pt">{([['✉', '메일 쓰기', '[누구]에게'], ['≡', '요약하기', '[3줄]로'], ['✎', '다듬기', '[말투]로']] as const).map(([i, t, s]) => <span key={t}><em>{i}</em><b>{t}</b><small>{s}</small></span>)}</div>
    case 'agent-handoff': return <div className="pv-form pv-chat"><span className="pv-bubble">환불은 상담원이 도와드릴게요.</span><span className="py-ho"><i className="pv-spin" /> 상담원 연결 중 · 대기 2명</span><span className="py-agent pv-pop"><span className="pv-avatar pv-avatar--xs">지</span>상담원 지민이 들어왔어요</span></div>
    case 'creativity-slider': return <div className="pv-form"><small>답 스타일</small><span className="py-cr"><b /></span><div className="py-crl"><small>정확하게</small><small>창의적으로</small></div></div>
    case 'answer-compare': return <div className="pv-center py-cmp2"><span><Bar w="90%" h={4} tone={3} /><Bar w="70%" h={4} tone={3} /><Bar w="80%" h={4} tone={3} /><b>답 1</b></span><span className="on"><Bar w="80%" h={4} tone={3} /><Bar w="90%" h={4} tone={3} /><Bar w="60%" h={4} tone={3} /><b>✓ 이게 더 나아요</b></span></div>
    case 'ai-badge': return <div className="py-aib"><span>◇ AI로 만들었어요</span></div>
    case 'ai-persona': return <div className="pv-center py-per">{([['🎓', '선생님'], ['🧁', '빵 친구'], ['🗂', '비서']] as const).map(([e, t], i) => <span key={t} className={i === 1 ? 'on' : ''}><em>{e}</em>{t}</span>)}</div>
    case 'comparison-prevention': return <div className="pv-center py-cpv"><span><b>9,900원</b><small>3개 + 1</small></span><span><b>월 3,300원</b><small>12개월 약정</small></span><span><b>100g 1,980</b><small>묶음</small></span></div>
    case 'loot-box': return <div className="pv-center pv-col py-loot"><span className="box">?</span><small>전설 등급 확률 <b>0.5%</b></small><span className="pv-btn">10회 뽑기 · 9,900원</span></div>
    case 'obstruction': return <div className="pv-center pv-col py-obs"><div>{[1, 2, 3, 4, 5, 6, 7].map((n) => <i key={n} className={n < 3 ? 'on' : ''}>{n}</i>)}</div><small>해지 2 / 7단계: 정말 떠나실 건가요?</small><span className="pv-btn">다음</span></div>
    case 'virtual-currency': return <div className="pv-center pv-col py-gem"><b>💎 980</b><small>= 실제로는 약 14,000원</small><span className="pv-btn">구매</span></div>
    case 'glitch': return <div className="py-glitch"><b data-t="ERROR">ERROR</b></div>
    case 'line-art': return <div className="pv-center"><svg viewBox="0 0 120 80" width="150" height="100" style={{ fill: 'none', stroke: 'var(--ss-text-strong)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path className="py-draw" d="M10 60 Q30 30 60 32 Q90 30 110 60 Z M30 50 Q40 44 48 50 M56 46 Q64 40 72 46 M80 50 Q88 44 96 50 M20 70 H100" /></svg></div>
    case '3d-render': return <div className="pv-center"><span className="py-3d" /></div>
    case 'art-deco': return <div className="py-deco"><i /><b>GRAND</b></div>
    case 'collage': return <div className="py-col"><i className="a" /><i className="b" /><i className="c" /><b>빵 축제</b></div>
    case 'kawaii': return <div className="py-kw"><span className="face"><i /><i /><b /></span><span className="pv-btn">좋아요!</span></div>
    case 'coupon-card': return <div className="py-coupon"><div><b>3,000원</b><small>2만 원 이상 · 오늘까지</small></div><span>받기 ⇩</span></div>
    case 'popular-badge': return <div className="pv-center py-plan"><span><small>기본</small><b>4,900</b></span><span className="on"><em>가장 인기</em><small>프로</small><b>9,900</b></span><span><small>팀</small><b>19,900</b></span></div>
    case 'free-gift': return <div className="pv-center pv-col py-gift"><span className="box">🎁</span><b>지금 사면 머그컵 증정</b><small>선착순 100명</small></div>
    case 'reward-points': return <div className="pv-form py-pt2"><span>결제 금액 <b>35,000원</b></span><span className="earn">적립 예정 <b>+350P</b></span><small>모은 포인트 2,140P</small></div>
    case 'error-page': return <div className="pv-center pv-col"><span className="pv-bigicon py-warn">⚠</span><b>잠시 문제가 생겼어요</b><span className="pv-btn">다시 시도</span><small>오류 번호 E-502</small></div>
    case 'login-required': return <Screen><div className="py-blur"><Lines n={5} /></div><div className="py-lr pv-pop"><b>로그인하고 댓글 보기</b><span className="pv-btn">로그인</span></div></Screen>
    case 'signal-strength': return <div className="pv-center py-sig"><span>{[8, 14, 20, 26].map((h, i) => <i key={i} style={{ height: h }} className={i < 3 ? 'on' : ''} />)}</span><small>연결 좋음</small></div>
    case 'verified-badge': return <div className="pv-center"><span className="py-ver"><span className="pv-avatar">몽</span><b>몽글 베이커리</b><i>✓</i></span></div>
    case 'viewer-count': return <div className="pv-center"><span className="py-vc"><i />지금 <b>12명</b>이 보고 있어요</span></div>
    case 'unread-divider': return <div className="pv-form px-dd2"><span className="pv-bubble">어제 빵 맛있었어요</span><em className="py-ud">새 메시지 3</em><span className="pv-bubble">오늘도 가요?</span></div>
    case 'scroll-hint': return <Screen><div className="py-sh"><Bar w="60%" h={8} tone={4} /><Bar w="40%" h={5} tone={3} /></div><b className="py-chev">⌄</b></Screen>
    case 'review-tags': return <div className="pv-form py-poll">{([['맛있어요', 82], ['포장이 꼼꼼해요', 54], ['양이 많아요', 40]] as const).map(([t, p]) => <span key={t} className="on"><i style={{ width: `${p}%` }} /><em>{t}</em><small>{p}%</small></span>)}</div>
    case 'helpful-vote': return <div className="pv-form"><span className="py-star">★★★★★</span><span>빵이 정말 부드러워요. 또 살게요!</span><span className="pv-chip pv-chip--sm py-help">👍 도움돼요 <b>24</b></span></div>
    case 'level-up': return <div className="pv-center pv-col py-lv"><span className="ring"><b>5</b></span><b>레벨 5 달성!</b><span className="pv-progress"><i /></span></div>
    case 'sent-plane': return <div className="pv-center pv-col py-plane"><svg viewBox="0 0 24 24" width="34" height="34" style={{ ...SV, stroke: 'var(--md-primary)' }}><path d="M3 11l18-7-7 18-2-8z M12 14l9-10" /></svg><b>보냈어요</b></div>
    case 'referral': return <div className="pv-center pv-col py-ref"><div><span className="pv-avatar">나</span><b>＋</b><span className="pv-avatar pv-avatar--2">친</span></div><b>둘 다 3,000원 받아요</b><span className="pv-btn">초대 링크 보내기</span></div>
    case 'embed-code': return <div className="pv-form"><b>퍼가기</b><code className="py-code">{'<iframe src="mongle.tv/v/12">'}</code><span className="pv-btn">코드 복사</span></div>
    case 'container-transform': return <Screen head={false} className="py-ct"><div className="g">{[0, 1, 2, 3].map((i) => <i key={i} />)}</div><div className="big"><i /><Lines n={2} /></div></Screen>
    case 'karaoke-text': return <div className="pv-center"><b className="py-kara" data-t="갓 구운 빵 냄새">갓 구운 빵 냄새</b></div>
    case 'mask-reveal': return <div className="pv-center pv-col py-mr"><span><b>매일 아침</b></span><span><b>새로 구워요</b></span></div>
    case 'odometer': return <div className="pv-center py-odo">{([[1, 2], [2, 3], [8, 0]] as const).map(([a, b], i) => <span key={i}><i>{a}<br />{b}</i></span>)}<b>명</b></div>
    case 'underline-draw': return <div className="pv-center py-ul"><span>소개</span><span className="on">메뉴</span><span>오시는 길</span></div>
    case 'cooldown-button': return <div className="pv-center pv-col"><span className="pv-btn py-cool"><i /><span>다시 받기 0:42</span></span><small>인증번호를 보냈어요</small></div>
    case 'double-confirm-button': return <div className="pv-center"><span className="pv-btn pv-btn--ghost">삭제</span><span className="px-arrow">→</span><span className="pv-btn px-danger py-dbl">정말 삭제?</span></div>
    case 'profile-completion': return <div className="pv-form"><span className="py-pcl"><b>프로필 60%</b><small>사진만 넣으면 80%</small></span><span className="pv-progress"><i /></span><span className="pv-chip pv-chip--sm py-help">＋ 사진 넣기</span></div>
    case 'waitlist': return <div className="pv-center pv-col py-wl"><small>내 대기 순번</small><b>1,204번</b><span className="pv-chip pv-chip--sm">친구 1명 초대하면 100칸 앞으로</span></div>
    case 'invite-code': return <div className="pv-center pv-col"><small>초대 코드</small><div className="py-ic">{'MONGLE'.split('').map((c, i) => <span key={i} className={i < 4 ? 'on' : ''}>{i < 4 ? c : ''}</span>)}</div></div>
    case 'calendar-agenda': return <div className="pv-form py-ag">{([['17', '월', '빵 수업 2시'], ['18', '화', '재료 주문'], ['20', '목', '성수점 오픈']] as const).map(([d, w, t], i) => <span key={d}><b>{d}<small>{w}</small></b><em className={i === 0 ? 'on' : ''}>{t}</em></span>)}</div>
    case 'recurrence-picker': return <div className="pv-center pv-col"><span className="pv-chip">매주 ⌄</span><div className="py-days">{['일', '월', '화', '수', '목', '금', '토'].map((d, i) => <span key={d} className={i === 1 || i === 3 ? 'on' : ''}>{d}</span>)}</div></div>
    case 'timezone-picker': return <div className="pv-form py-tz">{([['서울', '오후 2:00', 'on'], ['런던', '오전 5:00', ''], ['뉴욕', '오전 0:00', 'night']] as const).map(([c, t, k]) => <span key={c} className={k}><b>{c}</b><em>{t}</em></span>)}</div>
    case 'expandable-row': return <div className="pv-form py-er"><span>주문 #1024 <b>⌃</b></span><div><small>소금빵 × 2</small><small>크루아상 × 1</small><small>배송 중</small></div><span>주문 #1023 <b>⌄</b></span></div>
    case 'bulk-action-bar': return <Screen head={false}><div className="pv-form py-bulk">{[1, 1, 0, 1].map((on, i) => <span key={i}><i className={`px-cb${on ? ' on' : ''}`}>{on ? '✓' : ''}</i><Bar w={`${55 + i * 8}%`} h={5} tone={3} /></span>)}</div><div className="py-bab"><b>3개 선택</b><span>이동</span><span>삭제</span></div></Screen>
    case 'gantt': return <div className="py-gantt">{([['기획', 0, 30], ['디자인', 20, 40], ['개발', 45, 45], ['출시', 88, 12]] as const).map(([t, s, w]) => <span key={t}><small>{t}</small><i><b style={{ left: `${s}%`, width: `${w}%` }} /></i></span>)}</div>
    case 'org-chart': return <div className="py-org"><span className="top">대표</span><i className="v" /><i className="h" /><div><span>빵</span><span>음료</span><span>배달</span></div></div>
    case 'mind-map': return <div className="py-mm"><svg viewBox="0 0 220 130" width="220" height="130"><path className="py-draw" d="M110 65 C80 65 70 30 40 28 M110 65 C80 65 70 100 40 102 M110 65 C140 65 150 30 180 28 M110 65 C140 65 150 100 180 102" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 2, opacity: 0.5 }} /></svg><b className="c">새 메뉴</b><span className="a">소금빵</span><span className="b">음료</span><span className="d">포장</span><span className="e">가격</span></div>
    case 'activity-rings': return <div className="pv-center"><svg viewBox="0 0 100 100" width="100" height="100" className="py-rings">{([[42, '#e5484d', 80], [32, '#22c55e', 60], [22, '#3e7bfa', 90]] as const).map(([r, c, p]) => <g key={r}><circle cx="50" cy="50" r={r} style={{ fill: 'none', stroke: c, strokeWidth: 8, opacity: 0.18 }} /><circle cx="50" cy="50" r={r} pathLength={100} transform="rotate(-90 50 50)" style={{ fill: 'none', stroke: c, strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: `${p} 100` }} /></g>)}</svg></div>
    case 'choropleth': return <div className="py-chor">{[2, 4, 1, 3, 4, 2, 1, 3, 2, 4, 3, 1].map((l, i) => <i key={i} className={`l${l}`} />)}</div>
    case 'outline-text': return <div className="pv-center pv-col py-ot"><b>BREAD</b><b className="f">BREAD</b></div>
    case 'emphasis-dot': return <div className="pv-center"><p className="py-ed">반죽은 <em>꼭</em> 하루 쉬어요</p></div>
    case 'search-overlay': return <Screen head={false}><Lines n={4} /><div className="py-so"><span className="pv-input pv-input--focus">⌕ 빵<i className="pv-caret" /></span><small>최근 검색</small><span className="pv-row2"><span className="pv-chip pv-chip--sm">소금빵</span><span className="pv-chip pv-chip--sm">베이글</span></span></div></Screen>
    case 'sticky-filter-bar': return <Screen head={false}><div className="py-sfb"><span className="pv-chip pv-chip--sm px-on">추천순 ⌄</span><span className="pv-chip pv-chip--sm">가격</span><span className="pv-chip pv-chip--sm">무료배송</span></div><div className="py-sfl"><Lines n={6} /></div></Screen>
    case 'search-tabs': return <Screen head={false}><div className="pv-head"><span>⌕ 소금빵</span></div><div className="py-stb">{['전체', '이미지', '상품', '지도'].map((t, i) => <span key={t} className={i === 2 ? 'on' : ''}>{t}</span>)}</div><div className="py-sti">{[0, 1, 2].map((i) => <i key={i} />)}</div></Screen>
    case 'zero-query': return <div className="pv-form"><span className="pv-input pv-input--focus">무엇을 찾으세요?<i className="pv-caret" /></span><small>요즘 많이 찾는</small><div className="pv-row2 py-wrap"><span className="pv-chip pv-chip--sm">#소금빵</span><span className="pv-chip pv-chip--sm">#비건</span><span className="pv-chip pv-chip--sm">#선물</span></div></div>
    case 'tracking-permission': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop py-trk"><b>활동 추적을 허용할까요?</b><small>맞춤 광고에 쓰여요</small><span className="py-tb">추적 안 함</span><span className="py-tb">허용</span></div></Screen>
    case 'paste-permission': return <Screen><Lines n={2} /><div className="py-paste pv-drop">📋 몽글 앱이 복사한 내용을 붙여넣었어요</div></Screen>
    case 'stacking-cards': return <div className="py-stk">{['#f1d9b8', '#cfe0d0', '#d6dcef'].map((c, i) => <i key={c} style={{ background: c }}>{['굽고', '포장하고', '배달해요'][i]}</i>)}</div>
    case 'scroll-pin': return <Screen><div className="py-pin"><div>{['#f1d9b8', '#cfe0d0', '#f2cbc3', '#d6dcef'].map((c) => <i key={c} style={{ background: c }} />)}</div></div><b className="py-pinh">↓ 내리면 →</b></Screen>
    case 'scroll-zoom': return <Screen><div className="py-sz"><i /></div></Screen>
    case 'hub-and-spoke': return <div className="py-hub"><b>홈</b>{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ rotate: `${i * 60}deg` }}><span /></i>)}</div>
    case 'asymmetric': return <div className="py-asym"><i className="a" /><i className="b" /><b>NEW</b><span><Bar w={60} h={5} tone={3} /><Bar w={40} h={5} tone={3} /></span></div>
    case 'sticky-sidebar': return <Screen><div className="py-ss"><div className="body"><Lines n={8} /></div><div className="side"><b>12,000원</b><span className="pv-btn">구매</span></div></div></Screen>
    case 'full-bleed': return <Screen head={false}><div className="py-fb" /><div className="py-fbt"><Bar w="70%" h={6} tone={4} /><Bar w="50%" h={4} tone={3} /></div></Screen>
    case 'email-sent': return <div className="pv-center pv-col"><span className="pv-bigicon">✉️</span><b>메일함을 확인해 주세요</b><small>mon***@mail.com 으로 보냈어요</small><u className="pz-link">다시 보내기</u></div>
    case 'rate-limit': return <div className="pv-form"><span className="pv-input pv-input--err">인증번호 6자리</span><span className="pv-err">너무 자주 요청했어요. 30초 뒤 다시 해 주세요.</span></div>
    case 'inline-confirm': return <div className="pv-form px-reo"><span><i>⠿</i>반죽 만들기</span><span className="pz-confirm">정말 지울까요? <b>취소</b><b className="d">지우기</b></span><span><i>⠿</i>굽기</span></div>
    case 'snooze': return <div className="pz-noti"><b>재료 주문하기</b><small>오후 3:00</small><div className="pv-row2"><span className="pv-chip pv-chip--sm">10분 뒤</span><span className="pv-chip pv-chip--sm">1시간 뒤</span><span className="pv-chip pv-chip--sm">내일</span></div></div>
    case 'undo-countdown': return <Screen><Lines /><div className="pv-toast pv-toast--wide pz-undo">메일을 보냈어요 <b>실행 취소</b><i /></div></Screen>
    case 'download-progress': return <div className="pv-form"><b>여행영상.mp4</b><span className="pv-progress"><i /></span><small>12MB / 40MB · 1분 남음</small></div>
    case 'buffering': return <div className="pz-video"><i className="pv-spin" /><span><i className="a" /><i className="b" /></span></div>
    case 'user-picker': return <div className="pv-form"><span className="pv-input pv-input--focus">하<i className="pv-caret" /></span><div className="pv-list"><span className="on"><span className="pv-avatar pv-avatar--xs">하</span>하늘 · 디자인</span><span><span className="pv-avatar pv-avatar--xs pv-avatar--2">한</span>한결 · 개발</span></div></div>
    case 'tree-select': return <div className="pv-form pz-tree"><span>▾ 📁 레시피</span><span className="in on">📁 빵</span><span className="in">📁 케이크</span><span>▸ 📁 사진</span></div>
    case 'emoji-slider': return <div className="pv-center pv-col pz-emo"><span className="big">🙂</span><span className="pv-slider"><i /></span></div>
    case 'hold-to-record': return <div className="pv-center pz-rec"><small>‹ 밀어서 취소</small><b>0:07</b><span className="mic">🎙</span></div>
    case 'password-rules': return <div className="pv-form pz-rules"><span className="pv-input pv-input--focus">●●●●●●●●</span><span className="ok">✓ 8자 이상</span><span className="ok">✓ 숫자 포함</span><span>○ 특수문자 포함</span></div>
    case 'password-confirm': return <div className="pv-form"><small>비밀번호</small><span className="pv-input">●●●●●●●●</span><small>다시 입력</small><span className="pv-input pv-input--focus">●●●●●●●●</span><small className="py-ok">✓ 일치해요</small></div>
    case 'availability-check': return <div className="pv-form"><small>아이디</small><span className="pv-input pv-input--focus">mongle_bakery<i className="pv-caret" /></span><small className="py-ok">✓ 사용할 수 있어요</small></div>
    case 'auto-grow-textarea': return <div className="pv-form"><span className="pv-textarea pz-grow">빵이 정말 부드럽고<br />버터 향이 진해요<i className="pv-caret" /></span></div>
    case 'barcode-scan': return <div className="py-cam pz-scan"><span><i /></span></div>
    case 'location-picker': return <div className="px-map pz-locp"><b className="pin">📍</b><span>서울 성동구 성수이로 12</span></div>
    case 'sticky-subnav': return <Screen><div className="pz-subnav"><span className="on">상품정보</span><span>리뷰 128</span><span>문의</span></div><Lines n={4} /></Screen>
    case 'wizard-footer': return <Screen><Lines /><div className="pz-wiz"><span className="pv-btn pv-btn--ghost">이전</span><small>2 / 4</small><span className="pv-btn">다음</span></div></Screen>
    case 'anchor-tabs': return <Screen head={false}><div className="pz-subnav"><span>사진</span><span className="on">위치</span><span>후기</span></div><div className="pz-scrollto"><Lines n={6} /></div></Screen>
    case 'side-sheet': return <Screen className="pv-dim"><Lines /><div className="pz-side"><b>필터</b><span className="pv-chip pv-chip--sm">무료배송</span><span className="pv-chip pv-chip--sm">오늘 도착</span><span className="pv-btn">적용</span></div></Screen>
    case 'faq': return <div className="pv-form pz-faq"><span><b>Q</b> 배송은 언제 오나요?</span><p><b>A</b> 오후 2시 전 주문은 오늘 출발해요.</p><span><b>Q</b> 환불할 수 있나요?</span></div>
    case 'board-list': return <div className="pz-board">{([['공지', '11월 휴무 안내', '관리자'], ['128', '소금빵 맛집 추천', '하늘'], ['127', '오븐 온도 질문', '지민']] as const).map(([n, t, w]) => <span key={n} className={n === '공지' ? 'notice' : ''}><em>{n}</em><b>{t}</b><small>{w}</small></span>)}</div>
    case 'review-photos': return <div className="pv-form"><b>사진 리뷰 42</b><div className="py-pgu">{['#f1d9b8', '#cfe0d0', '#f2cbc3'].map((c) => <i key={c} style={{ background: c }} />)}<span className="add">+38</span></div><span className="py-star">★★★★★ 4.8</span></div>
    case 'option-sheet': return <Screen className="pv-dim"><Lines /><div className="pz-opt"><span className="pv-input">사이즈: M ⌄</span><div className="pv-row2"><span className="pv-chip pv-chip--sm">− 2 +</span><b>7,000원</b></div><span className="pv-btn">장바구니 담기</span></div></Screen>
    case 'cart-item': return <div className="pz-cart"><i className="px-cb on">✓</i><span className="img" /><div><b>버터 소금빵</b><small>3,500원</small><span className="pv-chip pv-chip--sm">− 2 +</span></div><em>✕</em></div>
    case 'order-summary': return <div className="pv-form pz-sum"><span>상품 금액 <b>14,000원</b></span><span>배송비 <b>0원</b></span><span className="disc">쿠폰 할인 <b>−3,000원</b></span><span className="tot">합계 <b>11,000원</b></span></div>
    case 'address-card': return <div className="pz-addr"><span><b>집</b><em>기본 배송지</em><u>변경</u></span><small>서울 성동구 성수이로 12, 3층</small><small>010-1234-5678</small></div>
    case 'event-card': return <div className="pz-event"><span className="d"><small>NOV</small><b>22</b></span><div><b>빵 굽기 원데이 클래스</b><small>토 14:00 · 성수점</small></div></div>
    case 'article-card': return <div className="pv-form">{[0, 1].map((i) => <span key={i} className="pz-art"><span><b>{['겨울 빵 트렌드 5가지', '버터가 비싸진 이유'][i]}</b><small>몽글 매거진 · {i + 2}시간 전</small></span><i /></span>)}</div>
    case 'numbered-steps': return <div className="pv-form pz-num">{['반죽을 섞어요', '1시간 쉬어요', '200도에 구워요'].map((t, i) => <span key={t}><em>{i + 1}</em>{t}</span>)}</div>
    case 'pros-cons': return <div className="pv-center pz-pc"><div className="g"><b>좋아요</b><span>✓ 부드러움</span><span>✓ 버터 향</span></div><div className="r"><b>아쉬워요</b><span>✗ 금방 품절</span><span>✗ 가격</span></div></div>
    case 'hover-zoom': return <div className="pv-center"><span className="pz-hz"><i /></span></div>
    case 'shortcut-sheet': return <div className="pz-keys"><b>단축키</b>{([['찾기', '/'], ['새 글', 'C'], ['저장', '⌘S']] as const).map(([t, k]) => <span key={t}>{t}<span className="pv-kbd">{k}</span></span>)}</div>
    case 'swipe-up-more': return <div className="pv-phone pz-up"><b>⌃</b><small>위로 밀어 더 보기</small></div>
    case 'overscroll-glow': return <Screen head={false}><span className="pz-glow" /><Lines n={5} /></Screen>
    case 'hover-video': return <div className="pz-hv"><i className="pv-player-bar" /><span>▶ 미리보기</span></div>
    case 'home-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" /></svg></span></div>
    case 'download-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg></span></div>
    case 'upload-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 20V9M7 14l5-5 5 5M5 4h14" /></svg></span></div>
    case 'plus-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 5v14M5 12h14" /></svg></span></div>
    case 'check-circle': return <div className="pv-center"><span className="px-iconbig" style={{ color: 'var(--ss-success)' }}><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg></span></div>
    case 'warning-icon': return <div className="pv-center"><span className="px-iconbig" style={{ color: '#d97706' }}><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 4L2.5 20h19zM12 10v4M12 17h.01" /></svg></span></div>
    case 'eye-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM4 4l16 16" /></svg></span></div>
    case 'lock-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg></span></div>
    case 'chat-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 5h16v11H9l-5 4z" /></svg><em className="pv-badge">5</em></span></div>
    case 'location-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg></span></div>
    case 'camera-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg></span></div>
    case 'image-generating': return <div className="pv-center"><span className="pz-gen" /></div>
    case 'ai-diff': return <div className="pv-form"><span className="pz-diff">빵이 <s>엄청 진짜</s> <ins>정말</ins> 맛있어요</span><div className="pv-row2"><span className="pv-btn pv-btn--ghost">되돌리기</span><span className="pv-btn">받아들이기</span></div></div>
    case 'voice-transcript': return <div className="pv-form"><span className="pz-rec-dot">● 듣는 중 0:12</span><p className="pz-trans">내일 오후 두 시에 성수점에서 만나기로 했어요<i className="pv-caret" /></p></div>
    case 'deep-research': return <div className="pv-form"><b>빵값이 오른 이유 조사 중</b><span className="pv-progress"><i /></span><div className="pv-row2 py-wrap">{['통계청', '뉴스', '논문', '+15'].map((t) => <span key={t} className="pv-chip pv-chip--sm">{t}</span>)}</div></div>
    case 'ai-overview': return <Screen head={false}><div className="pv-head"><span>⌕ 소금빵 칼로리</span></div><div className="pz-aio"><small>◇ AI 요약</small><Bar w="90%" h={4} tone={3} /><Bar w="70%" h={4} tone={3} /><span className="pv-chip pv-chip--sm">출처 3</span></div></Screen>
    case 'computer-use': return <Screen><Lines /><span className="pz-aicur"><i />AI</span><span className="pz-aibar">◇ 예약 칸을 채우는 중 · <u>멈추기</u></span></Screen>
    case 'translate-toggle': return <div className="pv-form"><span className="pv-chip pv-chip--sm px-on">文A 번역됨 · 원문 보기</span><span className="pv-bubble">이 빵 정말 맛있어요!</span><small>원문: This bread is amazing!</small></div>
    case 'rating-nag': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>별 5개 주실 거죠? 🥺</b><span className="py-star">★★★★★</span><small>나중에 (또 물어볼게요)</small></div></Screen>
    case 'fine-print': return <div className="pv-center pv-col pz-fine"><b>첫 달 무료!</b><span className="pv-btn">지금 시작</span><small>* 2개월째부터 월 29,900원 자동 결제되며 해지는 고객센터 전화로만 가능합니다</small></div>
    case 'fake-discount': return <div className="pv-center pv-col pz-fake"><s>99,000원</s><b><em>70%</em> 29,900원</b><small>365일 같은 할인</small></div>
    case 'default-public': return <div className="pv-form"><span className="pv-input">내 운동 기록</span><span className="pz-pub">🌐 전체 공개 ⌄</span><small>(설정 › 개인정보 › 공개 범위에서 바꿀 수 있어요)</small></div>
    case 'retro-terminal': return <div className="pz-term"><span>&gt; bake --bread salt</span><span>baking... 100%</span><span>&gt; <i className="pv-caret" /></span></div>
    case 'riso': return <div className="pz-riso"><b className="a">BREAD</b><b className="b">BREAD</b></div>
    case 'paper': return <div className="pv-center"><div className="pz-paper"><b>오늘의 레시피</b><Bar w="90%" h={4} tone={3} /><Bar w="70%" h={4} tone={3} /></div></div>
    case 'wireframe-style': return <div className="pv-center"><div className="pz-wire"><i /><b>소금빵</b><span>담기</span></div></div>
    case 'gradient-border': return <div className="pv-center"><div className="pz-gb"><b>프로</b><small>월 9,900원</small></div></div>
    case 'pastel': return <div className="pv-center pz-pastel">{['#fbd5df', '#cde7f5', '#d5f0e3', '#fdf1c7'].map((c) => <i key={c} style={{ background: c }} />)}</div>
    case 'chrome-type': return <div className="pz-chrome"><b>MONGLE</b></div>
    case 'flash-sale': return <div className="pv-form"><span className="pz-flash">⚡ 타임 세일 <b>02:14:09</b></span><span className="pz-art"><span><b>소금빵 10개 세트</b><small><s>35,000</s> 24,500원</small></span><i /></span></div>
    case 'price-drop-alert': return <div className="pv-form"><b>버터 소금빵</b><small>지금 3,500원</small><span className="pv-btn">🔔 내려가면 알려 주세요</span></div>
    case 'cashback': return <div className="pv-center pv-col"><span className="pv-chip pz-cb">💸 1,200원 돌려받기</span><small>결제 금액 12,000원의 10%</small></div>
    case 'subscription-pause': return <div className="pv-form"><b>떠나기 전에</b><span className="pv-btn">한 달 쉬기</span><span className="pv-btn pv-btn--ghost">해지하기</span></div>
    case 'diary-study': return <div className="pv-form">{['1일차 · 아침에 빵 주문', '3일차 · 쿠폰 못 찾음', '7일차 · 정기배송 시작'].map((t) => <span key={t} className="pz-diary">{t}</span>)}</div>
    case 'tree-test': return <div className="pv-form pz-tree"><small>‘환불 신청’은 어디에 있을까요?</small><span>▸ 내 정보</span><span className="on">▾ 주문 내역</span><span className="in">반품 · 환불</span></div>
    case 'eye-tracking': return <Screen><Lines /><svg viewBox="0 0 180 100" className="pz-eye"><polyline points="30,30 120,24 60,60 140,70" style={{ fill: 'none', stroke: '#e5484d', strokeWidth: 1.5, opacity: 0.7 }} />{([[30, 30, 9], [120, 24, 6], [60, 60, 11], [140, 70, 7]] as const).map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} style={{ fill: 'rgba(229,72,77,.3)', stroke: '#e5484d' }} />)}</svg></Screen>
    case 'guerrilla-test': return <div className="pv-center pv-col"><span className="pv-bigicon">☕📱</span><b>5분만 써 봐 주실래요?</b><small>음료 쿠폰 드려요</small></div>
    case 'deleted-content': return <div className="pv-form px-dd2"><span className="pv-bubble">소금빵 어디서 사요?</span><em className="px-sys">삭제된 댓글이에요</em><span className="pv-bubble r">성수점이요!</span></div>
    case 'last-seen': return <div className="pv-center"><span className="py-ver"><span className="pv-avatar">하</span><span className="pz-ls"><b>하늘</b><small>5분 전 활동</small></span></span></div>
    case 'beta-badge': return <div className="pv-form px-new"><span>사진으로 찾기 <em className="pz-beta">BETA</em></span><span>주문 내역</span><span>설정</span></div>
    case 'like-ratio': return <div className="pv-form"><div className="pv-row2"><b>👍 1.2천</b><b>👎 98</b></div><span className="pv-progress"><i style={{ width: '92%' }} /></span></div>
    case 'streak-calendar': return <div className="pz-stamp">{Array.from({ length: 14 }, (_, i) => <i key={i} className={[1, 2, 3, 5, 6, 8, 9, 10, 12].includes(i) ? 'on' : ''}>{i + 1}</i>)}</div>
    case 'badge-earned': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><span className="pz-medal">🥐</span><b>첫 주문 배지!</b><small>3개 더 모으면 단골 배지</small></div></Screen>
    case 'nearby-share': return <div className="pv-center pz-near"><i className="r" /><span className="pv-avatar">나</span><span className="pv-avatar pv-avatar--2 a">하</span><span className="pv-avatar pv-avatar--3 b">지</span></div>
    case 'circle-reveal': return <div className="pz-circ"><i /></div>
    case 'page-curl': return <div className="pv-center"><div className="pz-curl"><Lines n={4} /><i /></div></div>
    case 'layout-animation': return <div className="pz-lay">{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>
    case 'letter-bounce': return <div className="pv-center pz-bounce">{'반가워요!'.split('').map((c, i) => <b key={i} style={{ animationDelay: `${i * 0.08}s` }}>{c}</b>)}</div>
    case 'text-wave': return <div className="pv-center pz-wave">{'굽는 중…'.split('').map((c, i) => <b key={i} style={{ animationDelay: `${i * 0.1}s` }}>{c}</b>)}</div>
    case 'button-badge': return <div className="pv-center"><span className="pv-btn pv-btn--lg pz-bb">장바구니<em className="pv-badge">3</em></span></div>
    case 'progress-button': return <div className="pv-center"><span className="px-hold pz-pb"><i /><span>올리는 중 64%</span></span></div>
    case 'welcome-back': return <div className="pv-center pv-col"><b>몽글님, 다시 반가워요 👋</b><small>지난번 보던 레시피</small><span className="pv-btn">이어 보기</span></div>
    case 'account-type': return <div className="pv-center px-rcard"><span className="on"><i />개인<small>빵 사러 왔어요</small></span><span><i />사업자<small>빵을 팔아요</small></span></div>
    case 'week-strip': return <div className="pz-week">{['월', '화', '수', '목', '금', '토', '일'].map((d, i) => <span key={d} className={i === 2 ? 'on' : ''}><small>{d}</small><b>{17 + i}</b></span>)}</div>
    case 'time-range': return <div className="pv-form"><small>알림 받을 시간</small><span className="pv-slider pz-tr"><i className="a" /><i className="b" /></span><div className="pv-row2 pz-tr-l"><b>09:00</b><b>18:00</b></div></div>
    case 'schedule-picker': return <div className="pz-sched">{Array.from({ length: 20 }, (_, i) => <i key={i} className={[5, 6, 10, 11, 15].includes(i) ? 'on' : ''} />)}</div>
    case 'responsive-table': return <div className="pv-center pz-rt"><div className="t"><span /><span /><span /></div><b>→</b><div className="c"><i /><i /></div></div>
    case 'radial-bar': return <div className="pv-center"><svg viewBox="0 0 100 100" width="96" height="96">{([[40, 75], [30, 55], [20, 35]] as const).map(([r, p]) => <circle key={r} cx="50" cy="50" r={r} pathLength={100} transform="rotate(-90 50 50)" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeOpacity: r / 40, strokeWidth: 7, strokeLinecap: 'round', strokeDasharray: `${p} 100` }} />)}</svg></div>
    case 'histogram': return <div className="pv-center pz-hist">{[12, 26, 44, 62, 50, 30, 16, 8].map((h, i) => <i key={i} style={{ height: h }} />)}</div>
    case 'box-plot': return <div className="pv-center pz-box">{([[20, 50, 30, 70], [30, 40, 22, 60], [15, 45, 10, 75]] as const).map(([b, h, lo, hi], i) => <span key={i}><i style={{ bottom: lo, height: hi - lo }} /><b style={{ bottom: b, height: h }} /></span>)}</div>
    case 'bubble-chart': return <div className="px-scatter pz-bub">{([[20, 60, 18], [45, 40, 28], [70, 25, 14], [80, 65, 22]] as const).map(([x, y, s], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, margin: -s / 2 }} />)}</div>
    case 'fluid-type': return <div className="pv-center pz-fluid"><div className="w"><b>빵의 시간</b></div><div className="n"><b>빵의 시간</b></div></div>
    case 'middle-truncation': return <div className="pv-form pz-mid"><span>📄 여행사진_2026_제주…_최종.jpg</span><span>📄 레시피_소금빵…_v3.pdf</span></div>
    case 'instant-search': return <div className="pv-form"><span className="pv-input pv-input--focus">소금<i className="pv-caret" /></span><small>결과 12개</small><span className="pz-art"><span><b><mark>소금</mark>빵</b><small>3,500원</small></span><i /></span></div>
    case 'voice-search': return <div className="pv-center pv-col"><span className="px-wave"><b>🎙</b><span>{[6, 12, 18, 10, 22, 14, 8].map((h, i) => <i key={i} style={{ height: h }} className="on" />)}</span></span><small>‘소금빵 파는 곳’</small></div>
    case 'permission-settings': return <div className="pv-form pz-perm">{([['카메라', true], ['위치', false], ['알림', true]] as const).map(([t, on]) => <span key={t}>{t}<i className={on ? 'on' : ''} /></span>)}</div>
    case 'progress-to-top': return <Screen><Lines n={5} /><span className="pz-ptt">↑</span></Screen>
    case 'sticky-video': return <Screen><Lines n={5} /><span className="pz-mini"><b>▶</b></span></Screen>
    case 'focus-mode': return <Screen head={false} className="pz-focus"><div className="side" /><div className="main"><Lines n={4} /></div></Screen>
    case 'layers': return <div className="pz-layers">{['바탕', '카드', '팝업', '알림'].map((t, i) => <i key={t} style={{ ['--i' as string]: i }}>{t}</i>)}</div>
    case 'gutter': return <div className="pz-gut">{[0, 1, 2].map((i) => <i key={i} />)}<em className="a" /><em className="b" /></div>
    case 'breakpoints': return <div className="pz-bp"><span><i style={{ width: '30%' }} /><i style={{ width: '58%' }} /><i style={{ width: '100%' }} /></span><div><small>600</small><small>840</small><small>1200</small></div></div>
    case 'max-width-container': return <div className="pz-cont"><div><Lines n={4} /></div></div>
    case 'acknowledge-dialog': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>계정을 지울까요?</b><span className="pq-ack"><i className="px-cb on">✓</i>되돌릴 수 없다는 걸 이해했어요</span><span className="pv-btn px-danger">지우기</span></div></Screen>
    case 'progress-dialog': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>사진 옮기는 중</b><span className="pv-progress" style={{ width: '100%' }}><i /></span><small>64% · 12장 남음</small><span className="pv-btn pv-btn--ghost">취소</span></div></Screen>
    case 'error-summary': return <div className="pv-form"><div className="pq-errsum"><b>고칠 곳이 2개 있어요</b><u>· 이메일 형식이 맞지 않아요</u><u>· 약관에 동의해 주세요</u></div><span className="pv-input pv-input--err">hello@</span></div>
    case 'helper-text': return <div className="pv-form"><small>닉네임</small><span className="pv-input pv-input--focus">몽글<i className="pv-caret" /></span><small>한글 · 영어 2~10자, 나중에 바꿀 수 있어요</small></div>
    case 'required-mark': return <div className="pv-form pq-req"><small><em>*</em> 표시는 꼭 적어 주세요</small><small>이름 <em>*</em></small><span className="pv-input" /><small>회사 (선택)</small><span className="pv-input" /></div>
    case 'new-content-pill': return <Screen><Lines n={5} /><span className="pq-pill pv-drop">↑ 새 글 3개</span></Screen>
    case 'update-available': return <Screen><Lines /><div className="pv-toast pv-toast--wide pv-pop">새 버전이 있어요 <b>새로고침</b></div></Screen>
    case 'segmented-progress': return <div className="pv-form"><small>3 / 5 단계</small><span className="px-meter">{[1, 1, 1, 0, 0].map((on, i) => <i key={i} className={on ? 'on' : ''} />)}</span></div>
    case 'time-remaining': return <div className="pv-center pv-col"><b className="py-big" style={{ color: 'var(--ss-text-strong)' }}>약 2분 남음</b><span className="pv-progress" style={{ width: 160 }}><i /></span></div>
    case 'combobox': return <div className="pv-form"><span className="pv-input pv-input--focus">디자이<i className="pv-caret" /><span className="pv-chev" style={{ marginLeft: 'auto' }}>⌄</span></span><div className="pv-list pv-drop"><span className="on">디자이너</span><span>‘디자이’ 그대로 쓰기</span></div></div>
    case 'min-max-input': return <div className="pv-form"><small>가격</small><div className="pv-row2 pq-mm"><span className="pv-input">10,000</span>~<span className="pv-input pv-input--focus">50,000</span></div></div>
    case 'split-input': return <div className="pv-form"><small>주민등록번호</small><div className="pv-row2 pq-mm"><span className="pv-input">900101</span>-<span className="pv-input pv-input--focus">1●●●●●●</span></div></div>
    case 'settings-list': return <div className="pv-form pz-perm">{([['알림 받기', true], ['자동 재생', false], ['어두운 화면', true]] as const).map(([t, on]) => <span key={t}>{t}<i className={on ? 'on' : ''} /></span>)}</div>
    case 'slider-with-input': return <div className="pv-form"><small>밝기</small><div className="pv-row2 pq-sw"><span className="pv-slider"><i /></span><span className="pv-input">72</span></div></div>
    case 'image-choice': return <div className="pv-center py-pgu">{['#f1d9b8', '#cfe0d0', '#d6dcef'].map((c, i) => <i key={c} style={{ background: c, boxShadow: i === 1 ? '0 0 0 2px var(--ss-canvas), 0 0 0 4px var(--ss-accent)' : 'none' }}>{i === 1 && <em>✓</em>}</i>)}</div>
    case 'consent-detail': return <div className="pv-form px-tri"><span><i className="px-cb on">✓</i><b>[필수] 이용약관</b><u style={{ marginLeft: 'auto' }}>보기 ›</u></span><span><i className="px-cb on">✓</i><b>[필수] 개인정보</b><u style={{ marginLeft: 'auto' }}>보기 ›</u></span><span><i className="px-cb" />[선택] 광고 수신<u style={{ marginLeft: 'auto' }}>보기 ›</u></span></div>
    case 'attachment-list': return <div className="pv-form px-up"><span><b>견적서.pdf</b><small>1.2MB ✕</small></span><span><b>사진.jpg</b><small>840KB ✕</small></span></div>
    case 'unit-switch': return <div className="pv-form"><div className="pv-row2" style={{ alignItems: 'center' }}><span className="pv-input" style={{ flex: 1 }}>170</span><span className="pv-chip pv-chip--sm px-on">cm</span><span className="pv-chip pv-chip--sm">inch</span></div><small>= 5피트 7인치</small></div>
    case 'conditional-field': return <div className="pv-form"><span className="pv-input">알게 된 곳: 기타 ⌄</span><span className="pv-input pv-input--focus pv-drop">직접 적어 주세요<i className="pv-caret" /></span></div>
    case 'password-generator': return <div className="pv-form"><span className="pv-input pv-input--focus">비밀번호<i className="pv-caret" /></span><div className="pv-list pv-drop"><span className="on">🔑 튼튼한 비밀번호 쓰기 <b>kT7#vq…</b></span></div></div>
    case 'breadcrumb-collapse': return <div className="pv-center pq-crumb"><span>홈</span>›<b>…</b>›<span>빵</span>›<em>크루아상</em></div>
    case 'closable-tabs': return <Screen head={false}><div className="pq-tabs"><span className="on">레시피.md ✕</span><span>메모 ✕</span><b>＋</b></div><Lines /></Screen>
    case 'jump-to-page': return <div className="pv-center pq-jump"><span className="pv-input pv-input--focus">12</span><small>/ 40 쪽</small><span className="pv-btn">이동</span></div>
    case 'category-pills': return <div className="pv-center pv-wrap">{['전체', '빵', '케이크', '음료', '선물'].map((t, i) => <span key={t} className={`pv-chip${i === 1 ? ' px-on' : ''}`}>{t}</span>)}</div>
    case 'mega-footer': return <div className="pq-foot">{[0, 1, 2].map((c) => <div key={c}><b>{['쇼핑', '고객센터', '회사'][c]}</b>{[60, 48, 54].map((w, i) => <Bar key={i} w={w} h={4} tone={3} />)}</div>)}</div>
    case 'vertical-steps': return <div className="pv-form pq-vs">{['정보 입력', '본인 확인', '결제'].map((t, i) => <span key={t} className={i === 1 ? 'now' : i < 1 ? 'done' : ''}><i>{i < 1 ? '✓' : i + 1}</i>{t}</span>)}</div>
    case 'stat-group': return <div className="pv-center pq-stats">{([['방문', '1.2만'], ['주문', '340'], ['리뷰', '98']] as const).map(([t, n]) => <span key={t}><small>{t}</small><b>{n}</b></span>)}</div>
    case 'delta-badge': return <div className="pv-center pv-col pq-delta"><span><b>3,240만</b><em className="up">▲ 12%</em></span><span><b>1,180</b><em className="dn">▼ 3%</em></span></div>
    case 'figure-caption': return <div className="pv-form"><i className="py-art" style={{ width: '100%', height: 70 }} /><small>갓 구운 소금빵 · 사진: 몽글 베이커리</small></div>
    case 'hashtags': return <div className="pv-form"><Lines n={2} /><div className="pv-row2 py-wrap pq-tags">{['#소금빵', '#성수', '#빵지순례'].map((t) => <span key={t}>{t}</span>)}</div></div>
    case 'author-byline': return <div className="pv-form"><b style={{ fontSize: '1.2em' }}>버터가 비싸진 이유</b><span className="pq-by"><span className="pv-avatar pv-avatar--xs">몽</span>김몽글 · 11월 17일 · 5분 읽기</span></div>
    case 'related-posts': return <div className="pv-form"><small>함께 보면 좋은 글</small>{['크루아상의 결', '오븐 온도 맞추기'].map((t) => <span key={t} className="pz-art"><span><b>{t}</b></span><i /></span>)}</div>
    case 'feature-list': return <div className="pv-form pz-rules"><span className="ok">✓ 매일 아침 배달</span><span className="ok">✓ 언제든 일시정지</span><span className="ok">✓ 첫 달 무료</span></div>
    case 'logo-wall': return <div className="pq-logos">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ borderRadius: i % 2 ? '50%' : 4 }} />)}</div>
    case 'cta-banner': return <div className="pq-cta"><b>오늘 첫 빵을 받아 보세요</b><span className="pv-btn">무료로 시작</span></div>
    case 'chart-tooltip': return <div className="pv-center"><div className="pq-ct"><svg viewBox="0 0 160 70" width="160" height="70"><polyline points="0,60 30,44 60,50 90,26 120,32 160,12" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 2 }} /><circle cx="90" cy="26" r="4" style={{ fill: 'var(--md-primary)' }} /></svg><span className="pv-pop">11/17 · 340</span></div></div>
    case 'legend': return <div className="pv-center pq-legend"><span className="pq-pie" /><div><span><i style={{ background: 'var(--md-primary)' }} />빵 62%</span><span><i style={{ background: '#e6a23c' }} />음료 28%</span><span><i style={{ background: '#c8506a' }} />기타 10%</span></div></div>
    case 'chart-annotation': return <div className="pv-center"><div className="pq-ct"><svg viewBox="0 0 160 70" width="160" height="70"><polyline points="0,58 40,54 70,50 90,24 130,18 160,10" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 2 }} /><line x1="80" y1="0" x2="80" y2="70" style={{ stroke: '#e6a23c', strokeDasharray: '3 3' }} /></svg><span className="pq-flag">🚩 할인 시작</span></div></div>
    case 'sparkline-table': return <div className="pz-board">{([['소금빵', '0,12 10,8 20,10 30,4 40,2'], ['베이글', '0,4 10,6 20,5 30,10 40,12']] as const).map(([n, pts]) => <span key={n}><em /><b>{n}</b><svg viewBox="0 0 40 14" width="50" height="16"><polyline points={pts} style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 1.5 }} /></svg></span>)}</div>
    case 'slope-chart': return <div className="pv-center"><svg viewBox="0 0 120 90" width="140" height="100" className="pq-slope"><line x1="20" y1="20" x2="100" y2="60" style={{ stroke: '#c8506a', strokeWidth: 2 }} /><line x1="20" y1="60" x2="100" y2="15" style={{ stroke: 'var(--md-primary)', strokeWidth: 3 }} /><line x1="20" y1="45" x2="100" y2="40" style={{ stroke: 'var(--ss-ink-5)', strokeWidth: 2 }} /><text x="0" y="8" style={{ fontSize: 9, fill: 'currentColor' }}>작년</text><text x="92" y="8" style={{ fontSize: 9, fill: 'currentColor' }}>올해</text></svg></div>
    case 'empty-chart': return <div className="px-scatter pq-ec"><span><b>아직 기록이 없어요</b><small>첫 주문을 받으면 그려져요</small></span></div>
    case 'double-tap-zoom': return <div className="pv-center"><span className="pz-hz pq-dtz"><i /></span></div>
    case 'jiggle-mode': return <div className="pq-jig">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i}><em>−</em></i>)}</div>
    case 'error-shake': return <div className="pv-form"><span className="pv-input pv-input--err pq-shake">●●●●</span><span className="pv-err">비밀번호가 맞지 않아요</span></div>
    case 'split-pane': return <Screen head={false} className="pq-split"><div className="a"><Lines n={3} /></div><i /><div className="b"><Lines n={3} /></div></Screen>
    case 'help-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01" /></svg></span></div>
    case 'layout-icons': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg></span><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 6h16M4 12h16M4 18h16" /></svg></span></div>
    case 'mute-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M6 16V11a6 6 0 0 1 10-4.5M18 11v5l1.5 2h-12M10 20a2 2 0 0 0 4 0M4 4l16 16" /></svg></span></div>
    case 'star-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg></span></div>
    case 'user-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" /></svg></span></div>
    case 'calendar-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" /></svg></span></div>
    case 'mail-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg></span></div>
    case 'phone-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></span></div>
    case 'link-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg></span></div>
    case 'attach-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M20 11l-8 8a5 5 0 0 1-7-7l8-8a3 3 0 0 1 4 4l-8 8a1 1 0 0 1-1.5-1.5L15 7" /></svg></span></div>
    case 'send-icon': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 11l18-7-7 18-2-8zM12 14l9-10" /></svg></span></div>
    case 'icon-style': return <div className="pv-center"><span className="px-iconbig"><svg viewBox="0 0 24 24" width="28" height="28" style={SV}><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" /></svg></span><span className="px-iconbig" style={{ color: 'var(--md-primary)' }}><svg viewBox="0 0 24 24" width="28" height="28" style={{ ...SV, fill: 'currentColor' }}><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" /></svg></span></div>
    case 'citation-hover': return <div className="pv-form"><span className="pv-bubble">소금빵은 1990년대 일본에서 시작됐어요 <sup className="pq-sup">1</sup></span><span className="pq-cite pv-pop"><b>소금빵의 역사</b><small>bread.wiki</small></span></div>
    case 'ai-mode-tabs': return <div className="pv-form"><div className="pv-row2">{['묻기', '만들기', '조사'].map((t, i) => <span key={t} className={`pv-chip pv-chip--sm${i === 2 ? ' px-on' : ''}`}>{t}</span>)}</div><span className="pv-input pv-input--pill">무엇을 조사할까요?</span></div>
    case 'usage-meter': return <div className="pv-form"><small>오늘 남은 질문</small><b>12 / 40</b><span className="pv-progress"><i style={{ width: '30%' }} /></span><small>밤 12시에 다시 채워져요</small></div>
    case 'file-analysis': return <div className="pv-form pv-chat"><span className="pv-chip pv-chip--sm">📊 매출.xlsx</span><span className="py-ho"><i className="pv-spin" /> 표 3개 읽는 중…</span><span className="pv-bubble">가장 잘 팔린 건 소금빵이에요 (34%).</span></div>
    case 'ai-code-run': return <div className="pv-form"><code className="py-code">{'plot(sales, by="day")'}</code><div className="pv-center pv-bars" style={{ height: 50 }}>{[20, 34, 26, 44, 38].map((h, i) => <i key={i} style={{ height: h }} className={i === 3 ? 'on' : ''} />)}</div></div>
    case 'ai-feedback-reason': return <div className="pv-form"><span className="pv-bubble">답이 별로였나요?</span><div className="pv-row2 py-wrap">{['사실과 달라요', '너무 길어요', '엉뚱해요'].map((t, i) => <span key={t} className={`pv-chip pv-chip--sm${i === 1 ? ' px-on' : ''}`}>{t}</span>)}</div></div>
    case 'ai-refusal': return <div className="pv-form pv-chat"><span className="pv-bubble px-q">남의 비밀번호 알려 줘</span><span className="pv-bubble">그건 도와드릴 수 없어요. 대신 <b>내 비밀번호 찾기</b>를 안내할게요.</span></div>
    case 'shared-chat-link': return <div className="pv-form"><b>대화 공유</b><span className="pv-input px-inv"><span>ai.chat/s/x8Kq</span><span className="pv-btn">복사</span></span><small>🌐 링크가 있는 누구나 볼 수 있어요</small></div>
    case 'forced-app-download': return <Screen><div className="py-blur"><Lines n={5} /></div><div className="py-lr pv-pop"><b>앱에서만 볼 수 있어요</b><span className="pv-btn">앱 받기</span><small style={{ fontSize: '0.7em' }}>웹으로 계속</small></div></Screen>
    case 'cookie-wall': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>계속하려면 모두 동의해 주세요</b><span className="pv-btn">모두 동의</span><small style={{ fontSize: 'max(0.7em, 8.5px)' }}>(거절 없음)</small></div></Screen>
    case 'badge-spam': return <Screen head={false}><Lines n={4} /><div className="pv-tabbar">{['⌂', '⌕', '♡', '☺'].map((t) => <i key={t} className="pq-dot">{t}</i>)}</div></Screen>
    case 'paywall': return <Screen><Lines n={2} /><div className="py-blur"><Lines n={3} /></div><div className="py-lr pv-pop" style={{ top: '70%' }}><b>구독하고 계속 읽기</b><span className="pv-btn">월 4,900원</span></div></Screen>
    case 'tax-note': return <div className="pv-center pv-col px-pday"><b><em>9,900</em>원</b><small>부가세 포함 · 월 결제</small></div>
    case 'first-purchase-offer': return <div className="pv-center pv-col"><span className="pq-rib">첫 주문 50%</span><b>소금빵 6개 세트</b><small><s>18,000</s> 9,000원</small></div>
    case 'stock-meter': return <div className="pv-form"><small>남은 수량 <b>12개</b></small><span className="pv-progress"><i style={{ width: '18%', background: '#e5484d' }} /></span></div>
    case 'price-history': return <div className="pv-center pv-col"><svg viewBox="0 0 160 60" width="160" height="60"><polyline points="0,20 30,24 60,14 90,30 120,26 160,46" style={{ fill: 'none', stroke: 'var(--md-primary)', strokeWidth: 2 }} /><circle cx="160" cy="46" r="4" style={{ fill: '#e5484d' }} /></svg><small><b style={{ color: '#e5484d' }}>지금이 3달 중 최저가</b></small></div>
    case 'contextual-inquiry': return <div className="pv-center pv-col"><span className="pv-bigicon">👀🧑‍🍳</span><b>오븐 앞에서 같이 보며 묻기</b><small>메모: 타이머를 손으로 맞춤</small></div>
    case 'competitive-analysis': return <div className="px-cmp" style={{ gridTemplateColumns: 'auto 44px 44px 44px' }}><span /><b className="on">우리</b><b>A</b><b>B</b><span>새벽 배송</span><i className="on">✓</i><i>✓</i><i className="x">✕</i><span>구독</span><i className="on">✓</i><i className="x">✕</i><i>✓</i></div>
    case 'affinity-map': return <div className="pv-center pq-aff"><div><b>배송</b><span>늦어요</span><span>시간 몰라요</span></div><div><b>결제</b><span>쿠폰 어려움</span></div></div>
    case 'session-replay': return <Screen><Lines /><span className="pz-aicur" style={{ fontSize: 0 }}><i /></span><span className="pz-aibar">▶ 0:42 / 3:10 · 개인 정보 가림</span></Screen>
    case 'empty-cart': return <div className="pv-center pv-col"><span className="pv-bigicon">🧺</span><b>장바구니가 비었어요</b><span className="pv-btn">빵 담으러 가기</span></div>
    case 'no-notifications': return <div className="pv-center pv-col"><span className="pv-bigicon">🔕</span><b>새 알림이 없어요</b><small>알림 설정 바꾸기 ›</small></div>
    case 'progress-fraction': return <div className="pq-frac"><span>3 / 10</span></div>
    case 'recording-indicator': return <div className="pv-center"><span className="pq-rec"><i />REC 04:12</span></div>
    case 'clap': return <div className="pv-center"><span className="pq-clap">👏<em>+3</em></span><b>128</b></div>
    case 'order-complete': return <div className="pv-center pv-col"><span className="pq-okc">✓</span><b>주문했어요</b><small>주문번호 2026-1117-0042 · 내일 도착</small></div>
    case 'next-steps': return <div className="pv-form"><small>이제 이걸 해 보세요</small>{['프로필 사진 넣기', '알림 켜기'].map((t) => <span key={t} className="pz-diary">{t} ›</span>)}</div>
    case 'share-preview': return <div className="pv-form"><small>이렇게 보여요</small><span className="py-lpc"><i /><b>몽글 베이커리 소금빵</b><small>mongle.shop</small></span><span className="pv-btn">보내기</span></div>
    case 'invite-contacts': return <div className="pv-form px-tri">{['하늘', '지민', '한결'].map((n, i) => <span key={n}><i className={`px-cb${i < 2 ? ' on' : ''}`}>{i < 2 ? '✓' : ''}</i><span className="pv-avatar pv-avatar--xs">{n[0]}</span>{n}</span>)}<span className="pv-btn">2명 초대</span></div>
    case 'fade-through': return <div className="pv-center"><div className="pq-ft"><Screen><Lines /></Screen></div></div>
    case 'sheet-expand': return <Screen head={false}><Lines n={3} /><div className="pq-sx"><span className="sh-grab" /><Lines n={2} /></div></Screen>
    case 'typewriter-loop': return <div className="pv-center"><b className="pq-tl">오늘 <span>케이크를</span> 굽자<i className="pv-caret" /></b></div>
    case 'button-group': return <div className="pv-center pq-bg"><span>왼쪽</span><span className="on">가운데</span><span>오른쪽</span></div>
    case 'disabled-tooltip': return <div className="pv-center"><div className="pv-anchor" style={{ position: 'relative', left: 0, top: 0 }}><span className="pv-btn pv-btn--lg px-off">가입하기</span><span className="pv-tip pv-fade">약관에 동의해야 해요</span></div></div>
    case 'trial-banner': return <Screen head={false}><div className="pv-banner pv-drop">무료 체험 3일 남음 <b>업그레이드</b></div><Lines /></Screen>
    case 'calendar-dots': return <div className="px-month"><b>11월</b><div>{Array.from({ length: 12 }, (_, i) => <span key={i} className={i === 6 ? 'on' : ''}>{i + 14}{[2, 6, 7, 10].includes(i) && <i className="pq-cd" />}</span>)}</div></div>
    case 'date-text-input': return <div className="pv-form"><small>시작일</small><span className="pv-input pv-input--focus">2026.11.<span style={{ color: 'var(--ss-text-faint)' }}>DD</span><span style={{ marginLeft: 'auto' }}>📅</span></span></div>
    case 'age-gate': return <Screen className="pv-dim"><Lines /><div className="pv-modal pv-pop"><b>만 19세 이상인가요?</b><div className="pv-row2"><span className="pv-btn pv-btn--ghost">아니요</span><span className="pv-btn">네</span></div></div></Screen>
    case 'pinned-items': return <div className="pv-form pz-board"><span className="notice"><em>📌</em><b>장보기 목록</b><small /></span><span className="notice"><em>📌</em><b>레시피 모음</b><small /></span><span><em /><b>어제 메모</b><small /></span></div>
    case 'wallet-stack': return <div className="pq-wallet">{['#2f3a4a', '#8f4c38', '#006a60'].map((c, i) => <i key={c} style={{ background: c, top: i * 22 }}>{['멤버십', '체크카드', '교통카드'][i]}</i>)}</div>
    case 'balanced-text': return <div className="pv-center pq-bal"><div><small>그냥</small><b>오늘 아침 갓 구운 소금빵을 만나</b></div><div className="on"><small>맞춤</small><b>오늘 아침 갓 구운 소금빵을 만나</b></div></div>
    case 'hanging-quote': return <div className="pv-form pq-hq"><span>“</span><p>빵 하나로 하루가 달라졌어요.</p><small>— 하늘</small></div>
    case 'search-thumbnails': return <div className="pv-form"><span className="pv-input pv-input--focus">소금<i className="pv-caret" /></span><div className="pv-list pv-drop pq-sth">{['버터 소금빵 · 3,500원', '소금 크루아상 · 4,200원'].map((t) => <span key={t}><i />{t}</span>)}</div></div>
    case 'saved-search': return <div className="pv-form"><div className="pv-row2 py-wrap"><span className="pv-chip pv-chip--sm">소금빵</span><span className="pv-chip pv-chip--sm">5천 원 이하</span></div><span className="pv-btn">☆ 이 조건 저장하고 알림 받기</span></div>
    case 'install-prompt': return <Screen><Lines /><div className="pv-toast pv-toast--wide pv-pop">홈 화면에 추가할까요? <b>설치</b></div></Screen>
    case 'sticky-table-header': return <div className="pz-board pq-sth2"><span className="notice"><em>No</em><b>상품</b><small>판매</small></span><div>{[1, 2, 3, 4, 5].map((n) => <span key={n}><em>{n}</em><b>상품 {n}</b><small>{n * 12}</small></span>)}</div></div>
    case 'collapsing-header': return <Screen head={false}><b className="pq-ch">설정</b><Lines n={4} /></Screen>
    case 'two-column-form': return <div className="pv-form"><div className="pv-row2"><span className="pv-input" style={{ flex: 1 }}>몽글</span><span className="pv-input" style={{ flex: 1 }}>김</span></div><div className="pv-row2"><span className="pv-input" style={{ flex: 1 }}>서울시</span><span className="pv-input" style={{ flex: 1 }}>성동구</span></div></div>
    case 'visual-hierarchy': return <div className="pv-form pq-vh"><b>1. 소금빵</b><span>2. 버터를 말아 구운 빵</span><small>3. 3,500원</small><span className="pv-btn">4. 담기</span></div>
    case 'golden-ratio': return <div className="pq-gold"><i className="a" /><i className="b" /><i className="c" /></div>
    case 'flat-illustration': return <div className="pq-flat"><i className="sun" /><i className="hill" /><i className="hill b" /><i className="house" /></div>
    case 'glow-button': return <div className="pq-glowbg"><span>지금 시작하기</span></div>
    case 'soft-shadow': return <div className="pv-center pq-soft"><div className="hard"><b>진하게</b></div><div className="soft"><b>옅게</b></div></div>
    case 'halftone': return <div className="pq-half"><b>POP!</b></div>
    case 'sticker': return <div className="pv-center pq-stk"><span>🥐</span><b>NEW!</b></div>
    default: return <Screen><Lines /></Screen>
  }
}

export function Preview({ id, size = 'card' }: { id: string; size?: 'card' | 'large' }) {
  return (
    <div className={`pv ss-stage pv--${size}`} data-pv={id} data-m={MOTION[id] ?? (byId.get(id)?.pic && PIC_MOTION[byId.get(id)!.pic!.k])} aria-hidden="true">
      {body(id)}
    </div>
  )
}
