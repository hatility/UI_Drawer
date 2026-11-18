// 어디서나 이름표: 아무 웹 화면에서 UI 이름을 짐작해 이름표를 붙여요.
// HTML 구조 · 접근성 정보(role 등) · 흔한 클래스 이름으로 짐작해서 틀릴 수도 있어요.
// 정보는 어디로도 보내지 않아요. 전부 그 페이지 안에서만 움직여요.

export type ScanRule = [selector: string, id: string, ko: string]

/** 구체적인 것부터 먼저. 한 요소에는 이름표 하나만 붙어요. */
export const SCAN_RULES: ScanRule[] = [
  ['[role=alertdialog]', 'alert', '얼럿'],
  ['dialog[open],[role=dialog][aria-modal=true]', 'modal', '모달'],
  ['[role=tooltip]', 'tooltip', '툴팁'],
  ['[role=tablist]', 'tabs', '탭'],
  ['[role=switch]', 'toggle', '토글 스위치'],
  ['input[type=checkbox]', 'checkbox', '체크박스'],
  ['input[type=radio]', 'radio', '라디오 버튼'],
  ['select,[role=combobox]', 'select', '셀렉트 박스'],
  ['input[type=range],[role=slider]', 'slider', '슬라이더'],
  ['input[type=search],[role=search]', 'search-bar', '검색바'],
  ['input[type=date],input[type=datetime-local],input[type=month]', 'date-picker', '데이트 피커'],
  ['input[type=time]', 'time-picker', '타임 피커'],
  ['input[type=color]', 'color-picker', '컬러 피커'],
  ['input[type=file]', 'file-upload', '파일 업로드'],
  ['input[type=number]', 'number-input', '숫자 입력'],
  ['textarea', 'textarea', '텍스트 영역'],
  ['input[type=password]', 'password-toggle', '비밀번호 보기'],
  ['input[autocomplete=one-time-code]', 'otp-input', '인증번호 입력'],
  ['input[type=tel]', 'phone-input', '전화번호 입력'],
  ['input[list],[class*=autocomplete i],[class*=suggest i]', 'autocomplete', '자동완성'],
  ['[contenteditable=true]', 'rich-text-editor', '리치 텍스트 에디터'],
  ['[class*=quantity i],[class*=qty i]', 'stepper', '스테퍼'],
  ['input[type=email],input[type=text],input[type=tel],input[type=password],input[type=url],input:not([type])', 'text-field', '텍스트 필드'],
  ['progress,[role=progressbar]', 'progress', '프로그레스 바'],
  ['[aria-label*=breadcrumb i],[class*=breadcrumb i]', 'breadcrumb', '브레드크럼'],
  ['[aria-label*=pagination i],[class*=pagination i]', 'pagination', '페이지네이션'],
  ['details', 'accordion', '아코디언'],
  ['[role=alert]', 'inline-error', '인라인 오류'],
  ['[role=status],[class*=toast i]', 'toast', '토스트'],
  ['[class*=snackbar i]', 'snackbar', '스낵바'],
  ['[role=menu],[role=listbox]', 'dropdown-menu', '드롭다운 메뉴'],
  ['[class*=carousel i],[class*=swiper i],[class*=slick-slider i]', 'carousel', '캐러셀'],
  ['[role=feed]', 'feed', '피드'],
  ['[role=tree]', 'tree-view', '트리 뷰'],
  ['[role=grid],[role=treegrid]', 'table', '테이블'],
  ['[role=menubar]', 'gnb', 'GNB'],
  ['[role=log]', 'chat-bubble', '말풍선'],
  ['[role=timer],[class*=countdown i]', 'countdown', '카운트다운'],
  ['meter,[role=meter]', 'gauge', '게이지'],
  ['[role=radiogroup],[class*=segment i]', 'segmented', '세그먼티드 컨트롤'],
  ['[role=toolbar],[class*=toolbar i]', 'floating-toolbar', '떠 있는 툴바'],
  ['[aria-sort]', 'sortable-table', '정렬되는 표'],
  ['audio', 'audio-player', '음악 재생 막대'],
  ['iframe[src*=youtube],iframe[src*=vimeo]', 'video-player', '영상 플레이어'],
  ['iframe[src*=map],[class*=leaflet i],[class*=mapbox i],[class*=map-container i]', 'map-pin', '지도 핀'],
  ['iframe[src*=recaptcha],[class*=captcha i]', 'captcha', '캡차'],
  ['img[loading=lazy]', 'lazy-loading', '지연 로딩'],
  ['hr', 'divider', '구분선'],
  ['pre,code', 'code-block', '코드 블록'],
  ['dl', 'description-list', '항목-값 목록'],
  ['mark', 'search-highlight', '검색 강조'],
  ['[class*=tooltip i]', 'tooltip', '툴팁'],
  ['[class*=popover i]', 'popover', '팝오버'],
  ['[class*=modal i]:not(button):not(a),[class*=dialog i]:not(button):not(a)', 'modal', '모달'],
  ['[class*=bottom-sheet i],[class*=bottomsheet i]', 'bottom-sheet', '바텀시트'],
  ['[class*=tab-bar i],[class*=tabbar i],[class*=bottom-nav i]', 'tab-bar', '탭 바'],
  ['[class*=fab i],[class*=floating-action i]', 'fab', '플로팅 버튼'],
  ['[class*=stepper i],[class*=steps i],[class*=wizard i]', 'steps', '단계 표시'],
  ['[class*=timeline i]', 'timeline', '타임라인'],
  ['[class*=kanban i]', 'kanban', '칸반 보드'],
  ['[class*=masonry i]', 'masonry', '메이슨리'],
  ['marquee,[class*=marquee i],[class*=ticker i]', 'marquee', '마퀴'],
  ['[class*=hero i]', 'hero', '히어로'],
  ['[class*=cookie i],[class*=consent i]', 'cookie-banner', '쿠키 배너'],
  ['[class*=banner i]', 'banner', '배너'],
  ['[class*=rating i],[class*=stars i]', 'rating', '별점'],
  ['del,s,[class*=original-price i],[class*=strike i]', 'sale-price', '할인 가격 표시'],
  ['[class*=pricing i],[class*=plan-card i]', 'pricing-table', '요금제 표'],
  ['[class*=testimonial i],[class*=review i]', 'testimonial', '후기 카드'],
  ['[class*=accordion i],[class*=collapse i]', 'accordion', '아코디언'],
  ['[class*=megamenu i],[class*=mega-menu i]', 'mega-menu', '메가 메뉴'],
  ['[class*=dropdown i]', 'dropdown-menu', '드롭다운 메뉴'],
  ['[class*=sidebar i],[class*=sidenav i],[class*=side-menu i]', 'lnb', 'LNB'],
  ['[class*=notification i],[class*=noti-list i]', 'notification-center', '알림 센터'],
  ['[class*=progress i]', 'progress', '프로그레스 바'],
  ['[class*=switch i],[class*=toggle i]', 'toggle', '토글 스위치'],
  ['[class*=slider i]', 'slider', '슬라이더'],
  ['[class*=status i],[class*=pill i]', 'status-pill', '상태 라벨'],
  ['[class*=empty i],[class*=no-result i]', 'empty-state', '빈 화면'],
  ['[class*=pager i],[class*=page-nav i]', 'pagination', '페이지네이션'],
  ['[class*=lightbox i],[class*=gallery-modal i]', 'lightbox', '라이트박스'],
  ['[class*=stories i],[class*=story-ring i]', 'story', '스토리'],
  ['[class*=bubble i],[class*=message-item i]', 'chat-bubble', '말풍선'],
  ['[class*=typing i]', 'typing-indicator', '입력 중 표시'],
  ['[class*=dock i]', 'dock', '독'],
  ['[cmdk-root],[class*=command-palette i],[class*=spotlight i]', 'command-palette', '커맨드 팔레트'],
  ['[class*=back-to-top i],[class*=top-btn i],[class*=scroll-top i]', 'back-to-top', '맨 위로'],
  ['a[class*=skip i][href^="#"]', 'skip-link', '본문 바로가기'],
  ['[class*=toc i],[class*=table-of-contents i]', 'table-of-contents', '목차'],
  ['[class*=calendar i]', 'calendar-view', '캘린더'],
  ['canvas,[class*=chart i] svg', 'chart', '차트'],
  ['[class*=qr i]', 'qr-share', 'QR 공유'],
  ['[class*=signature i]', 'signature-pad', '서명 패드'],
  ['[class*=coupon i]', 'coupon-card', '쿠폰 카드'],
  ['[class*=live-badge i],[class*=is-live i],[class*=onair i]', 'live-badge', '라이브 표시'],
  ['[class*=verified i]', 'verified-badge', '인증 체크 표시'],
  ['[class*=avatar-group i],[class*=avatars i],[class*=facepile i]', 'avatar-group', '아바타 묶음'],
  ['[class*=kebab i],[aria-label*=더보기],[aria-label*="more options" i]', 'kebab', '케밥'],
  ['[class*=share i],[aria-label*=공유],[aria-label*="share" i]', 'share-icon', '공유 아이콘'],
  ['[class*=like i],[aria-label*=좋아요],[aria-label*="like" i]', 'like-icon', '좋아요 하트'],
  ['[class*=bookmark i],[aria-label*=북마크],[aria-label*=저장]', 'bookmark-icon', '북마크'],
  ['[class*=cart i],[aria-label*=장바구니],[aria-label*="cart" i]', 'cart-icon', '장바구니 아이콘'],
  ['[class*=bell i],[aria-label*=알림],[aria-label*="notification" i]', 'bell-icon', '알림 종'],
  ['[class*=close i],[aria-label*=닫기],[aria-label="close" i]', 'close-icon', '닫기 버튼 (X)'],
  ['[class*=grid i]', 'card-grid', '카드 그리드'],
  ['a[target=_blank]', 'external-link', '새 창 아이콘'],
  ['[class*=skeleton i]', 'skeleton', '스켈레톤'],
  ['[class*=spinner i],[aria-busy=true]', 'spinner', '스피너'],
  ['[class*=badge i]', 'badge', '뱃지'],
  ['[class*=avatar i]', 'avatar', '아바타'],
  ['[class*=chip i]', 'chip', '칩'],
  ['[class*=drawer i],[class*=offcanvas i]', 'drawer', '드로어'],
  ['[class*=hamburger i]', 'hamburger-menu', '햄버거 메뉴'],
  ['[class*=card i]', 'card', '카드'],
  ['header', 'sticky-header', '스티키 헤더'],
  ['nav', 'gnb', 'GNB'],
  ['footer', 'footer', '푸터'],
  ['table', 'table', '테이블'],
  ['video', 'video-player', '영상 플레이어'],
  ['kbd', 'kbd', '키 표시'],
  ['blockquote', 'blockquote', '인용구'],
  ['button,[role=button]', 'icon-button', '아이콘 버튼'],
]

/**
 * 이름표를 붙이고, 다시 부르면 떼어요. 북마크에 그대로 담기 때문에 바깥 것을 하나도 쓰지 않아요.
 * base: 이름표를 누르면 열 UI Drawer 주소 · sameTab: 같은 창에서 열기
 */
export function uiTags(rules: ScanRule[], base: string, sameTab: boolean) {
  const ID = '__uidrawer_tags'
  const old = document.getElementById(ID)
  if (old) { old.remove(); return }
  const root = document.createElement('div')
  root.id = ID
  root.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;z-index:2147483646;font:600 11px/1.3 system-ui,-apple-system,"Apple SD Gothic Neo",sans-serif'
  const used = new Set<Element>()
  const per = new Map<string, number>()
  const placed: { x: number; y: number; w: number }[] = []
  let count = 0
  const found = new Set<string>()
  for (const [sel, id, ko] of rules) {
    let list: Element[] = []
    try { list = Array.from(document.querySelectorAll(sel)) } catch { continue }
    for (const el of list) {
      if (count >= 60 || (per.get(id) ?? 0) >= 3) break
      if (used.has(el) || el.closest('#' + ID)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8) continue
      // 화면 밖으로 치워 둔 것 · 숨겨 둔 것(aria-hidden, inert)은 건너뛰어요
      if (r.right < 0 || r.left > innerWidth || el.closest('[aria-hidden="true"],[inert]')) continue
      const st = getComputedStyle(el)
      if (st.visibility === 'hidden' || st.display === 'none' || st.opacity === '0') continue
      if (id === 'sticky-header' && !/sticky|fixed/.test(st.position)) continue
      if (id === 'icon-button' && ((el as HTMLElement).innerText || '').trim()) continue
      used.add(el); per.set(id, (per.get(id) ?? 0) + 1); count++; found.add(id)
      const x0 = r.left + scrollX, y0 = r.top + scrollY
      const box = document.createElement('div')
      box.style.cssText = `position:absolute;left:${x0}px;top:${y0}px;width:${r.width}px;height:${r.height}px;outline:1.5px dashed rgba(0,106,96,.85);outline-offset:1px;border-radius:4px;pointer-events:none`
      const w = ko.length * 11 + 22
      let x = Math.max(2, x0)
      const y = Math.max(2, y0 - 18)
      for (let i = 0; i < 30; i++) {
        const hit = placed.find((q) => Math.abs(q.y - y) < 18 && x < q.x + q.w && q.x < x + w)
        if (!hit) break
        x = hit.x + hit.w + 3
      }
      placed.push({ x, y, w })
      const a = document.createElement('a')
      a.href = base + '#/w/' + id
      if (!sameTab) { a.target = '_blank'; a.rel = 'noopener' }
      a.textContent = ko
      a.title = 'UI Drawer 에서 ‘' + ko + '’ 보기'
      a.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:2px 7px;border-radius:6px;background:#006a60;color:#fff;text-decoration:none;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3)`
      root.append(box, a)
    }
  }
  const bar = document.createElement('div')
  bar.setAttribute('role', 'status')
  bar.style.cssText = 'position:fixed;right:16px;bottom:16px;display:flex;gap:12px;align-items:center;padding:10px 10px 10px 16px;border-radius:14px;background:#2b3231;color:#ecf2ef;box-shadow:0 8px 24px rgba(0,0,0,.35);font:500 13px/1.3 system-ui,-apple-system,"Apple SD Gothic Neo",sans-serif'
  // 성적표: 찾은 UI 수 + 접근성 경고 (그림 설명 · 버튼 이름 · 입력 칸 라벨)
  const q = (s: string) => Array.from(document.querySelectorAll(s))
  const noAlt = q('img:not([alt])').length
  const noName = q('button,[role=button]').filter((b) => !(b.textContent || '').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title') && !b.getAttribute('aria-labelledby')).length
  const noLabel = q('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').filter((f) => !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !(f.id && document.querySelector('label[for="' + f.id + '"]')) && !f.closest('label')).length
  const warn = noAlt + noName + noLabel
  bar.textContent = (count ? `UI ${found.size}종 · 이름표 ${count}개` : 'UI 이름을 찾지 못했어요') + ` · 접근성 경고 ${warn}`
  bar.title = `그림 설명(alt) 없음 ${noAlt} · 이름 없는 버튼 ${noName} · 라벨 없는 입력 칸 ${noLabel}`
  if (found.size) {
    const keep = document.createElement('a')
    keep.textContent = '서랍에 담기'
    keep.href = base + '#/share/' + encodeURIComponent(JSON.stringify({ n: location.hostname.slice(0, 20), i: Array.from(found) }))
    keep.target = '_blank'; keep.rel = 'noopener'
    keep.style.cssText = 'color:#82d5c8;font:600 12px system-ui,sans-serif;text-decoration:none'
    bar.append(keep)
  }
  const off = document.createElement('button')
  off.textContent = '떼기'
  off.style.cssText = 'border:0;border-radius:999px;padding:6px 14px;background:#82d5c8;color:#00201c;font:600 12px system-ui,sans-serif;cursor:pointer'
  const remove = () => { root.remove(); removeEventListener('keydown', esc) }
  const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') remove() }
  off.onclick = remove
  bar.append(off)
  root.append(bar)
  document.body.append(root)
  addEventListener('keydown', esc)
}

/** 북마크 주소: 규칙과 함수를 통째로 담아요 */
/**
 * 북마크 주소. 코드를 주소용으로 인코딩해요.
 * (그대로 넣으면 코드 속 # 뒤가 ‘페이지 안 위치’로 잘려 나가고 줄바꿈 · % 도 깨져서, 북마크로 저장하면 실행되지 않았어요)
 */
export const bookmarklet = (base: string, mine: ScanRule[] = []) => {
  // 내 규칙은 맨 앞에: 우리 회사 컴포넌트 이름이 먼저 붙게
  const rules: ScanRule[] = [...mine, ...SCAN_RULES]
  // 줄 앞 들여쓰기는 지워서 짧게 (코드에 여러 줄 템플릿 글자가 없어서 안전해요)
  const code = `(${uiTags.toString()})(${JSON.stringify(rules)},${JSON.stringify(base)},false);void 0`.replace(/\n\s+/g, '\n')
  // 꼭 필요한 글자만 바꿔요: % # 줄바꿈 · 탭. 한글은 그대로 두어 주소가 길어지지 않게 (encodeURIComponent 를 쓰면 1.8배 길어져요)
  return 'javascript:' + code.replace(/%/g, '%25').replace(/#/g, '%23').replace(/\r?\n/g, '%0A').replace(/\t/g, '%09')
}
