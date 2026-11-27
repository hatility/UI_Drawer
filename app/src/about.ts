// 만든 사람 · 소스 코드 위치. 화면 아래 · 상세 창 · 제안 양식에서 같이 써요.
export const AUTHOR = { name: '이명균', url: 'https://github.com/aodrha03' }
export const ORG = { name: 'hatility (하틸리티)', url: 'https://github.com/hatility' }
export const REPO = 'https://github.com/hatility/UI_Drawer'
/** 푸터 ‘만든 곳’ 한 줄 (My Pick · 그려봄과 같은 문구) */
export const ORG_LINE = '필요한 사람이 바로 열어 쓸 수 있는 작은 웹 서비스를 만드는 공방이에요.'

/** 깃허브 이슈 양식을 칸까지 채워서 열어요 (칸 이름은 .github/ISSUE_TEMPLATE 의 id) */
export const issueUrl = (template: 'new-card' | 'bug' | 'dark-pattern', title: string, fields: Record<string, string>) =>
  `${REPO}/issues/new?${new URLSearchParams({ template: `${template}.yml`, title, ...fields })}`
