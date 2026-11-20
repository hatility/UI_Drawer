// 카드에 덧붙이는 이야기: 난이도 · 한국 앱에 많은 UI · 변천사와 계보 · 흔한 실수 · 다른 곳에서 부르는 이름 · 자주 틀리는 이름
import { ENTRIES, byId, type DrawerId, type Entry } from './data'

// ─── 난이도: 입문(꼭 아는 30장) · 중급(헷갈리는 짝이 있는 부품) · 전문가(나머지) ───
export const BASIC = ['button-hierarchy', 'text-field', 'checkbox', 'radio', 'toggle', 'select', 'chip', 'search-bar', 'gnb', 'tabs', 'breadcrumb', 'pagination', 'hamburger-menu', 'tab-bar', 'drawer', 'bottom-sheet', 'modal', 'toast', 'snackbar', 'tooltip', 'badge', 'banner', 'spinner', 'skeleton', 'progress', 'card', 'accordion', 'carousel', 'avatar', 'empty-state']
const PART: DrawerId[] = ['feedback', 'input', 'nav', 'content', 'loading', 'gesture', 'ai']
export type Level = 1 | 2 | 3
export const levelOf = (e: Entry): Level => (BASIC.includes(e.id) ? 1 : e.vs && PART.includes(e.drawer) ? 2 : 3)
export const LEVEL_NAME = { 1: '입문', 2: '중급', 3: '전문가' } as const

// ─── 한국 앱 · 사이트에 특히 많은 UI ───
export const KOREA = new Set(['agree-all', 'secure-keypad', 'daily-popup', 'postcode', 'social-login', 'scroll-to-agree', 'consent-detail', 'quick-menu', 'payment-widget', 'otp-input', 'phone-input', 'reward-points', 'cashback', 'coupon-code', 'captcha', 'board-list', 'popup-blocked'])

// ─── 변천사 · 계보: [해, 무슨 일] ───
export const HISTORY: Record<string, [string, string][]> = {
  toggle: [['2007', '아이폰이 실물 스위치를 닮은 토글을 널리 퍼뜨렸어요.'], ['2013', 'iOS 7부터 그림자 없이 납작하고 둥근 모양이 됐어요.'], ['2018', '머티리얼 2에서는 손잡이가 트랙보다 크게 튀어나왔어요.'], ['2021', '머티리얼 3에서는 켜면 손잡이가 커지고 안에 아이콘이 들어가요.']],
  'hamburger-menu': [['1981', '제록스 스타 컴퓨터에서 세 줄 아이콘이 처음 쓰였어요.'], ['2009', '휴대폰 웹에서 메뉴를 숨겨 두는 버튼으로 다시 나타났어요.'], ['2014', '숨긴 메뉴는 덜 눌린다는 연구가 나오면서 탭 바로 옮겨 가기 시작했어요.'], ['지금', '넓은 화면에서는 내비게이션 레일이나 펼친 사이드바를 더 많이 써요.']],
  'tab-bar': [['2007', '아이폰 앱 아래쪽 아이콘 줄로 시작했어요.'], ['2016', '안드로이드도 머티리얼의 ‘하단 내비게이션’으로 받아들였어요.'], ['2021', '머티리얼 3부터 고른 탭에 알약 모양 표시가 붙어요.']],
  'pull-refresh': [['2008', '트위터 앱 ‘Tweetie’에서 처음 만들었어요.'], ['2012', 'iOS 6이 기본 부품으로 넣었어요.'], ['지금', '목록이 있는 앱이라면 거의 다 쓰는 기본 동작이 됐어요.']],
  'infinite-scroll': [['2006', '처음 제안됐어요.'], ['2010', 'SNS 피드에서 기본이 됐어요.'], ['지금', '끝없는 피드가 시간을 빼앗는다는 비판이 나와서 ‘다 봤어요’ 표시를 함께 두기도 해요.']],
  skeleton: [['2013', '페이스북이 회색 막대로 불러올 자리를 먼저 보여 줬어요.'], ['2016', '‘스켈레톤 화면’이라는 이름으로 널리 퍼졌어요.'], ['지금', '빙글빙글 도는 스피너 대신 기본으로 써요.']],
  'button-hierarchy': [['2000년대', '입체감과 광택이 있는 버튼이 많았어요.'], ['2013', '평면 디자인이 유행하면서 글자만 있는 버튼이 늘었어요.'], ['2014', '머티리얼이 떠 있는 버튼과 글자 버튼을 나눠 썼어요.'], ['2021', '머티리얼 3에서 채움, 톤, 외곽선, 글자 버튼까지 단계가 다섯으로 늘었어요.']],
  drawer: [['2011', '페이스북 앱이 왼쪽에서 밀려 나오는 메뉴를 썼어요.'], ['2014', '머티리얼이 ‘내비게이션 드로어’라는 이름으로 정리했어요.'], ['지금', '넓은 화면에서는 늘 펼쳐 둔 사이드바나 레일로 바꿔 쓰는 편이에요.']],
  carousel: [['2000년대', '첫 화면의 큰 배너가 저절로 넘어가는 방식이 흔했어요.'], ['2013', '사람들이 첫 장만 본다는 조사 결과가 나왔어요.'], ['지금', '멈춤 버튼을 두고 손으로 넘기게 하는 쪽을 권해요.']],
  'dark-mode': [['1980년대', '검은 화면에 초록 글자를 띄우는 터미널이 기본이었어요.'], ['2019', 'iOS 13과 안드로이드 10이 시스템 다크 모드를 넣었어요.'], ['지금', '대부분의 앱이 기기 설정에 맞춰 알아서 바뀌어요.']],
  material: [['2014', '구글이 종이와 잉크를 본뜬 머티리얼 디자인을 발표했어요.'], ['2018', '머티리얼 2에서 브랜드에 맞게 테마를 바꾸기 쉬워졌어요.'], ['2021', '머티리얼 3은 배경화면 색을 따라가는 ‘머티리얼 유’를 내놓았어요.']],
  skeuomorphism: [['2007', '아이폰 초기 앱은 가죽이나 나무처럼 실물을 닮은 질감을 썼어요.'], ['2013', 'iOS 7에서 평면 디자인으로 크게 바뀌었어요.'], ['2020', '뉴모피즘과 글래스모피즘이 나오면서 입체감이 조금 돌아왔어요.']],
  'social-login': [['2008', '페이스북 커넥트로 다른 사이트에 로그인하기 시작했어요.'], ['2015', '한국 앱에서는 카카오와 네이버 로그인이 기본처럼 자리 잡았어요.'], ['2019', '애플로 로그인이 나오면서 이메일을 숨길 수 있게 됐어요.']],
  streaming: [['2022', '챗GPT가 답을 한 글자씩 보여 주면서 널리 알려졌어요.'], ['지금', 'AI 화면이라면 거의 다 써요. 멈추기 버튼과 늘 같이 다녀요.']],
}

// ─── 흔한 실수: 서랍별 ───
const MISTAKES: Partial<Record<DrawerId, string[]>> = {
  feedback: ['중요한 오류를 저절로 사라지는 토스트로 띄워요', '알림 여러 개를 한꺼번에 겹쳐 띄워요'],
  input: ['자리표시 글자만 두고 라벨을 없애요', '입력하는 중인데 벌써 빨간 오류를 띄워요'],
  nav: ['메뉴 이름을 회사 안에서만 쓰는 말로 지어요', '지금 위치 표시를 빼먹어요'],
  content: ['카드마다 버튼을 셋 넘게 달아요', '긴 글을 줄임표로 잘라 놓고 펼칠 방법이 없어요'],
  loading: ['0.3초 걸리는 일에도 스피너를 번쩍 띄워요', '실패해도 계속 빙글빙글 돌아요'],
  gesture: ['손동작으로만 할 수 있고 버튼이 없어요', '스와이프 방향마다 하는 일이 달라 헷갈려요'],
  ai: ['출처 없이 자신 있게 틀린 답을 보여 줘요', '멈추기 버튼이 없어 긴 답을 기다려야 해요'],
  style: ['유행 효과를 화면 곳곳에 다 써요', '흐림 효과 위 글자가 잘 안 읽혀요'],
  icon: ['뜻이 둘 이상인 아이콘에 글자를 안 붙여요', '같은 아이콘을 화면마다 다른 뜻으로 써요'],
}
export const mistakesOf = (d: DrawerId) => MISTAKES[d] ?? ['한 화면에 강조를 너무 많이 줘서 아무것도 강조되지 않아요', '휴대폰 폭에서 확인을 안 해요']

// ─── 다른 곳에서 부르는 이름: [피그마 · 머티리얼, iOS, HTML · 웹] ───
export const NAMES: Record<string, [string, string, string]> = {
  toast: ['Snackbar(머티리얼엔 토스트가 없어요)', '따로 없어요 (배너 알림으로 대신)', 'role="status" 영역'],
  snackbar: ['Snackbar', '따로 없어요 (직접 만들어요)', 'role="status" + 버튼'],
  modal: ['Dialog', 'Alert · Sheet', '<dialog> · showModal()'],
  alert: ['Dialog (basic)', 'UIAlertController .alert', '<dialog> · role="alertdialog"'],
  'bottom-sheet': ['Bottom sheet', 'Sheet (detents)', '<dialog> 아래 붙이기'],
  'action-sheet': ['Bottom sheet (목록)', 'UIAlertController .actionSheet', '<dialog> + 버튼 목록'],
  drawer: ['Navigation drawer', 'Sidebar · Split view', '<nav> + <dialog>'],
  'tab-bar': ['Navigation bar', 'Tab bar', '<nav> 아래 고정'],
  tabs: ['Tabs', 'Segmented control (짧을 때)', 'role="tablist"'],
  segmented: ['Segmented button', 'Segmented control', 'role="radiogroup"'],
  toggle: ['Switch', 'Switch (UISwitch)', '<input type="checkbox" role="switch">'],
  checkbox: ['Checkbox', '따로 없어요 (체크 표시 목록)', '<input type="checkbox">'],
  radio: ['Radio button', '따로 없어요 (체크 표시 목록)', '<input type="radio">'],
  select: ['Menu (exposed dropdown)', 'Pop-up button · Picker', '<select>'],
  combobox: ['Menu (자동 완성)', 'Search 제안', '<input list> · <datalist>'],
  slider: ['Slider', 'Slider', '<input type="range">'],
  stepper: ['따로 없어요 (직접 만들어요)', 'Stepper', '<input type="number">'],
  'date-picker': ['Date picker', 'Date picker (wheels · inline)', '<input type="date">'],
  'text-field': ['Text field (filled · outlined)', 'Text field', '<input> + <label>'],
  'search-bar': ['Search bar', 'Search bar (UISearchController)', '<input type="search"> · role="search"'],
  chip: ['Chip (assist · filter · input · suggestion)', 'Token (검색 칸 안)', '<button> · role="option"'],
  tooltip: ['Tooltip (plain)', '따로 없어요 (길게 누르기 메뉴)', 'title · popover="hint"'],
  popover: ['Tooltip (rich) · Menu', 'Popover', 'popover 속성'],
  'dropdown-menu': ['Menu', 'Pull-down menu · UIMenu', 'popover + role="menu"'],
  fab: ['FAB', '따로 없어요 (오른쪽 위 + 버튼)', '<button> 고정 위치'],
  'top-app-bar': ['Top app bar', 'Navigation bar', '<header>'],
  'navigation-rail': ['Navigation rail', 'Sidebar (iPad)', '<nav> 세로'],
  progress: ['Linear progress indicator', 'Progress view', '<progress>'],
  spinner: ['Circular progress indicator', 'Activity indicator', '<progress> (값 없이)'],
  badge: ['Badge', 'Badge (탭과 앱 아이콘)', 'aria-label 로 숫자 읽기'],
  'pull-refresh': ['Pull to refresh', 'UIRefreshControl', '직접 만들어요 (overscroll)'],
  accordion: ['따로 없어요 (List + 펼치기)', 'DisclosureGroup', '<details> · <summary>'],
  card: ['Card (elevated · filled · outlined)', '따로 없어요 (목록 칸)', '<article>'],
  avatar: ['따로 없어요 (이미지 + 둥글게)', '없음', '<img alt>'],
  'context-menu': ['Menu', 'Context menu (길게 누르기)', 'contextmenu 이벤트'],
}

// ─── 자주 틀리는 이름: 현장에서 이렇게 부르지만 사실은… ───
export const MISNAMES: [string, string, string][] = [
  ['팝업', 'modal', '화면을 막는 창은 모달과 다이얼로그예요. ‘팝업’은 원래 새 브라우저 창을 말해요.'],
  ['토스트', 'snackbar', '버튼(실행 취소)이 붙어 있으면 스낵바예요.'],
  ['드롭다운', 'select', '값을 고르는 칸은 셀렉트, 할 일 목록이 펼쳐지면 드롭다운 메뉴예요.'],
  ['로딩바', 'progress', '얼마나 남았는지 보이면 진행 막대, 모르면 스피너예요.'],
  ['체크박스', 'toggle', '누르자마자 켜지고 꺼지는 설정은 토글(스위치)이에요.'],
  ['슬라이드', 'carousel', '옆으로 넘기는 사진 묶음은 캐러셀이에요.'],
  ['말풍선', 'tooltip', '마우스를 올리면 뜨는 작은 설명은 툴팁이에요.'],
  ['하단 메뉴', 'tab-bar', '앱 아래 아이콘 줄은 탭 바예요.'],
  ['사이드 메뉴', 'drawer', '옆에서 밀려 나오는 창은 드로어예요.'],
  ['알림창', 'alert', '확인과 취소를 묻는 작은 창은 얼럿이에요.'],
  ['로딩 화면', 'skeleton', '회색 막대로 자리를 보여 주면 스켈레톤이에요.'],
  ['아코디언 메뉴', 'accordion', '펼치는 건 메뉴가 아니라 내용 묶음이라 그냥 아코디언이에요.'],
  ['배지', 'chip', '누를 수 있는 작은 알약은 칩, 숫자와 점 표시는 배지예요.'],
  ['검색창 추천', 'autocomplete', '치는 동안 아래에 뜨는 목록은 자동 완성이에요.'],
  ['페이지 넘김', 'pagination', '번호로 넘기는 건 페이지네이션이에요.'],
]

// ─── 다크 패턴을 고치면 이런 모양 (고치기 실습에서 나란히 보여 줘요) ───
export const DARK_FIX: Record<string, string> = {
  confirmshaming: 'alert', 'roach-motel': 'type-to-confirm', preselection: 'checkbox', 'false-urgency': 'countdown', 'hidden-costs': 'order-summary',
  'sneak-basket': 'cart-item', 'trick-question': 'toggle', 'fake-close': 'modal', 'cookie-wall': 'cookie-banner', 'badge-spam': 'badge', 'fine-print': 'consent-detail',
}

/** 테스트용: 적은 id 중 없는 것 */
export const loreMissing = () => [...T.flatMap(([a, b]) => [a, b]), ...BASIC, ...KOREA, ...Object.keys(HISTORY), ...Object.keys(NAMES), ...MISNAMES.map((m) => m[1]), ...Object.keys(DARK_FIX), ...Object.values(DARK_FIX)].filter((id) => !byId.has(id))
export const countLevel = (l: Level) => ENTRIES.filter((e) => levelOf(e) === l).length

/** 헷갈리는 짝을 한 줄로 가르는 법. 키는 두 id를 가나다순으로 이은 것 */
const T: [string, string, string][] = [
  ['toast', 'snackbar', '버튼이 없으면 토스트, ‘실행 취소’ 같은 버튼이 하나 있으면 스낵바예요.'],
  ['modal', 'bottom-sheet', '화면 가운데 뜨면 모달, 아래에서 올라오면 바텀시트예요.'],
  ['modal', 'alert', '무엇이든 담는 창은 모달, 확인과 취소만 묻는 작은 창은 얼럿이에요.'],
  ['tabs', 'segmented', '아래 내용을 통째로 바꾸면 탭, 보기 방식만 바꾸면 세그먼티드 컨트롤이에요.'],
  ['tooltip', 'popover', '올리면 뜨는 글자 한 줄은 툴팁, 눌러야 열리고 버튼까지 담기면 팝오버예요.'],
  ['checkbox', 'toggle', '저장을 눌러야 적용되면 체크박스, 누르자마자 바뀌면 토글이에요.'],
  ['radio', 'checkbox', '하나만 고르면 라디오 버튼, 여러 개 고르면 체크박스예요.'],
  ['select', 'dropdown-menu', '값을 고르면 셀렉트 박스, 할 일을 고르면 드롭다운 메뉴예요.'],
  ['drawer', 'bottom-sheet', '옆에서 나오면 드로어, 아래에서 올라오면 바텀시트예요.'],
  ['spinner', 'skeleton', '모양을 모르면 스피너, 나올 모양을 미리 그리면 스켈레톤이에요.'],
  ['spinner', 'progress', '얼마나 남았는지 모르면 스피너, 알면 프로그레스 바예요.'],
  ['banner', 'toast', '사라지지 않고 위에 붙어 있으면 배너, 잠깐 떴다 사라지면 토스트예요.'],
  ['chip', 'badge', '누를 수 있는 작은 알약은 칩, 숫자나 점으로 알려 주기만 하면 뱃지예요.'],
  ['carousel', 'tabs', '옆으로 넘기며 하나씩 보면 캐러셀, 이름표를 눌러 바꾸면 탭이에요.'],
  ['accordion', 'tabs', '여러 개를 동시에 펼칠 수 있으면 아코디언, 하나만 보이면 탭이에요.'],
  ['gnb', 'lnb', '사이트 맨 위 큰 메뉴는 GNB, 그 안에서 옆이나 아래로 나뉘는 메뉴는 LNB예요.'],
  ['breadcrumb', 'steps', '지금 어디 있는지 길을 보여 주면 브레드크럼, 몇 단계 중 어디인지 보여 주면 스텝이에요.'],
  ['pagination', 'infinite-scroll', '번호를 눌러 넘기면 페이지네이션, 내리면 저절로 이어지면 무한 스크롤이에요.'],
  ['tab-bar', 'navigation-rail', '휴대폰 아래 줄이면 탭 바, 태블릿 · PC 왼쪽 세로 줄이면 내비게이션 레일이에요.'],
  ['fab', 'speed-dial', '버튼 하나로 바로 실행하면 FAB, 누르면 작은 버튼이 여러 개 펼쳐지면 스피드 다이얼이에요.'],
  ['autocomplete', 'select', '적으면서 고르면 자동완성, 목록에서만 고르면 셀렉트 박스예요.'],
  ['empty-state', 'no-results', '처음부터 비어 있으면 빈 화면, 찾았는데 없으면 검색 결과 없음이에요.'],
  ['action-sheet', 'bottom-sheet', '할 일 목록만 있으면 액션 시트, 무엇이든 담으면 바텀시트예요.'],
  ['hamburger-menu', 'drawer', '줄 세 개 아이콘은 햄버거 메뉴, 그걸 눌러 열리는 판은 드로어예요.'],
]
export const TELL: Record<string, string> = Object.fromEntries(T.map(([a, b, t]) => [[a, b].sort().join('|'), t]))
export const tellOf = (a: string, b: string) => TELL[[a, b].sort().join('|')]
