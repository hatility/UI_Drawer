// 카드마다 들어가는 작은 그림. Stageshow 규칙대로:
// 주변은 회색 뼈대(Bar), 주인공 하나만 색과 진짜 글자를 가져요.
// 카드에 마우스를 올리면 주인공이 한 번 움직여요 (preview.css).
import type { ReactNode } from 'react'
import { Bar } from './kit/window'
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

const Dots = ({ dir }: { dir: 'v' | 'h' }) => <span className={`pv-dots pv-dots--${dir}`}><i /><i /><i /></span>

function body(id: string): ReactNode {
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
    case 'callout': return <Screen><Lines n={2} /><div className="pv-callout pv-fade"><b>ⓘ</b><span>주문은 오후 2시까지 받아요</span></div><Lines n={1} /></Screen>
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
    case 'masonry': return <div className="pv-masonry">{[60, 90, 40, 70, 50, 80].map((h, i) => <i key={i} style={{ height: h }} className={i === 1 ? 'on' : ''} />)}</div>
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
    case 'material': case 'flat': case 'skeuomorphism': case 'neumorphism': case 'glassmorphism': case 'claymorphism': case 'brutalism': case 'minimalism': case 'dark-mode':
      return <div className={`pv-sty pv-sty--${id}`}><div className="pv-sty-card"><i className="pv-sty-img" /><b>소금빵</b><span className="pv-sty-btn">담기</span></div></div>
    case 'bento-grid': return <div className="pv-bentogrid">{['a', 'b', 'c', 'd', 'e'].map((k) => <i key={k} className={`pv-bg-${k}`}>{k === 'a' ? '한눈에 보기' : null}</i>)}</div>
    default: return <Screen><Lines /></Screen>
  }
}

export function Preview({ id, size = 'card' }: { id: string; size?: 'card' | 'large' }) {
  return (
    <div className={`pv ss-stage pv--${size}`} data-pv={id} aria-hidden="true">
      {body(id)}
    </div>
  )
}
