// UI Drawer 사전 데이터. 서랍(분류)마다 항목을 넣어요.
// 항목 하나 = 이름 카드 한 장. hint 는 "모양으로 찾기" 검색에 쓰여요.

export type DrawerId = 'feedback' | 'loading' | 'input' | 'nav' | 'content' | 'style' | 'gesture' | 'icon' | 'ai' | 'dark'

export type Drawer = { id: DrawerId; label: string; note: string }

export type Entry = {
  id: string
  drawer: DrawerId
  ko: string
  en: string
  /** 다르게 부르는 이름 */
  aliases?: string[]
  /** 모양으로 찾을 때 떠올리는 말 */
  hint: string
  /** 한 줄 설명 */
  desc: string
  /** 이럴 때 써요 */
  when: string[]
  /** 헷갈리는 친구와 다른 점 */
  vs?: { id: string; diff: string }[]
  /** 체험관에서 직접 볼 수 있어요 */
  play?: boolean
}

export const DRAWERS: Drawer[] = [
  { id: 'feedback', label: '알림과 피드백', note: '무슨 일이 일어났는지 알려 줘요' },
  { id: 'loading', label: '로딩', note: '기다리는 시간을 덜 지루하게' },
  { id: 'input', label: '입력 폼', note: '고르고, 적고, 켜고 끄는 것들' },
  { id: 'nav', label: '이동 구조', note: '어디로 갈지 길을 알려 줘요' },
  { id: 'content', label: '콘텐츠 담기', note: '내용을 묶고 펼치고 넘겨요' },
  { id: 'style', label: '디자인 스타일', note: '화면 전체의 분위기를 부르는 이름' },
  { id: 'gesture', label: '제스처와 움직임', note: '손과 마우스로 하는 동작' },
  { id: 'icon', label: '메뉴 아이콘 별명', note: '모양으로 붙은 재미있는 이름' },
  { id: 'ai', label: 'AI 화면', note: '대화형 AI에서 자주 보는 것' },
  { id: 'dark', label: '다크 패턴', note: '알아 두고 쓰지 말아야 할 것' },
]

export const ENTRIES: Entry[] = [
  // ─── A. 알림과 피드백 ───
  { id: 'toast', drawer: 'feedback', ko: '토스트', en: 'Toast', aliases: ['토스트 메시지'], hint: '잠깐 떴다가 저절로 사라지는 알림', desc: '잠깐 떴다가 저절로 사라지는 짧은 알림이에요. 누를 것이 없어요.', when: ['저장 · 복사 · 찜처럼 결과만 알려 주면 될 때', '하던 일을 멈추게 하고 싶지 않을 때'], vs: [{ id: 'snackbar', diff: '스낵바는 ‘실행 취소’ 같은 버튼이 하나 붙어요.' }], play: true },
  { id: 'snackbar', drawer: 'feedback', ko: '스낵바', en: 'Snackbar', hint: '아래에 뜨는 알림 + 실행 취소 버튼', desc: '화면 아래에 잠깐 뜨는 알림인데, 버튼이 하나 붙어 있어요.', when: ['지운 것을 되돌릴 기회를 줄 때', '알림에 이어서 바로 할 일이 하나 있을 때'], vs: [{ id: 'toast', diff: '토스트는 버튼 없이 알리기만 해요.' }], play: true },
  { id: 'banner', drawer: 'feedback', ko: '배너', en: 'Banner', aliases: ['공지 띠', '알림 바'], hint: '화면 맨 위에 붙은 안내 띠', desc: '화면 위쪽에 붙어서 닫을 때까지 남아 있는 안내 띠예요.', when: ['점검 · 이벤트처럼 모두가 봐야 할 소식', '바로 사라지면 안 되는 안내'], vs: [{ id: 'toast', diff: '토스트는 잠깐 떴다가 사라져요.' }], play: true },
  { id: 'modal', drawer: 'feedback', ko: '모달', en: 'Modal dialog', aliases: ['팝업', '다이얼로그', '레이어 팝업'], hint: '뒤를 어둡게 막고 가운데 뜨는 창', desc: '뒤 화면을 어둡게 막고, 대답을 해야 닫히는 창이에요.', when: ['꼭 확인받아야 하는 내용', '지금 하던 일과 이어지는 짧은 입력'], vs: [{ id: 'alert', diff: '얼럿은 확인 · 취소만 묻는 작은 모달이에요.' }, { id: 'drawer', diff: '드로어는 옆에서 밀려 나와요.' }], play: true },
  { id: 'alert', drawer: 'feedback', ko: '얼럿', en: 'Alert dialog', aliases: ['컨펌 창', '확인 창'], hint: '확인 · 취소 두 버튼만 있는 작은 창', desc: '‘정말 할까요?’를 묻고 확인 · 취소만 고르게 하는 작은 모달이에요.', when: ['되돌리기 어려운 일을 하기 직전', '결제 · 삭제 확인'], vs: [{ id: 'modal', diff: '모달은 안에 무엇이든 담을 수 있어요.' }], play: true },
  { id: 'tooltip', drawer: 'feedback', ko: '툴팁', en: 'Tooltip', aliases: ['말풍선'], hint: '마우스를 올리면 뜨는 작은 설명', desc: '마우스를 올리면 뜨는 작은 설명 말풍선이에요. 글자만 담아요.', when: ['아이콘만 있는 버튼의 뜻 알려 주기', '용어를 짧게 풀어 줄 때'], vs: [{ id: 'popover', diff: '팝오버는 눌러서 열고, 버튼 · 입력도 담아요.' }], play: true },
  { id: 'popover', drawer: 'feedback', ko: '팝오버', en: 'Popover', aliases: ['드롭다운 패널'], hint: '누르면 옆에 열리는 작은 떠 있는 판', desc: '누르면 그 자리 옆에 열리는 작은 떠 있는 판이에요. 안에 버튼이나 입력도 들어가요.', when: ['더보기 메뉴', '간단한 설정을 그 자리에서 바꿀 때'], vs: [{ id: 'tooltip', diff: '툴팁은 올리기만 하면 뜨고 글자만 담아요.' }], play: true },
  { id: 'coachmark', drawer: 'feedback', ko: '코치마크', en: 'Coach mark', aliases: ['온보딩 투어', '가이드 투어'], hint: '어두운 막 위에 기능을 짚어 주는 안내', desc: '처음 온 사람에게 화면의 기능을 하나씩 짚어 주는 안내예요. 나머지는 어둡게 가려요.', when: ['새 기능을 처음 소개할 때', '첫 방문 둘러보기'], play: true },
  { id: 'badge', drawer: 'feedback', ko: '뱃지', en: 'Badge', aliases: ['배지', '카운트 뱃지', '빨간 점'], hint: '아이콘 모서리의 숫자나 빨간 점', desc: '아이콘 모서리에 붙어 새 소식이나 개수를 알려 주는 작은 표시예요.', when: ['장바구니 개수', '읽지 않은 알림'], play: true },
  { id: 'inline-error', drawer: 'feedback', ko: '인라인 오류', en: 'Inline error', aliases: ['에러 메시지', '헬퍼 텍스트'], hint: '입력칸 바로 아래 빨간 글씨', desc: '잘못 적은 입력칸 바로 아래에 무엇이 틀렸는지 알려 주는 글이에요.', when: ['이메일 · 비밀번호 형식 확인', '꼭 적어야 하는 칸을 비웠을 때'], play: true },

  // ─── B. 로딩 ───
  { id: 'spinner', drawer: 'loading', ko: '스피너', en: 'Spinner', aliases: ['로딩 아이콘', '뺑뺑이'], hint: '빙글빙글 도는 동그라미', desc: '빙글빙글 돌며 ‘처리하는 중’임을 알려 줘요. 얼마나 남았는지는 몰라요.', when: ['버튼을 누르고 1~3초 기다릴 때'], vs: [{ id: 'progress', diff: '프로그레스 바는 얼마나 됐는지 보여 줘요.' }, { id: 'skeleton', diff: '스켈레톤은 나올 모양을 미리 그려 둬요.' }], play: true },
  { id: 'skeleton', drawer: 'loading', ko: '스켈레톤', en: 'Skeleton', aliases: ['스켈레톤 UI', '뼈대 화면'], hint: '회색 상자가 반짝이며 내용 자리를 잡음', desc: '내용이 들어올 자리에 회색 뼈대를 먼저 그려 두는 로딩이에요.', when: ['목록 · 카드가 불러와지는 동안', '화면이 덜컥 바뀌는 걸 막고 싶을 때'], vs: [{ id: 'spinner', diff: '스피너는 모양 없이 돌기만 해요.' }], play: true },
  { id: 'progress', drawer: 'loading', ko: '프로그레스 바', en: 'Progress bar', aliases: ['진행 바', '게이지'], hint: '왼쪽에서 오른쪽으로 차오르는 막대', desc: '얼마나 진행됐는지 막대가 차오르며 보여 줘요.', when: ['업로드 · 다운로드', '목표까지 얼마 남았는지 (무료배송까지 3,000원)'], play: true },
  { id: 'pull-refresh', play: true, drawer: 'loading', ko: '당겨서 새로고침', en: 'Pull to refresh', hint: '목록을 아래로 끌어내리면 새로고침', desc: '목록 맨 위에서 아래로 끌어당기면 새 내용을 불러와요.', when: ['피드 · 메일함처럼 새 글이 자주 오는 목록'] },
  { id: 'infinite-scroll', drawer: 'loading', ko: '무한 스크롤', en: 'Infinite scroll', hint: '끝까지 내리면 계속 더 나옴', desc: '목록 끝에 닿으면 다음 내용을 알아서 이어 붙여요.', when: ['SNS 피드처럼 끝없이 둘러보는 화면'], vs: [{ id: 'pagination', diff: '페이지네이션은 쪽 번호를 눌러 넘겨요.' }] },

  // ─── C. 입력 폼 ───
  { id: 'text-field', drawer: 'input', ko: '텍스트 필드', en: 'Text field', aliases: ['인풋', '입력창'], hint: '글자를 적는 네모 칸', desc: '글자를 적는 칸이에요. 위에 이름표, 안에 흐린 예시 글(플레이스홀더)이 있어요.', when: ['이름 · 이메일 · 주소 입력'], play: true },
  { id: 'select', drawer: 'input', ko: '셀렉트 박스', en: 'Select', aliases: ['드롭다운', '콤보 박스'], hint: '누르면 목록이 펼쳐지고 하나 고름', desc: '누르면 목록이 펼쳐지고, 그중 하나를 고르는 칸이에요.', when: ['고를 것이 5개 넘게 많을 때'], vs: [{ id: 'radio', diff: '라디오는 고를 것을 모두 펼쳐 보여 줘요.' }], play: true },
  { id: 'checkbox', drawer: 'input', ko: '체크박스', en: 'Checkbox', hint: '네모 칸에 체크 표시', desc: '여러 개를 골라도 되는 네모 칸이에요.', when: ['약관 동의', '여러 개 고르기'], vs: [{ id: 'radio', diff: '라디오는 하나만 골라요.' }, { id: 'toggle', diff: '토글은 누르자마자 켜져요.' }], play: true },
  { id: 'radio', drawer: 'input', ko: '라디오 버튼', en: 'Radio button', hint: '동그라미 중 하나만 고름', desc: '여러 개 중 딱 하나만 고르는 동그라미예요. 옛날 라디오 버튼에서 온 이름이에요.', when: ['배송 방법 · 크기처럼 하나만 고를 때'], vs: [{ id: 'checkbox', diff: '체크박스는 여러 개를 골라요.' }], play: true },
  { id: 'toggle', drawer: 'input', ko: '토글 스위치', en: 'Toggle switch', aliases: ['스위치'], hint: '켜고 끄는 동그란 스위치', desc: '누르는 즉시 켜지고 꺼지는 스위치예요. 저장 버튼이 따로 없어요.', when: ['알림 받기 · 다크 모드처럼 바로 적용되는 설정'], vs: [{ id: 'checkbox', diff: '체크박스는 보통 ‘확인’을 눌러야 적용돼요.' }], play: true },
  { id: 'segmented', drawer: 'input', ko: '세그먼티드 컨트롤', en: 'Segmented control', aliases: ['세그먼트 버튼'], hint: '붙어 있는 버튼 중 하나가 눌린 모양', desc: '나란히 붙은 버튼 가운데 하나를 고르는 컨트롤이에요. 고른 칸이 미끄러져요.', when: ['보기 방식 · 정렬처럼 2~4개 중 하나'], vs: [{ id: 'tabs', diff: '탭은 아래 내용 묶음 자체를 바꿔요.' }], play: true },
  { id: 'stepper', drawer: 'input', ko: '스테퍼', en: 'Stepper', aliases: ['수량 선택', '카운터'], hint: '− 숫자 + 로 수량 조절', desc: '빼기 · 더하기 버튼으로 숫자를 하나씩 올리고 내려요.', when: ['장바구니 수량', '인원 수'], play: true },
  { id: 'slider', drawer: 'input', ko: '슬라이더', en: 'Slider', aliases: ['레인지'], hint: '동그라미를 끌어서 값 조절', desc: '막대 위 동그라미를 끌어서 값을 정해요.', when: ['가격 범위', '음량 · 밝기'], play: true },
  { id: 'chip', drawer: 'input', ko: '칩', en: 'Chip', aliases: ['태그', '필터 칩', '알약 버튼'], hint: '둥근 알약 모양 작은 버튼', desc: '둥근 알약 모양의 작은 버튼이에요. 필터나 태그로 많이 써요.', when: ['검색 필터', '고른 항목 보여 주기'], play: true },
  { id: 'autocomplete', drawer: 'input', ko: '자동완성', en: 'Autocomplete', aliases: ['검색어 추천', '서제스트'], hint: '적는 중에 아래로 추천이 뜸', desc: '적는 동안 맞을 만한 말을 아래에 추천해 줘요.', when: ['검색창', '주소 입력'], play: true },
  { id: 'date-picker', drawer: 'input', ko: '데이트 피커', en: 'Date picker', aliases: ['달력 선택'], hint: '달력이 열려서 날짜를 고름', desc: '달력을 열어 날짜를 고르는 입력이에요.', when: ['예약 · 픽업 날짜'], play: true },
  { id: 'rating', drawer: 'input', ko: '별점', en: 'Rating', aliases: ['스타 레이팅'], hint: '별 다섯 개', desc: '별 개수로 점수를 보여 주거나 매기게 해요.', when: ['리뷰 · 만족도'], play: true },

  // ─── D. 이동 구조 ───
  { id: 'gnb', drawer: 'nav', ko: 'GNB', en: 'Global navigation bar', aliases: ['글로벌 내비게이션', '상단 메뉴', '헤더 메뉴'], hint: '모든 화면 맨 위에 있는 메뉴 줄', desc: '어느 화면에서나 맨 위에 있는 큰 메뉴 줄이에요.', when: ['사이트의 큰 갈래로 이동'], vs: [{ id: 'lnb', diff: 'LNB는 그 갈래 안의 작은 메뉴예요.' }], play: true },
  { id: 'lnb', drawer: 'nav', ko: 'LNB', en: 'Local navigation bar', aliases: ['사이드바', '왼쪽 메뉴', 'SNB'], hint: '왼쪽에 세로로 늘어선 메뉴', desc: '한 갈래 안에서 쓰는 작은 메뉴예요. 보통 왼쪽에 세로로 있어요.', when: ['설정 · 관리자 화면처럼 메뉴가 많을 때'], vs: [{ id: 'gnb', diff: 'GNB는 사이트 전체의 큰 메뉴예요.' }] },
  { id: 'breadcrumb', drawer: 'nav', ko: '브레드크럼', en: 'Breadcrumb', aliases: ['빵 부스러기', '경로 표시'], hint: '홈 > 빵 > 소금빵 처럼 지나온 길', desc: '지금 어디에 있는지 ‘홈 > 빵 > 소금빵’처럼 지나온 길을 보여 줘요. 헨젤과 그레텔의 빵 부스러기에서 온 이름이에요.', when: ['단계가 깊은 쇼핑몰 · 문서'], play: true },
  { id: 'tabs', drawer: 'nav', ko: '탭', en: 'Tabs', hint: '제목 줄을 눌러 아래 내용이 바뀜', desc: '제목 줄을 누르면 아래 내용 묶음이 바뀌어요. 밑줄이 따라 움직여요.', when: ['같은 화면 안에서 내용을 나눠 보여 줄 때'], vs: [{ id: 'segmented', diff: '세그먼티드는 보기 방식만 바꾸는 작은 버튼 묶음이에요.' }], play: true },
  { id: 'drawer', drawer: 'nav', ko: '드로어', en: 'Drawer', aliases: ['사이드 시트', '내비게이션 드로어', '오프캔버스', '서랍 메뉴'], hint: '옆에서 서랍처럼 밀려 나오는 판', desc: '화면 옆에서 서랍처럼 쓱 밀려 나오는 판이에요. 지금 보고 있는 이 설명 창도 드로어예요!', when: ['장바구니 · 필터 · 메뉴', '목록을 보면서 자세히 보기'], vs: [{ id: 'modal', diff: '모달은 가운데 떠서 뒤를 막아요.' }, { id: 'bottom-sheet', diff: '바텀시트는 아래에서 올라와요.' }], play: true },
  { id: 'bottom-sheet', play: true, drawer: 'nav', ko: '바텀시트', en: 'Bottom sheet', hint: '아래에서 올라오는 창', desc: '화면 아래에서 쓱 올라오는 판이에요. 휴대폰 화면에서 많이 써요.', when: ['공유하기 · 옵션 고르기 (모바일)'], vs: [{ id: 'drawer', diff: '드로어는 옆에서 밀려 나와요.' }] },
  { id: 'hamburger-menu', play: true, drawer: 'nav', ko: '햄버거 메뉴', en: 'Hamburger menu', aliases: ['전체 메뉴'], hint: '☰ 를 누르면 메뉴가 펼쳐짐', desc: '☰ 아이콘을 누르면 숨겨 둔 전체 메뉴가 열려요. 보통 드로어로 나와요.', when: ['좁은 화면에서 메뉴 숨기기'], vs: [{ id: 'hamburger', diff: '아이콘 모양 이름은 메뉴 아이콘 별명 서랍에 있어요.' }] },
  { id: 'mega-menu', drawer: 'nav', ko: '메가 메뉴', en: 'Mega menu', aliases: ['전체 카테고리'], hint: '메뉴에 올리면 큰 판이 통째로 펼쳐짐', desc: '메뉴에 마우스를 올리면 하위 메뉴가 큰 판으로 한꺼번에 펼쳐져요.', when: ['쇼핑몰처럼 분류가 많은 사이트'], play: true },
  { id: 'pagination', drawer: 'nav', ko: '페이지네이션', en: 'Pagination', aliases: ['쪽 번호', '페이징'], hint: '‹ 1 2 3 › 쪽 번호', desc: '긴 목록을 쪽으로 나누고 번호를 눌러 넘겨요.', when: ['게시판 · 검색 결과'], vs: [{ id: 'infinite-scroll', diff: '무한 스크롤은 내리면 알아서 이어 붙여요.' }], play: true },
  { id: 'tab-bar', play: true, drawer: 'nav', ko: '탭 바', en: 'Tab bar', aliases: ['하단 내비게이션', '바텀 내비'], hint: '휴대폰 맨 아래 아이콘 줄', desc: '앱 맨 아래에 늘 있는 아이콘 메뉴 줄이에요.', when: ['앱의 큰 화면 3~5개 사이 이동'] },
  { id: 'sticky-header', drawer: 'nav', ko: '스티키 헤더', en: 'Sticky header', aliases: ['고정 헤더'], hint: '내려도 위에 붙어 따라오는 머리줄', desc: '스크롤을 내려도 화면 위에 착 붙어 따라오는 머리줄이에요.', when: ['검색 · 장바구니를 언제나 누를 수 있게'], play: true },
  { id: 'fab', drawer: 'nav', ko: '플로팅 버튼', en: 'Floating action button', aliases: ['FAB', '떠 있는 버튼'], hint: '오른쪽 아래 떠 있는 동그란 버튼', desc: '화면 구석에 떠 있는 동그란 버튼이에요. 가장 자주 하는 일 하나를 맡아요.', when: ['글쓰기 · 맨 위로 · 상담하기'], play: true },

  // ─── E. 콘텐츠 담기 ───
  { id: 'card', drawer: 'content', ko: '카드', en: 'Card', hint: '사진 + 제목이 담긴 네모 덩어리', desc: '사진 · 제목 · 정보를 한 덩어리로 묶은 네모예요.', when: ['상품 · 글 목록'], play: true },
  { id: 'accordion', drawer: 'content', ko: '아코디언', en: 'Accordion', aliases: ['접고 펼치기', '폴딩'], hint: '제목을 누르면 아래로 펼쳐짐', desc: '제목을 누르면 아래로 내용이 펼쳐지고 다시 누르면 접혀요.', when: ['자주 묻는 질문', '긴 설명 정리'], play: true },
  { id: 'carousel', drawer: 'content', ko: '캐러셀', en: 'Carousel', aliases: ['슬라이드 배너', '롤링 배너'], hint: '옆으로 넘어가는 큰 그림 + 점', desc: '여러 장을 옆으로 넘겨 보는 판이에요. 아래 점이 몇 번째인지 알려 줘요.', when: ['첫 화면 행사 배너'], play: true },
  { id: 'hero', drawer: 'content', ko: '히어로', en: 'Hero section', aliases: ['메인 비주얼', '키 비주얼'], hint: '첫 화면 맨 위 큰 그림과 큰 글씨', desc: '첫 화면 맨 위의 큰 그림과 큰 제목 자리예요. 사이트의 얼굴이에요.', when: ['첫인상 · 가장 중요한 한마디'], play: true },
  { id: 'table', drawer: 'content', ko: '테이블', en: 'Table', aliases: ['표', '데이터 그리드'], hint: '줄과 칸으로 된 표', desc: '줄과 칸으로 정보를 나란히 비교하게 해요.', when: ['주문 내역 · 관리자 화면'] },
  { id: 'avatar', drawer: 'content', ko: '아바타', en: 'Avatar', aliases: ['프로필 사진'], hint: '동그란 얼굴 사진이나 이니셜', desc: '사람을 나타내는 동그란 사진이나 이니셜이에요.', when: ['로그인한 사람 · 글쓴이 표시'], play: true },
  { id: 'empty-state', drawer: 'content', ko: '빈 화면', en: 'Empty state', aliases: ['엠티 스테이트', '결과 없음'], hint: '아무것도 없을 때 나오는 그림과 안내', desc: '보여 줄 내용이 없을 때 그 이유와 다음 할 일을 알려 주는 화면이에요.', when: ['검색 결과 없음', '장바구니가 비었을 때'], play: true },

  // ─── 디자인 스타일 ───
  { id: 'material', drawer: 'style', ko: '머티리얼 디자인', en: 'Material Design', aliases: ['머티리얼', 'M3', 'Material You'], hint: '알약 버튼, 둥근 모서리, 은은한 색 면', desc: '구글이 만든 디자인 규칙이에요. 은은한 색 면과 둥근 모서리, 누를 때 번지는 물결로 깊이를 표현해요. 지금 이 사이트도 머티리얼이에요!', when: ['안드로이드 앱', '규칙이 잘 정리된 디자인 시스템이 필요할 때'], vs: [{ id: 'flat', diff: '플랫은 깊이 표현 없이 완전히 납작해요.' }], play: true },
  { id: 'flat', drawer: 'style', ko: '플랫 디자인', en: 'Flat design', hint: '그림자 없이 납작한 단색 면', desc: '그림자와 입체감을 빼고 단색 면과 단순한 아이콘으로만 그린 스타일이에요.', when: ['가볍고 깔끔한 화면', '아이콘 · 일러스트가 많은 서비스'], vs: [{ id: 'skeuomorphism', diff: '스큐어모피즘은 반대로 진짜 물건처럼 그려요.' }, { id: 'material', diff: '머티리얼은 색 면의 높낮이로 깊이를 줘요.' }], play: true },
  { id: 'skeuomorphism', drawer: 'style', ko: '스큐어모피즘', en: 'Skeuomorphism', hint: '진짜 가죽 · 나무 · 종이처럼 보이는 화면', desc: '실제 물건의 질감과 그림자를 그대로 흉내 낸 스타일이에요. 옛날 스마트폰 메모장의 노란 줄 종이가 대표적이에요.', when: ['처음 쓰는 사람에게 익숙함을 줄 때', '게임 · 음악 장비 화면'], vs: [{ id: 'flat', diff: '플랫은 질감을 모두 뺐어요.' }] },
  { id: 'neumorphism', drawer: 'style', ko: '뉴모피즘', en: 'Neumorphism', aliases: ['소프트 UI'], hint: '바탕과 같은 색인데 볼록 튀어나온 버튼', desc: '바탕과 같은 색에 밝은 그림자 · 어두운 그림자를 함께 줘서 말랑하게 튀어나온 듯 보여요. 대비가 약해 글자가 잘 안 보일 수 있어요.', when: ['장식 포인트로 조금만', '글자 대비는 꼭 따로 챙기기'], vs: [{ id: 'glassmorphism', diff: '글래스모피즘은 뒤가 비치는 유리판이에요.' }, { id: 'claymorphism', diff: '클레이모피즘은 더 통통하고 색이 있어요.' }], play: true },
  { id: 'glassmorphism', drawer: 'style', ko: '글래스모피즘', en: 'Glassmorphism', aliases: ['유리 효과', '리퀴드 글래스'], hint: '뒤가 흐릿하게 비치는 반투명 유리판', desc: '뒤 배경이 뿌옇게 비치는 반투명 유리판 스타일이에요. 알록달록한 배경 위에서 잘 살아나요.', when: ['배경 위에 뜬 카드 · 메뉴', '깊이감 있는 첫 화면'], vs: [{ id: 'neumorphism', diff: '뉴모피즘은 비치지 않고 볼록해요.' }], play: true },
  { id: 'claymorphism', drawer: 'style', ko: '클레이모피즘', en: 'Claymorphism', hint: '찰흙처럼 통통하고 부드러운 3D 덩어리', desc: '찰흙으로 빚은 듯 통통하고 둥근 입체 덩어리 스타일이에요. 안쪽 그림자로 말랑함을 줘요.', when: ['어린이 · 게임 · 귀여운 서비스'], vs: [{ id: 'neumorphism', diff: '뉴모피즘은 바탕색과 같은 색으로만 튀어나와요.' }] },
  { id: 'brutalism', drawer: 'style', ko: '뉴브루탈리즘', en: 'Neo-brutalism', aliases: ['브루탈리즘', '네오 브루탈리즘'], hint: '굵은 검은 테두리 + 딱 떨어지는 그림자 + 원색', desc: '굵은 검은 테두리와 비스듬히 딱 떨어지는 그림자, 쨍한 원색으로 일부러 투박하게 만든 스타일이에요.', when: ['눈에 확 띄어야 하는 이벤트 · 브랜드'], vs: [{ id: 'minimalism', diff: '미니멀리즘은 반대로 덜어 내요.' }], play: true },
  { id: 'minimalism', drawer: 'style', ko: '미니멀리즘', en: 'Minimalism', aliases: ['미니멀'], hint: '여백이 많고 꼭 필요한 것만', desc: '장식을 덜어 내고 여백과 글자만으로 정리한 스타일이에요.', when: ['읽기가 중요한 글 · 포트폴리오'], vs: [{ id: 'brutalism', diff: '뉴브루탈리즘은 일부러 꽉 차고 투박해요.' }] },
  { id: 'bento-grid', drawer: 'style', ko: '벤토 그리드', en: 'Bento grid', hint: '크기가 다른 네모 칸을 도시락처럼 꽉 채운 배치', desc: '크기가 다른 네모 칸들을 도시락처럼 빈틈없이 채워 기능을 한눈에 보여 주는 배치예요.', when: ['기능 소개 페이지', '대시보드'], vs: [{ id: 'bento', diff: '벤토 아이콘은 3×3 격자 모양 아이콘이에요.' }] },
  { id: 'dark-mode', drawer: 'style', ko: '다크 모드', en: 'Dark mode', aliases: ['다크 테마', '야간 모드'], hint: '어두운 바탕에 밝은 글씨', desc: '어두운 바탕에 밝은 글씨를 쓰는 화면이에요. 밤에 눈이 덜 부시고 화면을 덜 밝혀요.', when: ['밤에 오래 보는 앱', '사진 · 영상이 주인공인 화면'], play: true },

  // ─── F. 제스처와 움직임 ───
  { id: 'swipe', play: true, drawer: 'gesture', ko: '스와이프', en: 'Swipe', aliases: ['밀어서'], hint: '손가락으로 옆으로 쓱 밀기', desc: '손가락으로 옆으로 쓱 밀어서 넘기거나 지워요.', when: ['사진 넘기기', '밀어서 삭제'] },
  { id: 'drag-drop', drawer: 'gesture', ko: '드래그 앤 드롭', en: 'Drag and drop', aliases: ['끌어다 놓기'], hint: '잡고 끌어서 다른 곳에 놓기', desc: '잡고 끌어서 다른 자리에 놓아요.', when: ['순서 바꾸기', '파일 올리기'] },
  { id: 'long-press', play: true, drawer: 'gesture', ko: '롱프레스', en: 'Long press', aliases: ['길게 누르기'], hint: '꾹 누르고 있기', desc: '꾹 누르고 있으면 숨은 메뉴가 나와요.', when: ['앱 아이콘 편집', '메시지 반응'] },
  { id: 'pinch-zoom', drawer: 'gesture', ko: '핀치 줌', en: 'Pinch to zoom', hint: '두 손가락을 벌려 크게', desc: '두 손가락을 벌리면 커지고 오므리면 작아져요.', when: ['지도 · 사진 확대'] },
  { id: 'parallax', drawer: 'gesture', ko: '패럴랙스', en: 'Parallax scrolling', aliases: ['시차 스크롤'], hint: '내릴 때 뒤 배경이 더 느리게 움직임', desc: '스크롤할 때 앞과 뒤가 다른 빠르기로 움직여 깊이감을 줘요.', when: ['소개 · 브랜드 페이지'] },
  { id: 'micro-interaction', drawer: 'gesture', ko: '마이크로 인터랙션', en: 'Micro-interaction', hint: '하트를 누르면 톡 튀는 작은 움직임', desc: '누를 때 톡 튀는 하트처럼, 한 동작에 대한 작은 반응 움직임이에요.', when: ['좋아요 · 찜 · 복사 완료'], play: true },

  // ─── G. 메뉴 아이콘 별명 ───
  { id: 'hamburger', drawer: 'icon', ko: '햄버거', en: 'Hamburger icon ☰', hint: '가로줄 세 개', desc: '가로줄 세 개. 빵 · 패티 · 빵을 닮아서 햄버거예요. 전체 메뉴를 열어요.', when: ['전체 메뉴 열기'] },
  { id: 'kebab', drawer: 'icon', ko: '케밥', en: 'Kebab icon ⋮', hint: '세로 점 세 개', desc: '세로로 꽂힌 점 세 개. 꼬치에 꽂힌 케밥을 닮았어요. 그 항목의 더보기 메뉴예요.', when: ['카드 · 줄마다 붙는 더보기'], vs: [{ id: 'meatball', diff: '미트볼은 점이 가로로 누워 있어요.' }], play: true },
  { id: 'meatball', drawer: 'icon', ko: '미트볼', en: 'Meatball icon ⋯', hint: '가로 점 세 개', desc: '가로로 놓인 점 세 개. 접시에 놓인 미트볼이에요. 역시 더보기 메뉴예요.', when: ['가로 공간이 넉넉한 더보기'], vs: [{ id: 'kebab', diff: '케밥은 점이 세로로 서 있어요.' }] },
  { id: 'bento', drawer: 'icon', ko: '벤토', en: 'Bento icon ▦', aliases: ['와플', '앱 런처'], hint: '점이나 네모 아홉 개 격자', desc: '3×3 격자. 칸칸이 나뉜 도시락(벤토)을 닮았어요. 다른 앱 바로가기를 열어요.', when: ['여러 서비스 사이 이동'], play: true },
  { id: 'doner', drawer: 'icon', ko: '되너', en: 'Döner icon', hint: '아래로 갈수록 짧아지는 줄 세 개', desc: '아래로 갈수록 짧아지는 줄 세 개. 깎여 나가는 되너 케밥을 닮았어요. 정렬 · 필터에 써요.', when: ['정렬 · 필터'] },
  { id: 'clear-icon', drawer: 'icon', ko: '지우기 X', en: 'Clear icon ⓧ', aliases: ['클리어 버튼'], hint: '입력칸 끝 동그라미 속 X', desc: '입력칸 끝의 동그란 X. 누르면 적은 글을 한 번에 지워요.', when: ['검색창 비우기'], play: true },

  // ─── H. AI 화면 ───
  { id: 'prompt-box', drawer: 'ai', ko: '프롬프트 입력창', en: 'Prompt input', aliases: ['컴포저', '채팅 입력창'], hint: '아래에 크게 놓인 질문 적는 칸', desc: 'AI에게 부탁할 말을 적는 칸이에요. 적을수록 위로 늘어나요.', when: ['대화형 AI의 첫 화면'] },
  { id: 'streaming', drawer: 'ai', ko: '스트리밍 응답', en: 'Streaming response', hint: '답이 한 글자씩 써지며 나타남', desc: '답이 다 만들어질 때까지 기다리지 않고 한 단어씩 써지며 나타나요.', when: ['긴 답을 빨리 보여 주고 싶을 때'] },
  { id: 'suggestion-chips', drawer: 'ai', ko: '추천 질문', en: 'Suggested prompts', aliases: ['프롬프트 제안'], hint: '입력창 위에 놓인 질문 예시 칩', desc: '무엇을 물어볼지 모를 때 누르기만 하면 되는 질문 예시예요.', when: ['빈 대화 화면'] },
  { id: 'citation', drawer: 'ai', ko: '출처 표시', en: 'Citation', aliases: ['인용 칩', '레퍼런스'], hint: '답 옆의 작은 [1] 번호나 링크', desc: '답의 근거가 된 자료를 작은 번호나 칩으로 붙여 줘요.', when: ['검색해서 답하는 AI'] },

  // ─── I. 다크 패턴 ───
  { id: 'confirmshaming', drawer: 'dark', ko: '컨펌셰이밍', en: 'Confirmshaming', hint: '‘아니요, 저는 할인이 싫어요’ 같은 거절 버튼', desc: '거절 버튼 문구로 죄책감을 느끼게 하는 수법이에요.', when: ['쓰지 마세요! 거절은 그냥 ‘괜찮아요’로'], play: true },
  { id: 'false-urgency', drawer: 'dark', ko: '거짓 긴급성', en: 'False urgency', aliases: ['가짜 타이머'], hint: '줄어드는 가짜 마감 시계', desc: '실제 마감이 없는데 시계를 돌려 서두르게 만드는 수법이에요.', when: ['쓰지 마세요! 진짜 마감일만 알려 주세요'], play: true },
  { id: 'preselection', drawer: 'dark', ko: '기본 선택 함정', en: 'Preselection', aliases: ['미리 체크'], hint: '마케팅 동의가 미리 체크되어 있음', desc: '원하지 않을 만한 선택을 미리 체크해 두는 수법이에요.', when: ['쓰지 마세요! 선택 항목은 비워 두기'], play: true },
  { id: 'roach-motel', drawer: 'dark', ko: '로치 모텔', en: 'Roach motel', aliases: ['탈퇴 미로'], hint: '가입은 한 번, 탈퇴는 열 번', desc: '들어가기는 쉽고 나오기는 어렵게 만든 구조예요. 바퀴벌레 덫에서 온 이름이에요.', when: ['쓰지 마세요! 해지는 가입만큼 쉽게'] },
  { id: 'sneak-basket', drawer: 'dark', ko: '몰래 장바구니', en: 'Sneak into basket', hint: '안 담은 상품이 장바구니에 들어 있음', desc: '고르지 않은 상품이나 보험을 몰래 장바구니에 넣는 수법이에요.', when: ['쓰지 마세요!'] },

  // ─── 더 많은 이름 (0.3.0) ───
  // 알림과 피드백
  { id: 'callout', drawer: 'feedback', ko: '콜아웃', en: 'Callout', aliases: ['알림 박스', '어드모니션'], hint: '본문 사이에 끼어 있는 색깔 안내 상자', desc: '글 중간에 아이콘과 색 상자로 꼭 볼 내용을 강조해요. 닫히지 않고 그 자리에 있어요.', when: ['설명서의 주의 · 팁', '양식 위의 안내'], vs: [{ id: 'banner', diff: '배너는 화면 맨 위 전체 폭에 붙어요.' }] },
  { id: 'push-notification', drawer: 'feedback', ko: '푸시 알림', en: 'Push notification', aliases: ['푸시', '노티'], hint: '앱을 안 켜도 휴대폰 위로 내려오는 알림', desc: '앱을 쓰지 않을 때도 휴대폰 잠금 화면이나 위쪽으로 내려오는 알림이에요.', when: ['주문 · 배송 소식', '채팅 메시지'], vs: [{ id: 'toast', diff: '토스트는 앱 안에서만 잠깐 떠요.' }] },
  { id: 'success-state', drawer: 'feedback', ko: '완료 화면', en: 'Success state', aliases: ['성공 화면', '결과 화면'], hint: '커다란 체크와 함께 끝났다고 알려 주는 화면', desc: '주문 · 가입처럼 큰 일이 끝났을 때 체크 표시와 다음 할 일을 보여 주는 화면이에요.', when: ['결제 · 가입 · 제출 뒤'] },
  { id: 'dialog-fullscreen', drawer: 'feedback', ko: '풀스크린 다이얼로그', en: 'Full-screen dialog', hint: '화면 전체를 덮는 입력 창, 위에 X와 저장', desc: '화면 전체를 덮어 긴 입력을 받는 창이에요. 위쪽에 닫기와 저장 버튼이 있어요.', when: ['모바일에서 일정 · 주소 입력'], vs: [{ id: 'modal', diff: '모달은 가운데 작게 떠요.' }] },

  // 로딩
  { id: 'progress-circular', drawer: 'loading', ko: '원형 프로그레스', en: 'Circular progress', aliases: ['도넛 진행'], hint: '동그라미 테두리가 차오르는 진행 표시', desc: '동그란 테두리가 퍼센트만큼 차오르며 얼마나 됐는지 보여 줘요.', when: ['업로드', '목표 달성률'], vs: [{ id: 'spinner', diff: '스피너는 얼마나 됐는지 모르고 돌기만 해요.' }] },
  { id: 'load-more', drawer: 'loading', ko: '더보기 버튼', en: 'Load more', hint: '목록 끝의 ‘더보기’ 버튼', desc: '목록 끝에서 눌러야 다음 내용을 이어 붙여요. 무한 스크롤과 페이지네이션의 중간이에요.', when: ['댓글 · 상품 목록'], vs: [{ id: 'infinite-scroll', diff: '무한 스크롤은 누르지 않아도 알아서 나와요.' }] },
  { id: 'lazy-loading', drawer: 'loading', ko: '지연 로딩', en: 'Lazy loading', hint: '내려서 보일 때가 돼서야 그림이 나타남', desc: '화면에 보일 때가 돼서야 그림 · 내용을 불러와서 첫 화면을 빠르게 해요.', when: ['사진이 많은 목록'] },
  { id: 'optimistic-ui', drawer: 'loading', ko: '낙관적 UI', en: 'Optimistic UI', hint: '서버 대답을 기다리지 않고 먼저 바뀌는 화면', desc: '서버가 “됐어요”라고 하기 전에 화면부터 바꿔서 빠르게 느끼게 해요. 실패하면 되돌려요.', when: ['좋아요 · 찜 · 메시지 보내기'] },
  { id: 'splash', drawer: 'loading', ko: '스플래시 화면', en: 'Splash screen', aliases: ['런치 스크린', '스플래시'], hint: '앱을 켜면 처음 잠깐 나오는 로고 화면', desc: '앱을 켜는 동안 잠깐 보이는 로고 화면이에요.', when: ['앱 시작'] },

  // 입력 폼
  { id: 'search-bar', drawer: 'input', ko: '검색바', en: 'Search bar', aliases: ['검색창'], hint: '돋보기가 있는 둥근 찾기 칸', desc: '돋보기 아이콘과 함께 무언가를 찾는 입력칸이에요. 보통 화면 위쪽에 있어요.', when: ['상품 · 글 찾기'], vs: [{ id: 'autocomplete', diff: '자동완성은 적는 중에 추천을 띄워요.' }], play: true },
  { id: 'floating-label', drawer: 'input', ko: '플로팅 라벨', en: 'Floating label', hint: '입력하면 칸 안의 이름이 위로 쏙 올라감', desc: '칸 안에 있던 이름표가 입력을 시작하면 테두리 위로 작게 떠올라요.', when: ['공간이 좁은 입력 양식'], vs: [{ id: 'text-field', diff: '텍스트 필드는 입력칸 전체를 부르는 이름이에요.' }] },
  { id: 'password-toggle', drawer: 'input', ko: '비밀번호 보기', en: 'Password visibility toggle', aliases: ['눈 아이콘'], hint: '비밀번호 칸 끝의 눈 모양 버튼', desc: '눈 아이콘을 눌러 가려진 비밀번호를 잠깐 보이게 해요.', when: ['로그인 · 가입'] },
  { id: 'otp-input', drawer: 'input', ko: '인증번호 입력칸', en: 'OTP input', aliases: ['PIN 입력', '코드 입력'], hint: '한 칸에 숫자 하나씩, 네모 여러 개', desc: '숫자를 한 칸에 하나씩 넣는 입력이에요. 다 채우면 저절로 넘어가요.', when: ['문자 인증', '결제 비밀번호'] },
  { id: 'textarea', drawer: 'input', ko: '텍스트 영역', en: 'Textarea', aliases: ['여러 줄 입력'], hint: '여러 줄 적는 큰 칸과 0/500 글자 수', desc: '여러 줄을 적는 큰 입력칸이에요. 아래에 글자 수를 세어 줘요.', when: ['리뷰 · 문의 · 메모'] },
  { id: 'file-upload', drawer: 'input', ko: '파일 업로드', en: 'File upload', aliases: ['드롭존', '첨부'], hint: '점선 상자에 파일을 끌어다 놓기', desc: '점선 상자에 파일을 끌어다 놓거나 눌러서 골라 올려요.', when: ['사진 · 서류 첨부'], vs: [{ id: 'drag-drop', diff: '드래그 앤 드롭은 끌어다 놓는 동작 이름이에요.' }] },
  { id: 'tag-input', drawer: 'input', ko: '태그 입력', en: 'Tag input', aliases: ['칩 입력', '토큰 필드'], hint: '적고 엔터 치면 칩으로 바뀌는 칸', desc: '단어를 적고 엔터를 누르면 칩으로 바뀌어 칸 안에 쌓여요.', when: ['키워드 · 받는 사람 입력'], vs: [{ id: 'chip', diff: '칩은 그 동그란 조각 하나의 이름이에요.' }] },
  { id: 'time-picker', drawer: 'input', ko: '타임 피커', en: 'Time picker', aliases: ['시간 선택'], hint: '돌리거나 눌러서 시 · 분 고르기', desc: '시와 분을 돌림판이나 시계판으로 골라요.', when: ['알람 · 예약 시간'], vs: [{ id: 'date-picker', diff: '데이트 피커는 날짜를 골라요.' }] },
  { id: 'color-picker', drawer: 'input', ko: '컬러 피커', en: 'Color picker', hint: '색 판에서 동그라미를 끌어 색 고르기', desc: '색 판과 막대에서 원하는 색을 골라요.', when: ['꾸미기 · 디자인 도구'] },
  { id: 'searchable-select', drawer: 'input', ko: '콤보박스', en: 'Combobox', aliases: ['검색되는 셀렉트'], hint: '목록을 열고 그 안에서 적어서 찾기', desc: '셀렉트 박스와 입력칸을 합친 것이에요. 적어서 목록을 줄인 뒤 골라요.', when: ['나라 · 지역처럼 고를 것이 아주 많을 때'], vs: [{ id: 'select', diff: '셀렉트 박스는 적어서 찾을 수 없어요.' }] },

  // 이동 구조
  { id: 'top-app-bar', drawer: 'nav', ko: '앱 바', en: 'Top app bar', aliases: ['툴바', '내비게이션 바', '헤더'], hint: '휴대폰 앱 맨 위 제목 줄과 아이콘', desc: '앱 화면 맨 위에 제목과 메뉴 · 뒤로 · 검색 아이콘이 놓이는 줄이에요.', when: ['모든 앱 화면 위쪽'], vs: [{ id: 'gnb', diff: 'GNB는 웹사이트의 큰 메뉴 줄이에요.' }], play: true },
  { id: 'navigation-rail', drawer: 'nav', ko: '내비게이션 레일', en: 'Navigation rail', hint: '왼쪽에 아이콘만 세로로 좁게', desc: '화면 왼쪽에 아이콘과 짧은 이름만 세로로 놓은 좁은 메뉴예요. 태블릿에서 많이 써요.', when: ['태블릿 · 넓은 화면 앱'], vs: [{ id: 'lnb', diff: 'LNB는 글자 메뉴가 넓게 펼쳐져 있어요.' }] },
  { id: 'steps', drawer: 'nav', ko: '단계 표시', en: 'Stepper (progress steps)', aliases: ['위저드', '진행 단계'], hint: '①─②─③ 지금 몇 단계인지', desc: '여러 단계로 나뉜 일에서 지금 몇 번째인지 동그라미와 선으로 보여 줘요.', when: ['가입 · 결제 · 신청서'], vs: [{ id: 'stepper', diff: '입력 폼의 스테퍼는 − 숫자 + 버튼이에요.' }] },
  { id: 'context-menu', drawer: 'nav', ko: '컨텍스트 메뉴', en: 'Context menu', aliases: ['우클릭 메뉴'], hint: '오른쪽 클릭하면 나오는 메뉴', desc: '오른쪽 클릭이나 길게 누르면 그 자리에 뜨는 메뉴예요.', when: ['파일 · 사진 · 글자 위에서'], vs: [{ id: 'popover', diff: '팝오버는 버튼을 눌러서 열어요.' }] },
  { id: 'command-palette', drawer: 'nav', ko: '커맨드 팔레트', en: 'Command palette', aliases: ['⌘K 메뉴', '빠른 실행'], hint: '⌘K 를 누르면 뜨는 검색 + 명령 창', desc: '단축키로 불러서 적기만 하면 이동 · 실행을 할 수 있는 창이에요.', when: ['기능이 많은 업무 도구'] },
  { id: 'scroll-spy', drawer: 'nav', ko: '스크롤 스파이', en: 'Scroll spy', aliases: ['목차 따라가기'], hint: '내리면 옆 목차의 현재 위치가 따라 켜짐', desc: '글을 내리는 대로 옆 목차에서 지금 읽는 곳이 켜져요.', when: ['긴 문서 · 설명서'] },
  { id: 'back-button', drawer: 'nav', ko: '뒤로 가기', en: 'Back button', aliases: ['백 버튼'], hint: '왼쪽 위 ‹ 화살표', desc: '앞 화면으로 돌아가는 왼쪽 위 화살표예요.', when: ['앱 하위 화면'] },

  // 콘텐츠 담기
  { id: 'list-item', drawer: 'content', ko: '리스트', en: 'List', aliases: ['목록', '리스트 아이템'], hint: '사진 · 제목 · 설명이 한 줄씩 쌓인 목록', desc: '항목을 한 줄씩 세로로 쌓은 목록이에요. 왼쪽 그림, 가운데 글, 오른쪽 부가 정보.', when: ['메일 · 채팅 · 설정'], vs: [{ id: 'card', diff: '카드는 덩어리로 떨어져 있어요.' }], play: true },
  { id: 'masonry', drawer: 'content', ko: '메이슨리', en: 'Masonry layout', aliases: ['핀터레스트형', '벽돌 배치'], hint: '높이가 제각각인 사진들이 벽돌처럼 쌓임', desc: '높이가 다른 카드들을 빈틈없이 벽돌처럼 엇갈려 쌓은 배치예요.', when: ['사진 · 아이디어 모음'], vs: [{ id: 'bento-grid', diff: '벤토 그리드는 칸이 반듯하게 맞물려요.' }] },
  { id: 'lightbox', drawer: 'content', ko: '라이트박스', en: 'Lightbox', hint: '사진을 누르면 어두운 화면에 크게', desc: '사진을 누르면 뒤를 어둡게 하고 크게 보여 줘요. 옆으로 넘길 수도 있어요.', when: ['상품 사진 · 갤러리'] },
  { id: 'timeline', drawer: 'content', ko: '타임라인', en: 'Timeline', hint: '세로 선 위에 점과 시간 순 기록', desc: '세로 선 위에 시간 순서대로 일을 점으로 찍어 보여 줘요.', when: ['배송 조회 · 이력'] },
  { id: 'stat-card', drawer: 'content', ko: '지표 카드', en: 'Stat card', aliases: ['KPI 카드', '숫자 카드'], hint: '큰 숫자 하나와 ▲12% 같은 변화', desc: '중요한 숫자 하나를 크게 보여 주고 지난번보다 얼마나 변했는지 붙여요.', when: ['대시보드'] },
  { id: 'chart', drawer: 'content', ko: '차트', en: 'Chart', aliases: ['그래프'], hint: '막대 · 선으로 그린 숫자 그림', desc: '숫자 흐름을 막대 · 선 · 원으로 그려 한눈에 보이게 해요.', when: ['매출 · 기록 비교'] },
  { id: 'kanban', drawer: 'content', ko: '칸반 보드', en: 'Kanban board', hint: '할 일 · 하는 중 · 끝 칸을 카드로 옮기기', desc: '할 일을 단계별 세로 칸에 카드로 놓고 옮기며 관리해요.', when: ['일정 · 업무 관리'] },
  { id: 'story', drawer: 'content', ko: '스토리', en: 'Stories', aliases: ['스토리 링'], hint: '맨 위 색 테두리 동그란 프로필 줄', desc: '색 테두리 동그라미를 누르면 짧은 글 · 사진이 넘어가며 보여요. 24시간 소식에 많이 써요.', when: ['새 소식 · 이벤트 모음'], play: true },
  { id: 'marquee', drawer: 'content', ko: '마퀴', en: 'Marquee', aliases: ['흐르는 글자', '티커'], hint: '옆으로 계속 흘러가는 글자 띠', desc: '글자 띠가 옆으로 끝없이 흘러가요.', when: ['공지 · 브랜드 띠'] },
  { id: 'divider', drawer: 'content', ko: '구분선', en: 'Divider', hint: '내용 사이의 얇은 가로선', desc: '내용 묶음 사이를 나누는 얇은 선이에요.', when: ['목록 · 설정 묶음 나누기'] },
  { id: 'footer', drawer: 'content', ko: '푸터', en: 'Footer', aliases: ['하단 정보'], hint: '페이지 맨 아래 회사 정보 · 링크 모음', desc: '페이지 맨 아래 회사 정보 · 약관 · 연락처를 모은 자리예요.', when: ['모든 웹사이트 바닥'] },
  { id: 'sticky-cta', drawer: 'content', ko: '하단 고정 버튼', en: 'Sticky CTA', aliases: ['플로팅 CTA', '바텀 CTA'], hint: '화면 맨 아래 꽉 찬 ‘구매하기’ 버튼', desc: '스크롤해도 화면 아래에 붙어 있는 큰 버튼이에요. 가장 중요한 행동 하나를 맡아요.', when: ['상품 상세 · 신청 화면'], vs: [{ id: 'fab', diff: '플로팅 버튼은 구석의 작은 동그라미예요.' }], play: true },
  { id: 'hover-card', drawer: 'content', ko: '툴팁 카드', en: 'Hover card', aliases: ['프리뷰 카드'], hint: '이름에 마우스를 올리면 뜨는 작은 프로필 카드', desc: '링크나 이름에 올리면 그 대상을 미리 보여 주는 작은 카드예요.', when: ['사람 · 링크 미리보기'], vs: [{ id: 'tooltip', diff: '툴팁은 짧은 글자만 담아요.' }] },

  // 디자인 스타일
  { id: 'aurora', drawer: 'style', ko: '오로라 그라디언트', en: 'Aurora gradient', aliases: ['메시 그라디언트'], hint: '여러 색이 번지는 부드러운 빛 배경', desc: '여러 색이 오로라처럼 번지는 흐릿한 그라디언트 배경이에요.', when: ['첫 화면 배경', 'AI · 테크 브랜드'] },
  { id: 'y2k', drawer: 'style', ko: 'Y2K', en: 'Y2K aesthetic', hint: '크롬 금속 글자, 반짝이, 2000년대 감성', desc: '2000년 무렵의 크롬 금속 질감, 반짝이, 쨍한 색을 다시 가져온 스타일이에요.', when: ['패션 · 음악 · 이벤트'] },
  { id: 'swiss', drawer: 'style', ko: '스위스 스타일', en: 'Swiss style', aliases: ['인터내셔널 타이포그래피'], hint: '반듯한 격자, 큰 글자, 빨강 · 검정', desc: '반듯한 격자와 큰 산세리프 글자, 빨강 · 검정으로 정리한 스타일이에요.', when: ['포스터 · 잡지 · 포트폴리오'] },
  { id: 'memphis', drawer: 'style', ko: '멤피스', en: 'Memphis design', hint: '지그재그 · 동그라미 · 물결이 흩뿌려진 원색', desc: '지그재그, 물결, 동그라미 같은 도형을 쨍한 색으로 흩뿌린 80년대풍 스타일이에요.', when: ['재미있는 이벤트 · 어린이'] },
  { id: 'pixel', drawer: 'style', ko: '픽셀 아트', en: 'Pixel art', aliases: ['8비트', '레트로 게임'], hint: '네모 점이 보이는 옛날 게임 그림', desc: '네모 점이 그대로 보이는 옛날 게임기 같은 스타일이에요.', when: ['게임 · 레트로 이벤트'] },
  { id: 'hand-drawn', drawer: 'style', ko: '손그림', en: 'Hand-drawn', aliases: ['두들', '스케치 스타일'], hint: '삐뚤빼뚤 연필로 그린 듯한 선', desc: '손으로 그린 듯 삐뚤빼뚤한 선과 글씨로 친근하게 만든 스타일이에요.', when: ['교육 · 아이디어 · 일기'] },
  { id: 'grain', drawer: 'style', ko: '그레인', en: 'Grain texture', aliases: ['노이즈'], hint: '오래된 사진처럼 자글자글한 점', desc: '화면에 자글자글한 점 질감을 얹어 필름 사진처럼 따뜻하게 만들어요.', when: ['감성 브랜드 · 그라디언트 배경'] },
  { id: 'isometric', drawer: 'style', ko: '아이소메트릭', en: 'Isometric', hint: '비스듬히 위에서 본 정육면체 그림', desc: '비스듬히 위에서 내려다본 입체 그림이에요. 원근 없이 반듯해요.', when: ['서비스 소개 일러스트'] },

  // 제스처와 움직임
  { id: 'double-tap', drawer: 'gesture', ko: '더블 탭', en: 'Double tap', aliases: ['두 번 탭'], hint: '사진을 두 번 톡톡 → 하트', desc: '빠르게 두 번 톡톡 눌러요. 사진에 좋아요를 누르거나 확대할 때 써요.', when: ['사진 좋아요', '지도 확대'], play: true },
  { id: 'edge-swipe', drawer: 'gesture', ko: '엣지 스와이프', en: 'Edge swipe', aliases: ['뒤로 밀기'], hint: '화면 왼쪽 가장자리에서 오른쪽으로 밀기', desc: '화면 가장자리에서 안쪽으로 밀어 뒤로 가거나 메뉴를 열어요.', when: ['앱에서 뒤로 가기'] },
  { id: 'scroll-snap', drawer: 'gesture', ko: '스크롤 스냅', en: 'Scroll snap', hint: '밀면 한 칸씩 딱딱 맞춰 멈춤', desc: '옆으로 밀다가 놓으면 카드 하나가 딱 맞게 멈춰요.', when: ['가로 카드 줄 · 사진 넘기기'], play: true },
  { id: 'haptic', drawer: 'gesture', ko: '햅틱 피드백', en: 'Haptic feedback', aliases: ['진동 피드백'], hint: '누를 때 손끝에 톡 오는 짧은 진동', desc: '누르거나 길게 누를 때 손끝에 짧은 진동으로 답해 줘요.', when: ['길게 누르기 · 스위치 · 결제 완료'] },
  { id: 'rubber-band', drawer: 'gesture', ko: '러버밴드', en: 'Rubber banding', aliases: ['오버스크롤 바운스'], hint: '끝에서 더 당기면 고무줄처럼 튕겨 돌아옴', desc: '목록 끝에서 더 당기면 살짝 늘어났다가 고무줄처럼 돌아와요. 끝에 닿았다는 신호예요.', when: ['목록 · 페이지 끝'] },
  { id: 'hover', drawer: 'gesture', ko: '호버', en: 'Hover', aliases: ['마우스 오버'], hint: '마우스를 올리기만 해도 바뀜', desc: '누르지 않고 마우스를 올리기만 했을 때 바뀌는 상태예요.', when: ['버튼 강조 · 미리보기'] },
  { id: 'drag-to-dismiss', drawer: 'gesture', ko: '끌어 내려 닫기', en: 'Drag to dismiss', hint: '시트를 아래로 끌어내리면 닫힘', desc: '바텀시트나 사진을 아래로 끌어내려서 닫아요.', when: ['바텀시트 · 사진 크게 보기'], play: true },

  // 메뉴 아이콘 별명
  { id: 'chevron', drawer: 'icon', ko: '셰브론', en: 'Chevron ›', aliases: ['꺾쇠'], hint: '‹ › 처럼 꺾인 화살표', desc: '‹ › ⌄ 처럼 꺾인 화살표예요. 넘기기 · 펼치기 · 더 들어가기를 뜻해요.', when: ['목록 오른쪽 끝', '아코디언'], vs: [{ id: 'caret', diff: '캐럿은 꽉 찬 작은 삼각형이에요.' }] },
  { id: 'caret', drawer: 'icon', ko: '캐럿', en: 'Caret ▾', hint: '글자 옆 꽉 찬 작은 삼각형', desc: '▾ 처럼 꽉 찬 작은 삼각형이에요. 눌러서 펼칠 수 있다는 뜻이에요.', when: ['드롭다운 버튼'], vs: [{ id: 'chevron', diff: '셰브론은 선으로 그린 꺾쇠예요.' }] },
  { id: 'drag-handle', drawer: 'icon', ko: '드래그 핸들', en: 'Drag handle ⠿', aliases: ['그리퍼', '그립'], hint: '점 여섯 개 · 줄 두세 개 손잡이', desc: '⠿ 처럼 점이나 줄이 모인 손잡이예요. 잡고 끌어서 순서를 바꿀 수 있다는 뜻이에요.', when: ['순서 바꾸기 목록'] },
  { id: 'grabber', drawer: 'icon', ko: '그래버', en: 'Grabber', aliases: ['시트 핸들', '드래그 바'], hint: '바텀시트 맨 위 짧은 회색 막대', desc: '바텀시트 맨 위의 짧은 회색 막대예요. 잡고 올리거나 내릴 수 있다는 표시예요.', when: ['바텀시트'], play: true },
  { id: 'share-icon', drawer: 'icon', ko: '공유 아이콘', en: 'Share icon', hint: '네모에서 위로 나가는 화살표, 또는 점 셋 연결', desc: '아이폰은 네모 위 화살표, 안드로이드는 점 세 개를 선으로 이은 모양이에요.', when: ['공유하기'] },
  { id: 'gear', drawer: 'icon', ko: '톱니바퀴', en: 'Gear icon ⚙', aliases: ['코그'], hint: '톱니바퀴 모양', desc: '톱니바퀴 모양. 설정 화면으로 가요.', when: ['설정'] },

  // AI 화면
  { id: 'typing-indicator', drawer: 'ai', ko: '입력 중 표시', en: 'Typing indicator', aliases: ['점 세 개 말풍선'], hint: '말풍선 안에서 통통 튀는 점 세 개', desc: '상대(또는 AI)가 답을 쓰고 있다는 걸 점 세 개가 튀며 알려 줘요.', when: ['채팅 · AI 대화'] },
  { id: 'thinking', drawer: 'ai', ko: '생각 중 표시', en: 'Thinking state', aliases: ['추론 표시'], hint: '‘생각하는 중…’ 글자와 접힌 생각 과정', desc: 'AI가 답을 만들기 전에 생각하는 중이라고 알리고, 펼치면 과정을 보여 줘요.', when: ['오래 걸리는 AI 답'] },
  { id: 'regenerate', drawer: 'ai', ko: '다시 생성', en: 'Regenerate', aliases: ['재생성'], hint: '답 아래 ↻ 돌아가는 화살표', desc: '마음에 안 드는 답을 다시 만들어 달라는 버튼이에요.', when: ['AI 답 아래'] },
  { id: 'feedback-thumbs', drawer: 'ai', ko: '답 평가', en: 'Thumbs feedback', aliases: ['좋아요 싫어요'], hint: '답 아래 엄지 위 · 아래', desc: '답이 좋았는지 엄지로 평가해요. 서비스를 나아지게 하는 데 써요.', when: ['AI 답 아래'] },
  { id: 'attachment-chip', drawer: 'ai', ko: '첨부 칩', en: 'Attachment chip', hint: '입력창 위 파일 이름 조각과 X', desc: '올린 파일이 입력창 위에 작은 조각으로 붙어요. X로 뺄 수 있어요.', when: ['파일 · 사진 질문'] },
  { id: 'voice-input', drawer: 'ai', ko: '음성 입력', en: 'Voice input', aliases: ['받아쓰기'], hint: '마이크 버튼과 출렁이는 소리 막대', desc: '마이크를 누르고 말하면 글로 바꿔 줘요. 소리 막대가 출렁여요.', when: ['손이 바쁠 때 · 모바일'] },
  { id: 'canvas-panel', drawer: 'ai', ko: '캔버스 패널', en: 'Canvas / Artifact panel', aliases: ['아티팩트', '사이드 캔버스'], hint: '대화 옆에 열리는 결과물 편집 판', desc: '대화 옆에 결과물(문서 · 코드 · 그림)을 따로 펼쳐 보고 고치는 판이에요.', when: ['긴 글 · 코드 만들기'] },

  // 다크 패턴
  { id: 'nagging', drawer: 'dark', ko: '반복 조르기', en: 'Nagging', aliases: ['잔소리 팝업'], hint: '거절해도 계속 다시 뜨는 요청', desc: '“알림 켜세요”처럼 거절해도 자꾸 다시 묻는 수법이에요.', when: ['쓰지 마세요! 거절은 기억해 두기'] },
  { id: 'disguised-ads', drawer: 'dark', ko: '위장 광고', en: 'Disguised ads', hint: '다운로드 버튼처럼 생긴 광고', desc: '진짜 버튼이나 글처럼 꾸며서 누르게 만드는 광고예요.', when: ['쓰지 마세요! 광고는 광고라고 표시'] },
  { id: 'trick-question', drawer: 'dark', ko: '헷갈리는 질문', en: 'Trick question', aliases: ['이중 부정'], hint: '“받지 않으려면 체크 해제하지 마세요”', desc: '이중 부정처럼 일부러 헷갈리게 물어 원치 않는 답을 고르게 해요.', when: ['쓰지 마세요! 질문은 한 번에 읽히게'] },
  { id: 'forced-continuity', drawer: 'dark', ko: '몰래 자동 결제', en: 'Forced continuity', aliases: ['무료 체험 함정'], hint: '무료 체험 끝나면 알림 없이 결제', desc: '무료 체험이 끝나면 미리 알리지 않고 결제를 시작하는 수법이에요.', when: ['쓰지 마세요! 결제 전에 꼭 알리기'] },
  { id: 'hidden-costs', drawer: 'dark', ko: '숨은 비용', en: 'Hidden costs', aliases: ['드립 프라이싱'], hint: '마지막 결제 단계에서 갑자기 붙는 수수료', desc: '처음엔 싸 보이게 하고 마지막 단계에서 배송비 · 수수료를 붙이는 수법이에요.', when: ['쓰지 마세요! 총액을 처음부터'] },
  { id: 'bait-switch', drawer: 'dark', ko: '미끼 상술', en: 'Bait and switch', hint: '누른 것과 다른 일이 일어남', desc: '닫기 버튼인 줄 알았는데 다른 일이 일어나는 것처럼, 기대와 다른 결과를 내는 수법이에요.', when: ['쓰지 마세요! 버튼은 말한 대로'] },

  // ─── 더 많은 이름 (0.4.0) ───
  // 알림과 피드백
  { id: 'notification-center', drawer: 'feedback', ko: '알림 센터', en: 'Notification center', aliases: ['알림함'], hint: '종 아이콘을 누르면 펼쳐지는 알림 목록', desc: '종 아이콘을 누르면 지난 알림이 목록으로 펼쳐져요. 읽지 않은 것은 점으로 표시해요.', when: ['커뮤니티 · 업무 도구'], vs: [{ id: 'push-notification', diff: '푸시 알림은 앱 밖에서 하나씩 와요.' }] },
  { id: 'presence-dot', drawer: 'feedback', ko: '접속 상태 점', en: 'Presence indicator', aliases: ['온라인 점'], hint: '프로필 사진 모서리의 초록 점', desc: '프로필 사진 모서리의 작은 점으로 지금 접속 중인지 알려 줘요.', when: ['메신저 · 협업 도구'], vs: [{ id: 'badge', diff: '뱃지는 개수나 새 소식을 알려요.' }] },
  { id: 'status-pill', drawer: 'feedback', ko: '상태 라벨', en: 'Status pill', aliases: ['스테이터스 칩'], hint: '‘배송 중’ ‘완료’ 같은 색깔 알약', desc: '주문 · 일의 상태를 색깔 알약 하나로 보여 줘요. 색은 상태마다 정해 둬요.', when: ['주문 내역 · 관리자 표'] },
  { id: 'live-validation', drawer: 'feedback', ko: '실시간 검사', en: 'Live validation', aliases: ['입력 확인 체크'], hint: '적는 동안 ✓ · ✕ 가 바로바로 바뀜', desc: '다 적고 나서가 아니라 적는 동안 조건을 하나씩 검사해서 ✓ 로 알려 줘요.', when: ['비밀번호 조건 · 아이디 중복 확인'], vs: [{ id: 'inline-error', diff: '인라인 오류는 틀린 것만 알려 줘요.' }] },
  { id: 'cookie-banner', drawer: 'feedback', ko: '쿠키 배너', en: 'Cookie consent banner', aliases: ['쿠키 동의'], hint: '화면 아래 ‘쿠키 허용’ 띠', desc: '사이트에 처음 오면 쿠키를 써도 되는지 묻는 띠예요. 해외 사이트에서 많이 봐요.', when: ['개인정보 동의가 필요한 사이트'] },
  { id: 'daily-popup', drawer: 'feedback', ko: '오늘 하루 보지 않기', en: 'Dismissible promo popup', aliases: ['공지 팝업', '이벤트 팝업'], hint: '첫 화면 이벤트 팝업 아래 ‘오늘 하루 보지 않기’', desc: '첫 화면에 뜨는 공지 · 이벤트 창이에요. 아래에 ‘오늘 하루 보지 않기’와 ‘닫기’가 붙어요. 한국 사이트에서 특히 많아요.', when: ['행사 · 휴무 공지'], vs: [{ id: 'modal', diff: '모달은 대답을 받기 위한 창이에요.' }] },
  { id: 'error-404', drawer: 'feedback', ko: '404 페이지', en: '404 error page', aliases: ['에러 페이지', '페이지 없음'], hint: '‘페이지를 찾을 수 없어요’ 큰 숫자 404', desc: '없는 주소로 들어왔을 때 보여 주는 화면이에요. 홈으로 가는 길을 꼭 알려 줘요.', when: ['모든 웹사이트'] },
  { id: 'permission-prompt', drawer: 'feedback', ko: '권한 요청', en: 'Permission prompt', aliases: ['권한 팝업'], hint: '‘위치 정보를 허용할까요?’ 창', desc: '위치 · 카메라 · 알림을 써도 되는지 묻는 창이에요. 왜 필요한지 먼저 알려 주면 허용이 늘어요.', when: ['처음 그 기능을 쓸 때'] },

  // 로딩
  { id: 'blur-up', drawer: 'loading', ko: '블러 업', en: 'Blur-up image', aliases: ['프로그레시브 이미지', 'LQIP'], hint: '뿌연 사진이 점점 또렷해짐', desc: '아주 작은 흐린 사진을 먼저 보여 주고 진짜 사진으로 또렷하게 바꿔요.', when: ['사진이 큰 페이지'], vs: [{ id: 'skeleton', diff: '스켈레톤은 회색 상자로 자리만 잡아요.' }] },
  { id: 'loading-dots', drawer: 'loading', ko: '점 로딩', en: 'Loading dots', hint: '● ● ● 가 차례로 깜빡임', desc: '점 세 개가 차례로 깜빡이며 기다리는 중임을 알려요.', when: ['짧은 대기 · 버튼 안'], vs: [{ id: 'spinner', diff: '스피너는 동그라미가 돌아요.' }] },
  { id: 'top-loading-bar', drawer: 'loading', ko: '상단 로딩 바', en: 'Top loading bar', aliases: ['페이지 로딩 바'], hint: '페이지 맨 위에 얇은 색 줄이 지나감', desc: '다음 페이지로 넘어가는 동안 화면 맨 위에 얇은 줄이 차올라요.', when: ['페이지 이동이 있는 웹앱'] },
  { id: 'retry-state', drawer: 'loading', ko: '다시 시도', en: 'Error retry state', aliases: ['재시도'], hint: '‘불러오지 못했어요’ + 다시 시도 버튼', desc: '불러오기에 실패했을 때 이유와 ‘다시 시도’ 버튼을 보여 줘요.', when: ['네트워크 오류'] },
  { id: 'offline-banner', drawer: 'loading', ko: '오프라인 표시', en: 'Offline indicator', hint: '‘인터넷 연결이 끊겼어요’ 회색 띠', desc: '인터넷이 끊기면 화면에 알리고, 다시 연결되면 저절로 사라져요.', when: ['모바일 앱 · 웹앱'] },

  // 입력 폼
  { id: 'icon-button', drawer: 'input', ko: '아이콘 버튼', en: 'Icon button', hint: '글자 없이 아이콘만 있는 동그란 버튼', desc: '글자 없이 아이콘만 있는 버튼이에요. 툴팁이나 읽어 줄 이름을 꼭 붙여요.', when: ['닫기 · 공유 · 좋아요'] },
  { id: 'button-hierarchy', drawer: 'input', ko: '버튼 위계', en: 'Button hierarchy', aliases: ['채움 · 테두리 · 글자 버튼', 'Primary · Secondary'], hint: '색이 꽉 찬 버튼 · 테두리 버튼 · 글자만 버튼', desc: '중요한 순서대로 채운 버튼 → 테두리 버튼 → 글자 버튼을 써서 눈이 갈 곳을 정해요.', when: ['한 화면에 버튼이 여러 개일 때'] },
  { id: 'split-button', drawer: 'input', ko: '스플릿 버튼', en: 'Split button', hint: '버튼 오른쪽에 ▾ 가 따로 붙음', desc: '왼쪽은 바로 실행, 오른쪽 ▾ 는 다른 선택지를 여는 두 칸짜리 버튼이에요.', when: ['저장 / 다른 이름으로 저장'] },
  { id: 'agree-all', drawer: 'input', ko: '전체 동의', en: 'Select all consent', aliases: ['약관 전체 동의'], hint: '맨 위 ‘전체 동의’ 체크 아래 약관들', desc: '맨 위 하나를 체크하면 아래 약관이 모두 체크돼요. 필수와 선택을 꼭 나눠 보여 줘요.', when: ['회원가입'], vs: [{ id: 'preselection', diff: '기본 선택 함정은 선택 항목을 미리 체크해 둬요.' }] },
  { id: 'social-login', drawer: 'input', ko: '소셜 로그인', en: 'Social login buttons', aliases: ['간편 로그인'], hint: '카카오 · 네이버 · 구글로 시작하기 버튼', desc: '다른 서비스 계정으로 한 번에 가입 · 로그인하는 버튼 묶음이에요.', when: ['가입 · 로그인 화면'] },
  { id: 'postcode', drawer: 'input', ko: '우편번호 찾기', en: 'Address search', aliases: ['주소 검색'], hint: '주소 칸 옆 ‘우편번호 찾기’ 버튼', desc: '도로명을 적으면 주소 목록이 뜨고, 고르면 칸이 채워져요. 상세 주소만 직접 적어요.', when: ['배송지 입력'] },
  { id: 'signature-pad', drawer: 'input', ko: '서명 패드', en: 'Signature pad', hint: '손가락으로 이름을 쓰는 네모 칸', desc: '손가락이나 마우스로 서명을 그리는 칸이에요. ‘다시 쓰기’가 함께 있어요.', when: ['계약 · 동의서'] },
  { id: 'emoji-picker', drawer: 'input', ko: '이모지 피커', en: 'Emoji picker', hint: '웃는 얼굴 눌러서 뜨는 이모지 판', desc: '이모지를 분류별 판에서 골라 넣어요.', when: ['채팅 · 댓글'] },
  { id: 'mention', drawer: 'input', ko: '멘션', en: 'Mention', aliases: ['@태그'], hint: '@ 를 적으면 사람 목록이 뜸', desc: '@ 를 적으면 사람 목록이 떠서 골라 부를 수 있어요. 불린 사람에게 알림이 가요.', when: ['댓글 · 협업 도구'], vs: [{ id: 'autocomplete', diff: '자동완성은 검색어를 추천해요.' }] },
  { id: 'rich-text-editor', drawer: 'input', ko: '리치 텍스트 에디터', en: 'Rich text editor', aliases: ['WYSIWYG', '글쓰기 에디터'], hint: '위에 B I U 툴바가 있는 글쓰기 칸', desc: '굵게 · 기울임 · 목록 같은 꾸밈을 툴바로 넣으며 쓰는 칸이에요.', when: ['게시글 · 메일 쓰기'], vs: [{ id: 'textarea', diff: '텍스트 영역은 꾸밈 없이 글자만 적어요.' }] },
  { id: 'captcha', drawer: 'input', ko: '캡차', en: 'CAPTCHA', aliases: ['로봇이 아닙니다'], hint: '‘로봇이 아닙니다’ 체크와 그림 고르기', desc: '사람인지 확인하려고 체크나 그림 고르기를 시켜요. 자동 가입 · 도배를 막아요.', when: ['가입 · 로그인 반복 실패'] },

  // 이동 구조
  { id: 'scrollable-tabs', drawer: 'nav', ko: '스크롤 탭', en: 'Scrollable tabs', aliases: ['카테고리 탭'], hint: '옆으로 넘쳐서 밀어야 보이는 탭 줄', desc: '탭이 많아 옆으로 밀어서 보는 탭 줄이에요. 끝이 잘려 보여야 더 있다는 걸 알아요.', when: ['쇼핑 · 뉴스 카테고리'], vs: [{ id: 'tabs', diff: '탭은 한 줄에 모두 보여요.' }] },
  { id: 'table-of-contents', drawer: 'nav', ko: '목차', en: 'Table of contents', aliases: ['TOC'], hint: '글 맨 앞 · 옆의 제목 목록', desc: '긴 글의 제목들을 모아 눌러서 바로 갈 수 있게 해요.', when: ['설명서 · 긴 블로그 글'], vs: [{ id: 'scroll-spy', diff: '스크롤 스파이는 목차에 지금 위치를 켜 줘요.' }] },
  { id: 'skip-link', drawer: 'nav', ko: '본문 바로가기', en: 'Skip link', hint: 'Tab 키를 누르면 맨 위에 뜨는 숨은 링크', desc: '키보드 사용자를 위해 메뉴를 건너뛰고 본문으로 바로 가게 해 주는 숨은 링크예요.', when: ['모든 웹사이트 (접근성)'] },
  { id: 'quick-menu', drawer: 'nav', ko: '퀵메뉴', en: 'Quick menu', aliases: ['윙 배너', '따라다니는 메뉴'], hint: '오른쪽에 떠서 따라오는 ‘최근 본 상품 · TOP’', desc: '스크롤해도 오른쪽에 떠서 따라오는 작은 메뉴예요. 최근 본 상품, 장바구니, 맨 위로가 들어 있어요. 한국 쇼핑몰에 많아요.', when: ['쇼핑몰 PC 화면'], vs: [{ id: 'fab', diff: '플로팅 버튼은 버튼 하나예요.' }] },
  { id: 'master-detail', drawer: 'nav', ko: '목록-상세', en: 'Master-detail (split view)', aliases: ['분할 화면', '스플릿 뷰'], hint: '왼쪽 목록에서 고르면 오른쪽에 내용', desc: '왼쪽 목록에서 고르면 오른쪽에 바로 내용이 나와요. 화면을 바꾸지 않고 비교해 봐요.', when: ['메일 · 메모 · 설정'] },
  { id: 'tree-view', drawer: 'nav', ko: '트리 뷰', en: 'Tree view', aliases: ['폴더 트리'], hint: '▸ 를 누르면 하위 폴더가 펼쳐짐', desc: '폴더 속 폴더처럼 겹겹이 들어간 항목을 ▸ 로 펼치고 접어요.', when: ['파일 탐색기 · 분류 관리'], vs: [{ id: 'accordion', diff: '아코디언은 한 단계만 펼쳐요.' }] },
  { id: 'dock', drawer: 'nav', ko: '독', en: 'Dock', hint: '화면 아래 떠 있는 앱 아이콘 줄', desc: '화면 아래에 떠 있는 자주 쓰는 앱 아이콘 줄이에요. 올리면 아이콘이 커지기도 해요.', when: ['컴퓨터 바탕 화면'], vs: [{ id: 'tab-bar', diff: '탭 바는 한 앱 안의 화면을 바꿔요.' }] },
  { id: 'sitemap', drawer: 'nav', ko: '사이트맵', en: 'Sitemap', hint: '사이트의 모든 메뉴를 한 장에 펼친 지도', desc: '사이트 안의 모든 메뉴를 갈래별로 한 화면에 펼쳐 보여 줘요.', when: ['공공 · 기관 사이트'], vs: [{ id: 'mega-menu', diff: '메가 메뉴는 마우스를 올릴 때만 펼쳐져요.' }] },

  // 콘텐츠 담기
  { id: 'ribbon', drawer: 'content', ko: '리본', en: 'Ribbon', aliases: ['코너 라벨', 'BEST 띠'], hint: '사진 모서리에 비스듬히 붙은 ‘BEST’ 띠', desc: '사진이나 카드 모서리에 붙여 ‘BEST · NEW · 품절’을 알려요.', when: ['상품 목록'], vs: [{ id: 'badge', diff: '뱃지는 아이콘 위 숫자 점이에요.' }] },
  { id: 'sale-price', drawer: 'content', ko: '할인 가격 표시', en: 'Sale price', aliases: ['취소선 가격'], hint: '빨간 % + 줄 그은 원래 가격', desc: '할인율, 할인된 가격, 줄 그은 원래 가격을 한 줄에 보여 줘요.', when: ['쇼핑 상품'] },
  { id: 'thumbnail-gallery', drawer: 'content', ko: '썸네일 갤러리', en: 'Thumbnail gallery', hint: '큰 사진 아래 작은 사진들을 눌러 바꾸기', desc: '큰 사진 아래 작은 사진들이 있고, 누르면 큰 사진이 바뀌어요.', when: ['상품 상세'], vs: [{ id: 'carousel', diff: '캐러셀은 옆으로 넘겨요.' }] },
  { id: 'pricing-table', drawer: 'content', ko: '요금제 표', en: 'Pricing table', aliases: ['플랜 비교'], hint: '나란한 요금제 카드, 가운데 ‘추천’', desc: '요금제를 나란히 놓고 차이를 비교하게 해요. 추천 하나를 강조해요.', when: ['구독 서비스'] },
  { id: 'testimonial', drawer: 'content', ko: '후기 카드', en: 'Testimonial', aliases: ['리뷰 카드'], hint: '큰따옴표와 사람 사진이 있는 후기', desc: '쓴 사람의 사진 · 이름과 함께 후기 한마디를 크게 보여 줘요.', when: ['소개 · 첫 화면'] },
  { id: 'blockquote', drawer: 'content', ko: '인용구', en: 'Blockquote', hint: '왼쪽에 굵은 선이 있는 들여 쓴 글', desc: '다른 글에서 가져온 말을 왼쪽 선과 들여쓰기로 구분해요.', when: ['블로그 · 기사'] },
  { id: 'code-block', drawer: 'content', ko: '코드 블록', en: 'Code block', hint: '어두운 상자 속 색깔 코드와 복사 버튼', desc: '코드를 고정폭 글꼴과 색으로 보여 주고 복사 버튼을 붙여요.', when: ['개발 문서 · AI 답'] },
  { id: 'map-pin', drawer: 'content', ko: '지도 핀', en: 'Map pin', aliases: ['마커'], hint: '지도 위 물방울 모양 표시', desc: '지도 위 위치를 물방울 모양 핀으로 찍어요. 누르면 정보 말풍선이 떠요.', when: ['매장 찾기 · 배달'] },
  { id: 'calendar-view', drawer: 'content', ko: '캘린더', en: 'Calendar view', aliases: ['월간 일정'], hint: '한 달 칸마다 색 막대 일정', desc: '한 달을 칸으로 나누고 날짜마다 일정을 색 막대로 보여 줘요.', when: ['예약 · 일정 관리'], vs: [{ id: 'date-picker', diff: '데이트 피커는 날짜 하나를 고르는 입력이에요.' }] },
  { id: 'before-after', drawer: 'content', ko: '비포 애프터', en: 'Before / after slider', aliases: ['이미지 비교'], hint: '가운데 손잡이를 끌어 두 사진 비교', desc: '두 사진을 겹쳐 놓고 가운데 손잡이를 끌어 전후를 비교해요.', when: ['보정 · 리모델링 · 화장품'] },
  { id: 'truncation', drawer: 'content', ko: '말줄임', en: 'Text truncation', aliases: ['말줄임표', '…더보기'], hint: '긴 글 끝이 … 로 잘림', desc: '정해진 줄을 넘는 글을 … 로 자르고, 필요하면 ‘더보기’를 붙여요.', when: ['상품명 · 미리보기 글'] },

  // 디자인 스타일
  { id: 'liquid-glass', drawer: 'style', ko: '리퀴드 글래스', en: 'Liquid Glass', hint: '물방울처럼 굴절되며 빛나는 유리', desc: '글래스모피즘보다 더 두껍고 투명한 유리예요. 가장자리가 빛을 굴절시켜 반짝여요.', when: ['최신 운영체제 느낌의 메뉴 · 버튼'], vs: [{ id: 'glassmorphism', diff: '글래스모피즘은 뿌연 반투명 판이에요.' }] },
  { id: 'cyberpunk', drawer: 'style', ko: '사이버펑크', en: 'Cyberpunk / Neon', aliases: ['네온'], hint: '검은 바탕에 빛나는 분홍 · 하늘 네온', desc: '어두운 바탕에 번쩍이는 네온 색과 빛 번짐으로 미래 도시 느낌을 줘요.', when: ['게임 · 음악 · 테크 행사'] },
  { id: 'monochrome', drawer: 'style', ko: '모노크롬', en: 'Monochrome', aliases: ['흑백'], hint: '검정 · 흰색 · 회색만', desc: '한 가지 색(주로 흑백)의 밝기만으로 그린 스타일이에요. 사진과 글이 돋보여요.', when: ['패션 · 사진 · 고급 브랜드'] },
  { id: 'duotone', drawer: 'style', ko: '듀오톤', en: 'Duotone', hint: '사진을 두 가지 색으로만 물들임', desc: '사진을 두 가지 색으로만 다시 칠해서 강한 인상을 줘요.', when: ['포스터 · 음악 · 행사'] },
  { id: 'bauhaus', drawer: 'style', ko: '바우하우스', en: 'Bauhaus', hint: '빨강 · 파랑 · 노랑 동그라미 · 네모 · 세모', desc: '기본 도형과 빨강 · 파랑 · 노랑으로 단순하고 힘 있게 구성한 스타일이에요.', when: ['포스터 · 브랜드 그래픽'], vs: [{ id: 'memphis', diff: '멤피스는 도형을 장난스럽게 흩뿌려요.' }] },
  { id: 'corporate-memphis', drawer: 'style', ko: '코퍼레이트 멤피스', en: 'Corporate Memphis', aliases: ['알레그리아'], hint: '팔다리가 길쭉한 납작한 사람 일러스트', desc: '팔다리가 과장된 납작한 사람 그림이에요. 테크 회사 소개 페이지에서 정말 많이 봐요.', when: ['서비스 소개 일러스트'] },
  { id: 'editorial', drawer: 'style', ko: '에디토리얼', en: 'Editorial', aliases: ['매거진 스타일'], hint: '잡지처럼 큰 명조 제목과 여백', desc: '잡지처럼 큰 세리프(명조) 제목, 넓은 여백, 단 나누기로 읽는 맛을 살려요.', when: ['브랜드 스토리 · 기사'], vs: [{ id: 'swiss', diff: '스위스 스타일은 산세리프와 격자가 중심이에요.' }] },
  { id: 'blob', drawer: 'style', ko: '블롭', en: 'Blob / Organic shapes', aliases: ['유기적 도형'], hint: '말랑한 물방울 같은 비정형 덩어리 배경', desc: '모서리 없이 말랑한 덩어리 도형을 배경에 깔아 부드럽게 만들어요.', when: ['소개 페이지 배경'] },

  // 제스처와 움직임
  { id: 'swipe-cards', drawer: 'gesture', ko: '스와이프 카드', en: 'Swipe cards', aliases: ['카드 스택'], hint: '카드를 좌우로 던져 고르기', desc: '쌓인 카드를 오른쪽(좋아요) · 왼쪽(넘기기)으로 던져서 골라요.', when: ['추천 · 매칭 · 퀴즈'], vs: [{ id: 'swipe', diff: '스와이프는 미는 동작 자체의 이름이에요.' }] },
  { id: 'shake-undo', drawer: 'gesture', ko: '흔들어 되돌리기', en: 'Shake to undo', hint: '휴대폰을 흔들면 ‘실행 취소할까요?’', desc: '휴대폰을 흔들면 방금 한 일을 되돌릴지 물어요.', when: ['글 입력 실수'] },
  { id: 'scroll-reveal', drawer: 'gesture', ko: '스크롤 등장', en: 'Scroll reveal', aliases: ['스크롤 애니메이션'], hint: '내리면 아래 내용이 스르륵 떠오름', desc: '스크롤해서 보일 때가 되면 내용이 아래에서 스르륵 떠오르며 나타나요.', when: ['소개 · 랜딩 페이지'], vs: [{ id: 'parallax', diff: '패럴랙스는 앞뒤가 다른 빠르기로 움직여요.' }] },
  { id: 'shared-element', drawer: 'gesture', ko: '공유 요소 전환', en: 'Shared element transition', aliases: ['히어로 전환'], hint: '누른 사진이 그대로 커지며 다음 화면이 됨', desc: '목록의 사진이 끊기지 않고 그대로 커지면서 상세 화면으로 이어져요.', when: ['목록 → 상세'] },
  { id: 'easing', drawer: 'gesture', ko: '이징', en: 'Easing', aliases: ['가속 · 감속 곡선'], hint: '빨리 출발해서 천천히 멈추는 움직임', desc: '움직임의 빠르기 곡선이에요. 빨리 출발해 천천히 멈추면 자연스러워 보여요.', when: ['모든 애니메이션'] },
  { id: 'spring', drawer: 'gesture', ko: '스프링 애니메이션', en: 'Spring animation', aliases: ['바운스'], hint: '도착해서 살짝 튕기고 멈춤', desc: '용수철처럼 목표를 살짝 넘었다가 튕겨 돌아오며 멈춰요. 손에 붙는 느낌을 줘요.', when: ['끌어서 놓기 · 팝업 등장'], vs: [{ id: 'easing', diff: '이징은 튕기지 않고 곡선대로 멈춰요.' }] },

  // 메뉴 아이콘 별명
  { id: 'info-icon', drawer: 'icon', ko: '정보 아이콘', en: 'Info icon ⓘ', hint: '동그라미 안 i', desc: '동그라미 안의 i. 누르거나 올리면 설명이 나와요. 보통 툴팁과 같이 써요.', when: ['용어 설명'] },
  { id: 'external-link', drawer: 'icon', ko: '새 창 아이콘', en: 'External link ↗', hint: '네모에서 오른쪽 위로 나가는 화살표', desc: '누르면 다른 사이트나 새 창으로 열린다는 표시예요.', when: ['바깥 링크'] },
  { id: 'hamburger-morph', drawer: 'icon', ko: '햄버거 → X', en: 'Hamburger to close morph', hint: '☰ 세 줄이 접혀 ✕ 로 변신', desc: '메뉴를 열면 ☰ 가 ✕ 로 바뀌어 같은 자리에서 닫을 수 있어요.', when: ['모바일 메뉴 열고 닫기'], vs: [{ id: 'hamburger', diff: '햄버거는 세 줄 모양 그 자체예요.' }] },
  { id: 'bookmark-icon', drawer: 'icon', ko: '북마크', en: 'Bookmark icon', aliases: ['저장 아이콘'], hint: '아래가 V 로 파인 리본', desc: '아래가 파인 리본 모양. 나중에 보려고 저장할 때 써요.', when: ['글 · 상품 저장'] },
  { id: 'refresh-icon', drawer: 'icon', ko: '새로고침 아이콘', en: 'Refresh icon ↻', hint: '끝이 화살표인 동그라미', desc: '끝이 화살표인 동그라미. 다시 불러오기를 뜻해요.', when: ['목록 새로고침'] },

  // AI 화면
  { id: 'model-picker', drawer: 'ai', ko: '모델 선택', en: 'Model picker', hint: '입력창 근처 ‘빠름 ▾’ 같은 드롭다운', desc: '어떤 AI 모델로 답할지 고르는 작은 드롭다운이에요.', when: ['여러 모델을 쓰는 AI 서비스'] },
  { id: 'stop-button', drawer: 'ai', ko: '멈추기 버튼', en: 'Stop generating', hint: '답을 쓰는 동안 보내기 자리에 ■', desc: 'AI가 답을 쓰는 동안 보내기 버튼이 네모(■)로 바뀌어 중간에 멈출 수 있어요.', when: ['스트리밍 응답 중'] },
  { id: 'copy-button', drawer: 'ai', ko: '복사 버튼', en: 'Copy button', hint: '겹친 네모 ⧉ → 누르면 ✓ 복사됨', desc: '누르면 내용을 복사하고 잠깐 ✓ 로 바뀌어 알려 줘요.', when: ['코드 블록 · AI 답'] },
  { id: 'chat-history', drawer: 'ai', ko: '대화 목록', en: 'Chat history sidebar', hint: '왼쪽에 지난 대화 제목들', desc: '지난 대화들을 왼쪽에 제목으로 모아 두고 다시 열어요.', when: ['대화형 AI'] },
  { id: 'tool-call', drawer: 'ai', ko: '도구 사용 표시', en: 'Tool call indicator', aliases: ['검색 중 표시'], hint: '‘웹에서 찾는 중…’ 작은 줄', desc: 'AI가 검색 · 계산 같은 도구를 쓰는 중이라고 작은 줄로 알려 줘요. 펼치면 무엇을 했는지 보여요.', when: ['검색하는 AI · 에이전트'], vs: [{ id: 'thinking', diff: '생각 중 표시는 AI 혼자 고민하는 과정이에요.' }] },
  { id: 'smart-reply', drawer: 'ai', ko: '빠른 답장', en: 'Smart reply', aliases: ['추천 답장'], hint: '받은 메시지 아래 ‘좋아요!’ 같은 답 칩', desc: '받은 메시지에 맞는 짧은 답을 칩으로 추천해서 눌러 바로 보내요.', when: ['메신저 · 메일'], vs: [{ id: 'suggestion-chips', diff: '추천 질문은 AI에게 물을 말을 추천해요.' }] },

  // 다크 패턴
  { id: 'fake-social-proof', drawer: 'dark', ko: '가짜 사회적 증거', en: 'Fake social proof', hint: '‘지금 23명이 보고 있어요’', desc: '확인할 수 없는 ‘지금 몇 명이 보는 중’ ‘방금 누가 샀어요’로 서두르게 해요.', when: ['쓰지 마세요! 진짜 숫자만'] },
  { id: 'fake-scarcity', drawer: 'dark', ko: '거짓 품절 임박', en: 'Fake scarcity', hint: '늘 ‘2개 남았어요’', desc: '재고가 넉넉한데도 ‘몇 개 안 남았어요’라고 겁을 줘요.', when: ['쓰지 마세요!'], vs: [{ id: 'false-urgency', diff: '거짓 긴급성은 시간으로 겁을 줘요.' }] },
  { id: 'friend-spam', drawer: 'dark', ko: '친구 스팸', en: 'Friend spam', hint: '연락처를 가져가 친구에게 초대 문자', desc: '연락처를 허락받은 김에 내 이름으로 친구들에게 초대를 보내요.', when: ['쓰지 마세요! 보내기 전에 꼭 묻기'] },
  { id: 'misdirection', drawer: 'dark', ko: '시선 돌리기', en: 'Misdirection', hint: '해지 버튼은 작은 회색, 유지는 크게', desc: '원하는 쪽 버튼만 크고 눈에 띄게, 다른 쪽은 작고 흐리게 만들어요.', when: ['쓰지 마세요! 선택지는 같은 무게로'], vs: [{ id: 'button-hierarchy', diff: '버튼 위계는 사용자에게 도움 되는 순서로 써요.' }] },
  { id: 'autoplay-next', drawer: 'dark', ko: '자동 재생 함정', en: 'Autoplay trap', hint: '끝나면 5초 뒤 다음 화가 저절로', desc: '멈출 틈 없이 다음 영상 · 다음 화를 저절로 틀어 계속 보게 해요.', when: ['쓰지 마세요! 끄는 설정을 쉽게'] },
]

export const byId = new Map(ENTRIES.map((e) => [e.id, e]))

// ─── 찾기 ───
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'

/** 한글을 초성으로 바꿔요: 토스트 → ㅌㅅㅌ */
export function choseong(s: string) {
  return [...s].map((c) => {
    const code = c.charCodeAt(0) - 0xac00
    return code >= 0 && code < 11172 ? CHO[Math.floor(code / 588)] : c
  }).join('')
}

const norm = (s: string) => s.toLowerCase().replace(/[\s·_\-]/g, '')

/** 이름 · 영어 이름 · 다른 이름 · 모양 설명 · 초성으로 찾아요. 이름이 맞을수록 앞에 와요. */
export function search(query: string, list: Entry[] = ENTRIES): Entry[] {
  const q = norm(query)
  if (!q) return list
  const onlyCho = /^[ㄱ-ㅎ]+$/.test(q)
  const scored = list.map((e) => {
    const names = [e.ko, e.en, ...(e.aliases ?? [])].map(norm)
    let score = 0
    if (onlyCho) score = names.some((n) => choseong(n).includes(q)) ? 3 : 0
    else if (names.some((n) => n === q)) score = 5
    else if (names.some((n) => n.startsWith(q))) score = 4
    else if (names.some((n) => n.includes(q))) score = 3
    else if (norm(e.hint).includes(q)) score = 2
    else if (norm(e.desc).includes(q)) score = 1
    return { e, score }
  })
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.e)
}
