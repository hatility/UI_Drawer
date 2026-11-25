// 카드 그림을 손으로 그리지 않고 장면 틀로 그릴 때 쓰는 설명. PreviewMore.tsx 가 이걸로 그려요.
// k: 장면 종류 · t: 주인공 글자 · s: 보조 글자 · b: 버튼 글자 · items: 목록 · on: 고른 번호 · n: 숫자 · i: 아이콘 글자
export type PicKind =
  | 'toast' | 'banner' | 'modal' | 'sheet' | 'btn' | 'btn2' | 'chips' | 'form' | 'toggle' | 'seg' | 'tabs' | 'list' | 'card' | 'table'
  | 'stat' | 'steps' | 'progress' | 'badge' | 'menu' | 'tip' | 'chat' | 'player' | 'month' | 'map' | 'faces' | 'keys' | 'check' | 'bars'
  | 'phone' | 'icon' | 'text' | 'empty' | 'code' | 'slider' | 'coach' | 'perm' | 'row' | 'search' | 'tag' | 'ring'

export type Pic = { k: PicKind; t?: string; s?: string; b?: string; items?: string[]; on?: number; n?: number; i?: string }
