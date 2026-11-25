// 주제별 파일(src/more/)의 카드를 한데 모아요. data.ts 가 BASE 뒤에 붙여요.
import type { Entry } from './data'
import { PAYMENT } from './more/payment'
import { COMMERCE } from './more/commerce'
import { SETTINGS } from './more/settings'
import { PROFILE } from './more/profile'
import { AUTH } from './more/auth'
import { FORM_FLOW } from './more/form-flow'
import { MEDIA } from './more/media'
import { CHAT } from './more/chat'
import { SOCIAL } from './more/social'
import { MAP } from './more/map'
import { TABLE } from './more/table'
import { EDITOR } from './more/editor'
import { CALENDAR } from './more/calendar'
import { A11Y } from './more/a11y'
import { COPY } from './more/copy'
import { DEVICE } from './more/device'
import { GAME } from './more/game'
import { PARTS } from './more/parts'

export const MORE: Entry[] = [
  ...PARTS,
  ...PAYMENT, ...COMMERCE, ...SETTINGS, ...PROFILE, ...AUTH, ...FORM_FLOW, ...MEDIA, ...CHAT,
  ...SOCIAL, ...MAP, ...TABLE, ...EDITOR, ...CALENDAR, ...A11Y, ...COPY, ...DEVICE, ...GAME,
]
