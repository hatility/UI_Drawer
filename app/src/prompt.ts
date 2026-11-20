// 바이브 코딩용 프롬프트: 카드에 이미 있는 내용(설명 · 쓰는 때 · 헷갈리는 짝 · 잘 만드는 법 · 접근성)으로
// AI에게 그 UI를 정확히 만들어 달라고 하는 글을 만들어요. 사이트 안에서 AI를 부르지는 않고, 복사만 해요.
import { useState } from 'react'
import { byId, type Entry } from './data'
import { a11yTips, makeTips } from './a11y'
import { NAMES, mistakesOf, tellOf } from './lore'

export type Tech = 'React' | 'HTML' | 'Vue' | 'SwiftUI' | 'Flutter'
export type Tone = 'detail' | 'short'
export const TECHS: Tech[] = ['React', 'HTML', 'Vue', 'SwiftUI', 'Flutter']
const STACK: Record<Tech, string> = {
  React: 'React + TypeScript 컴포넌트 하나로, 바깥 라이브러리 없이 CSS로 만들어 줘.',
  HTML: 'HTML · CSS · 바닐라 자바스크립트로, 파일 하나에 담아 줘.',
  Vue: 'Vue 3 단일 파일 컴포넌트(<script setup>)로 만들어 줘.',
  SwiftUI: 'SwiftUI View 하나로 만들어 줘.',
  Flutter: 'Flutter 위젯 하나로 만들어 줘.',
}
/** 문장 끝에 마침표를 찍어 이어 붙여도 읽히게 */
const end = (t: string) => (/[.!?)]$/.test(t) ? t : t + '.')

/** 자주 쓰는 카드 30장은 꼭 지켜야 할 동작을 직접 적어 뒀어요 (자동으로 만든 것보다 정확하게) */
export const MUST: Record<string, string[]> = {
  toast: ['버튼 없이 글자만 보여 줘', '3~4초 뒤 저절로 사라지게', '여러 개가 오면 겹치지 말고 차례로'],
  snackbar: ['‘실행 취소’ 버튼을 꼭 하나 붙여 줘', '버튼이 있으니 5~10초 동안 보여 주고, 마우스를 올리면 멈추게', '화면 아래 가운데(휴대폰은 아래 꽉 차게)'],
  modal: ['뒤 화면은 반투명 배경으로 막고, 뒤는 눌리지 않게', '열리면 초점을 창 안으로, Esc · 닫기 버튼 · 배경 누르기로 닫히고 연 버튼으로 초점이 돌아가게', '창 안에서만 Tab이 돌게'],
  alert: ['제목 한 줄 · 설명 한 줄 · 버튼 두 개(취소 · 확인)만', '되돌릴 수 없는 일이면 확인 버튼을 빨간색으로', 'role="alertdialog"'],
  'bottom-sheet': ['화면 아래에서 올라오고, 위에 손잡이(grabber)를 그려 줘', '손잡이를 아래로 끌면 닫히고, 위로 끌면 끝까지 열리게(반 · 전체 두 단계)', '뒤 배경을 누르면 닫히게'],
  drawer: ['화면 옆(왼쪽)에서 밀려 나오게', '열리면 뒤를 어둡게 덮고, 배경을 누르거나 Esc로 닫히게', '메뉴 목록과 지금 위치 표시'],
  tooltip: ['마우스를 올리거나 키보드 초점이 가면 0.3초 뒤에 뜨게', '글자 한 줄만, 버튼은 넣지 말기', 'Esc로 닫히게, aria-describedby로 연결'],
  popover: ['버튼을 눌러야 열리고, 안에 제목 · 설명 · 버튼을 담을 수 있게', '바깥을 누르거나 Esc로 닫히게', '화면 끝에 닿으면 반대쪽으로 뒤집혀 뜨게'],
  tabs: ['탭을 누르면 아래 내용이 통째로 바뀌게', '선택된 탭 아래 밑줄', 'role="tablist" · "tab" · "tabpanel", 좌우 화살표로 옮겨 다니게'],
  segmented: ['2~4개 버튼이 한 덩어리로 붙어 있고 하나만 골라지게', '선택된 칸은 바탕색으로 표시', '보기 방식 바꾸기처럼 같은 내용의 모양만 바꿀 때'],
  toggle: ['누르자마자 켜지고 꺼지게(저장 버튼 없이)', '켜짐 · 꺼짐을 색뿐 아니라 손잡이 위치로도 보여 줘', 'role="switch"와 aria-checked'],
  checkbox: ['체크 · 해제 · 일부 선택(indeterminate) 세 상태', '라벨 글자를 눌러도 체크되게', '저장 버튼을 눌러야 적용되는 설정에 써'],
  radio: ['여럿 중 하나만 골라지게', '라벨까지 누를 수 있게', '방향키로 옮겨 다니게'],
  select: ['누르면 목록이 펼쳐지고 하나를 고르게', '고른 값이 칸에 보이게', '키보드로 열고 고를 수 있게(가능하면 기본 <select>)'],
  'text-field': ['칸 위에 늘 보이는 라벨', '도움말 글은 칸 아래, 오류는 칸 아래 빨간 글자로', '오류는 칸을 떠날 때 알려 주고 aria-describedby로 연결'],
  'search-bar': ['돋보기 아이콘 · 자리표시 글자 · 지우기(×) 버튼', 'Enter로 검색, Esc로 지우기', 'role="search"'],
  autocomplete: ['적는 동안 아래에 추천 목록', '방향키로 고르고 Enter로 넣기', '맞는 글자를 굵게 표시'],
  chip: ['작은 알약 모양, 누르면 선택 · 해제', '선택되면 체크 아이콘과 바탕색', '여러 개가 줄바꿈되며 늘어서게'],
  badge: ['아이콘 오른쪽 위에 숫자나 점', '99가 넘으면 99+', '숫자를 스크린리더가 읽게 aria-label'],
  spinner: ['빙글빙글 도는 원 하나', '움직임 줄이기 설정이면 멈추게', 'role="progressbar"와 ‘불러오는 중’ 글자'],
  skeleton: ['나올 내용과 같은 모양의 회색 상자', '옅게 반짝이는 움직임(움직임 줄이기면 멈춤)', '다 불러오면 진짜 내용으로 바뀌게'],
  progress: ['0~100% 채워지는 막대', '숫자(%)를 같이 보여 줘', 'role="progressbar"와 aria-valuenow'],
  card: ['사진 · 제목 · 설명 · 버튼 하나를 한 덩어리로', '카드 전체를 눌러도 열리게', '버튼은 셋을 넘지 않게'],
  accordion: ['제목을 누르면 아래 내용이 펼쳐지고 접히게', '화살표가 돌아가며 상태를 보여 주게', 'aria-expanded, 가능하면 <details>'],
  carousel: ['옆으로 넘기는 슬라이드와 아래 점 표시', '저절로 넘어가면 멈춤 버튼을 꼭', '손가락으로 밀어 넘기기 · 이전 · 다음 버튼'],
  pagination: ['이전 · 번호 · 다음 버튼', '지금 쪽은 강조, aria-current="page"', '쪽이 많으면 가운데를 …로 줄이기'],
  breadcrumb: ['홈 › 분류 › 지금 쪽 순서', '마지막(지금 쪽)은 링크가 아닌 글자', '<nav aria-label="현재 위치">'],
  'tab-bar': ['휴대폰 화면 아래 고정, 아이콘 + 글자 3~5개', '지금 탭은 색과 알약 모양으로 표시', '안전 영역(홈 바) 위에 놓이게'],
  fab: ['화면 오른쪽 아래 떠 있는 둥근 버튼 하나', '가장 중요한 일 하나만', '스크롤할 때 가리지 않게 여백'],
  'empty-state': ['그림 · 무엇이 없는지 한 줄 · 어떻게 채우는지 한 줄 · 버튼 하나', '버튼은 바로 채울 수 있는 곳으로'],
}

/** 카드 하나를 만들어 달라는 프롬프트 */
export function cardPrompt(e: Entry, tech: Tech, tone: Tone): string {
  const lines: string[] = [`${e.ko}(${e.en}) UI를 만들어 줘.`]
  if (tone === 'short') {
    lines.push(`${e.desc}`)
    const t = e.vs?.map((v) => tellOf(e.id, v.id)).find(Boolean)
    if (t) lines.push(`헷갈리지 않게: ${t}`)
    if (MUST[e.id]) lines.push(`꼭: ${MUST[e.id].join(', ')}.`)
    lines.push(STACK[tech])
    return lines.join('\n')
  }
  lines.push('', `- 무엇: ${end(e.desc)}`)
  lines.push(`- 이럴 때 써: ${e.when.join(', ')}.`)
  if (e.vs?.length) {
    const f = byId.get(e.vs[0].id)
    const t = tellOf(e.id, e.vs[0].id)
    if (f) lines.push(`- 헷갈리지 않게: ${f.ko}(${f.en})가 아니야. ${t ?? end(e.vs[0].diff)}`)
  }
  if (MUST[e.id]) lines.push(`- 꼭 지켜 줘: ${MUST[e.id].join(' / ')}.`)
  if (NAMES[e.id]) lines.push(`- 참고 이름: 머티리얼 ${NAMES[e.id][0]}, iOS ${NAMES[e.id][1]}, 웹 ${NAMES[e.id][2]}.`)
  if (e.drawer !== 'dark' && !MUST[e.id]) {
    // 직접 다듬은 카드는 위 ‘꼭 지켜 줘’가 더 정확해서, 서랍 전체용 일반 팁은 넣지 않아요
    lines.push(`- 잘 만드는 법: ${makeTips(e.drawer).map(end).join(' ')}`)
    lines.push(`- 피해 줘: ${mistakesOf(e.drawer).map(end).join(' ')}`)
  } else if (e.drawer === 'dark') {
    lines.push('- 주의: 이건 사용자를 속이는 다크 패턴이야. 배우려고 보여 주는 예시로만 만들고, 옆에 고친 모양도 같이 보여 줘.')
  }
  lines.push(`- 접근성: ${a11yTips(e.id, e.drawer).map(end).join(' ')}`)
  lines.push(`- 기술: ${STACK[tech]}`)
  lines.push('', '먼저 동작을 확인할 수 있는 예시 화면(가짜 데이터)과 함께 만들어 주고, 상태(열림 · 닫힘 · 선택 등)를 바꿔 볼 수 있게 해 줘.')
  return lines.join('\n')
}

/** 카드 여러 장으로 화면 하나를 통째로 만들어 달라는 프롬프트 (폴더 · 비교에서) */
export function screenPrompt(list: Entry[], tech: Tech, title = '화면'): string {
  return [
    `아래 UI들로 ‘${title}’ 화면 하나를 만들어 줘. 각 UI 이름은 정확히 이 뜻이야.`,
    '',
    ...list.map((e, i) => `${i + 1}. ${e.ko}(${e.en}): ${end(e.desc)}${MUST[e.id] ? ` 꼭: ${MUST[e.id].join(', ')}.` : ''}`),
    '',
    `- 기술: ${STACK[tech]}`,
    '- 서로 이름이 비슷해도 위 뜻대로 구분해서 만들어 줘(예: 토스트와 스낵바, 모달과 바텀시트).',
    '- 키보드로 모두 쓸 수 있게, 휴대폰 폭(360px)에서도 깨지지 않게 해 줘.',
  ].join('\n')
}

/** 프롬프트 기술 · 길이 고른 것은 이 브라우저에 기억해요 */
export function useVibe() {
  const [v, setV] = useState<{ tech: Tech; tone: Tone }>(() => { try { return { tech: 'React', tone: 'detail', ...JSON.parse(localStorage.getItem('ui-drawer-vibe') || '{}') } } catch { return { tech: 'React', tone: 'detail' } } })
  const set = (n: { tech: Tech; tone: Tone }) => { setV(n); try { localStorage.setItem('ui-drawer-vibe', JSON.stringify(n)) } catch { /* 이번만 */ } }
  return [v, set] as const
}
