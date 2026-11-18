// 큰 서랍은 상세 항목으로 나눠 보여 줘요. 여기 적지 않은 카드는 ‘그 밖에’로 모여요.
import { ENTRIES, inDrawer, type DrawerId, type Entry } from './data'

type Sub = { key: string; label: string; ids: string[] }

export const SUBS: Partial<Record<DrawerId, Sub[]>> = {
  input: [
    { key: 'text', label: '글자 적기', ids: ['text-field', 'floating-label', 'password-toggle', 'textarea', 'search-bar', 'autocomplete', 'tag-input', 'number-input', 'masked-input', 'currency-input', 'phone-input', 'card-number-input', 'coupon-code', 'input-addon', 'character-counter', 'password-strength', 'inline-edit', 'slash-command', 'postcode', 'draft-restore', 'otp-input', 'mention', 'rich-text-editor', 'password-rules', 'password-confirm', 'availability-check', 'auto-grow-textarea', 'helper-text', 'required-mark', 'combobox', 'split-input', 'password-generator', 'conditional-field'] },
    { key: 'choose', label: '고르기', ids: ['select', 'checkbox', 'radio', 'toggle', 'segmented', 'chip', 'toggle-button', 'indeterminate-checkbox', 'multi-select', 'radio-card', 'payment-widget', 'cascader', 'transfer-list', 'agree-all', 'scroll-to-agree', 'color-swatch', 'size-selector', 'rating', 'emoji-reaction', 'theme-toggle', 'searchable-select', 'emoji-picker', 'user-picker', 'tree-select', 'image-choice', 'consent-detail', 'settings-list', 'unit-switch'] },
    { key: 'value', label: '값 · 날짜 조절', ids: ['stepper', 'slider', 'range-slider', 'knob', 'date-picker', 'time-picker', 'color-picker', 'eyedropper', 'font-size-control', 'emoji-slider', 'location-picker', 'min-max-input', 'slider-with-input'] },
    { key: 'file', label: '파일 · 보안', ids: ['file-upload', 'drop-overlay', 'photo-grid-upload', 'image-cropper', 'signature-pad', 'captcha', 'secure-keypad', 'pattern-lock', 'biometric-prompt', 'hold-to-record', 'barcode-scan', 'attachment-list'] },
    { key: 'button', label: '버튼', ids: ['button-hierarchy', 'split-button', 'social-login', 'icon-button'] },
  ],
  content: [
    { key: 'block', label: '카드 · 묶음', ids: ['card', 'product-card', 'profile-card', 'accordion', 'hero', 'footer', 'divider', 'sticky-cta', 'ribbon', 'empty-state', 'testimonial', 'blockquote', 'spoiler', 'footnote', 'tag-cloud', 'sticky-note', 'link-preview', 'ticket', 'widget', 'badge-collection', 'stat-card', 'hover-card', 'sale-price', 'truncation', 'countdown', 'faq', 'option-sheet', 'order-summary', 'address-card', 'event-card', 'pros-cons', 'shortcut-sheet', 'stat-group', 'delta-badge', 'figure-caption', 'hashtags', 'author-byline', 'feature-list', 'logo-wall', 'cta-banner'] },
    { key: 'list', label: '목록 · 표', ids: ['list-item', 'table', 'sortable-table', 'frozen-column', 'description-list', 'comparison-table', 'pricing-table', 'leaderboard', 'kanban', 'timeline', 'masonry', 'diff-view', 'version-history', 'code-block', 'kbd', 'poll', 'board-list', 'cart-item', 'article-card', 'numbered-steps', 'related-posts'] },
    { key: 'media', label: '사진 · 영상 · 지도', ids: ['carousel', 'infinite-carousel', 'lightbox', 'thumbnail-gallery', 'before-after', 'video-player', 'audio-player', 'audio-waveform', 'story', 'marquee', 'image-hotspot', 'map-pin', 'map-cluster', 'infinite-canvas', 'minimap', 'calendar-view', 'chart', 'review-photos', 'hover-zoom'] },
    { key: 'people', label: '사람 · 채팅', ids: ['avatar', 'avatar-group', 'chat-bubble', 'comment-thread', 'doc-comment', 'live-cursors', 'read-receipt', 'reply-quote', 'pinned-message', 'date-divider', 'system-message'] },
  ],
  nav: [
    { key: 'menu', label: '메뉴 · 머리줄', ids: ['gnb', 'lnb', 'mega-menu', 'sticky-header', 'top-app-bar', 'dropdown-menu', 'account-menu', 'workspace-switcher', 'context-menu', 'command-palette', 'sitemap', 'quick-menu', 'collapsible-sidebar', 'navigation-rail', 'drawer', 'hamburger-menu', 'side-sheet', 'mega-footer'] },
    { key: 'mobile', label: '휴대폰 아래쪽', ids: ['fab', 'speed-dial', 'bottom-app-bar', 'center-tab-button', 'more-tab', 'pill-nav', 'dock', 'floating-toolbar', 'tab-bar', 'bottom-sheet'] },
    { key: 'page', label: '페이지 안 이동', ids: ['breadcrumb', 'tabs', 'tabs-vertical', 'scrollable-tabs', 'pagination', 'scroll-spy', 'table-of-contents', 'skip-link', 'back-button', 'prev-next', 'alphabet-index', 'master-detail', 'tree-view', 'steps', 'sticky-subnav', 'wizard-footer', 'anchor-tabs', 'breadcrumb-collapse', 'closable-tabs', 'jump-to-page', 'category-pills', 'vertical-steps'] },
  ],
  feedback: [
    { key: 'notice', label: '알림', ids: ['toast', 'snackbar', 'toast-stack', 'progress-toast', 'background-task', 'banner', 'push-notification', 'cookie-banner', 'daily-popup', 'popup-blocked', 'feedback-widget', 'notification-center', 'success-state', 'email-sent', 'snooze', 'undo-countdown', 'new-content-pill', 'update-available'] },
    { key: 'dialog', label: '창 · 확인', ids: ['modal', 'alert', 'action-sheet', 'popconfirm', 'type-to-confirm', 'unsaved-changes', 'session-timeout', 'whats-new', 'permission-prompt', 'error-404', 'dialog-fullscreen', 'inline-confirm', 'acknowledge-dialog', 'progress-dialog'] },
    { key: 'hint', label: '안내 · 표시', ids: ['tooltip', 'rich-tooltip', 'popover', 'coachmark', 'hotspot', 'badge', 'status-pill', 'callout', 'inline-error', 'live-validation', 'undo-history', 'presence-dot', 'rate-limit', 'error-summary'] },
  ],
  gesture: [
    { key: 'touch', label: '손가락', ids: ['double-tap', 'pinch-zoom', 'two-finger-rotate', 'edge-swipe', 'swipe-tabs', 'swipe-to-reply', 'drag-to-dismiss', 'swipe-cards', 'shake-undo', 'peek-preview', 'hold-to-confirm', 'slide-to-confirm', 'tap-to-focus', 'inertia-scroll', 'swipe', 'long-press', 'swipe-up-more', 'double-tap-zoom', 'jiggle-mode', 'error-shake'] },
    { key: 'drag', label: '끌기', ids: ['drag-drop', 'drag-select', 'reorder-list', 'resize-handle', 'scrubbing', 'split-pane'] },
    { key: 'sense', label: '소리 · 진동', ids: ['haptic', 'haptic-pattern', 'click-sound', 'earcon', 'success-sound', 'error-sound', 'sound-toggle'] },
    { key: 'mouse', label: '마우스', ids: ['hover', 'magnetic-button', 'cursor-follower', 'tilt-card', 'hover-video'] },
    { key: 'motion', label: '움직임 원리', ids: ['parallax', 'micro-interaction', 'scroll-snap', 'rubber-band', 'scroll-reveal', 'shared-element', 'easing', 'spring', 'ripple', 'overscroll-glow'] },
  ],
  ai: [
    { key: 'ask', label: '묻기', ids: ['prompt-box', 'prompt-template', 'suggestion-chips', 'attachment-chip', 'voice-input', 'voice-orb', 'model-picker', 'ai-persona', 'reasoning-toggle', 'creativity-slider', 'edit-prompt', 'context-meter', 'ghost-text', 'inline-ai', 'voice-transcript', 'ai-mode-tabs', 'usage-meter'] },
    { key: 'answer', label: '답 보여 주기', ids: ['streaming', 'typing-indicator', 'thinking', 'citation', 'ai-summary', 'tool-call', 'agent-steps', 'canvas-panel', 'image-gen-grid', 'ai-badge', 'approval-request', 'agent-handoff', 'memory-indicator', 'image-generating', 'ai-diff', 'deep-research', 'ai-overview', 'computer-use', 'citation-hover', 'file-analysis', 'ai-code-run', 'ai-refusal'] },
    { key: 'after', label: '답 다루기', ids: ['regenerate', 'feedback-thumbs', 'answer-compare', 'stop-button', 'copy-button', 'branch-navigator', 'smart-reply', 'chat-history', 'ai-disclaimer', 'translate-toggle', 'ai-feedback-reason', 'shared-chat-link'] },
  ],
  style: [
    { key: 'base', label: '기본 흐름', ids: ['material', 'material-you', 'flat', 'skeuomorphism', 'minimalism', 'dark-mode', 'high-contrast', 'wireframe-style', 'pastel'] },
    { key: 'surface', label: '질감 · 빛', ids: ['neumorphism', 'glassmorphism', 'liquid-glass', 'claymorphism', '3d-render', 'grain', 'blob', 'gradient-mesh', 'aurora', 'neon', 'paper', 'gradient-border', 'glow-button', 'soft-shadow'] },
    { key: 'retro', label: '레트로 · 시대', ids: ['y2k', 'memphis', 'pixel', 'vaporwave', 'frutiger-aero', 'bauhaus', 'art-deco', 'swiss', 'cyberpunk', 'glitch', 'retro-terminal', 'chrome-type', 'halftone'] },
    { key: 'art', label: '그림 · 배치', ids: ['brutalism', 'bento-grid', 'editorial', 'collage', 'isometric', 'hand-drawn', 'line-art', 'kawaii', 'monochrome', 'duotone', 'corporate-memphis', 'riso', 'flat-illustration', 'sticker'] },
  ],
}

/** 서랍 하나를 상세 항목별로 나눠요. 상세 항목이 없는 서랍은 한 덩어리로 돌려줘요. */
export function splitDrawer(d: DrawerId): { key: string; label: string; list: Entry[] }[] {
  const all = inDrawer(d)
  const subs = SUBS[d]
  if (!subs) return [{ key: 'all', label: '', list: all }]
  const byKey = new Map(all.map((e) => [e.id, e]))
  const used = new Set<string>()
  const out = subs
    .map((s) => ({ key: s.key, label: s.label, list: s.ids.filter((id) => byKey.has(id)).map((id) => { used.add(id); return byKey.get(id)! }) }))
    .filter((s) => s.list.length)
  const rest = all.filter((e) => !used.has(e.id))
  if (rest.length) out.push({ key: 'etc', label: '그 밖에', list: rest })
  return out
}

/** 테스트용: 상세 항목에 적었는데 그 서랍에 없는 카드 */
export const misplaced = () => Object.entries(SUBS).flatMap(([d, subs]) =>
  subs!.flatMap((s) => s.ids.filter((id) => !ENTRIES.some((e) => e.id === id && e.drawer === d)).map((id) => `${d}/${s.key}/${id}`)))
