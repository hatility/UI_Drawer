// 카드 그림을 밖으로 가져가기: 지금 보이는 모양 그대로 스타일을 박아 넣은 HTML · SVG · PNG.
// (스타일시트 없이도 같은 모양이 나오게 계산된 스타일을 요소마다 적어요)
const PROPS = ['display', 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'margin', 'padding', 'gap', 'grid-template-columns', 'grid-template-rows', 'flex', 'flex-direction', 'align-items', 'justify-content', 'justify-items', 'align-content', 'place-items', 'border', 'border-radius', 'background', 'color', 'font', 'letter-spacing', 'line-height', 'text-align', 'white-space', 'box-shadow', 'opacity', 'overflow', 'transform', 'translate', 'rotate', 'scale', 'z-index', 'clip-path', 'filter', 'zoom', 'text-decoration', 'outline', 'mix-blend-mode', 'fill', 'stroke', 'stroke-width']

function inline(src: Element, dst: Element) {
  const cs = getComputedStyle(src)
  ;(dst as HTMLElement).setAttribute('style', PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(';') + ';animation:none;transition:none')
  for (let i = 0; i < src.children.length; i++) inline(src.children[i], dst.children[i])
}
/** 스타일을 박아 넣은 HTML 한 덩어리 */
export function cardHTML(pv: HTMLElement) {
  const clone = pv.cloneNode(true) as HTMLElement
  inline(pv, clone)
  return clone.outerHTML
}
export function cardSVG(pv: HTMLElement) {
  const { width: w, height: h } = pv.getBoundingClientRect()
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${cardHTML(pv)}</div></foreignObject></svg>`
}
const save = (blob: Blob, name: string) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000) }
export const downloadSVG = (pv: HTMLElement, name: string) => save(new Blob([cardSVG(pv)], { type: 'image/svg+xml' }), `${name}.svg`)
/** PNG: SVG를 2배로 그려서 내려받아요 */
export function downloadPNG(pv: HTMLElement, name: string) {
  const svg = cardSVG(pv)
  const img = new Image()
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = img.width * 2; c.height = img.height * 2
    const g = c.getContext('2d')!; g.scale(2, 2); g.drawImage(img, 0, 0)
    c.toBlob((b) => b && save(b, `${name}.png`))
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

/** 스타일 글자 'a-b:c;…' → JSX 스타일 객체 글자 */
const jsxStyle = (css: string) => '{{ ' + css.split(';').filter((d) => d.includes(':')).map((d) => { const i = d.indexOf(':'); const k = d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()); return `${k}: ${JSON.stringify(d.slice(i + 1).trim())}` }).join(', ') + ' }}'
function jsx(n: Node, pad: string): string {
  if (n.nodeType === 3) { const t = (n.textContent ?? '').trim(); return t ? pad + '{' + JSON.stringify(t) + '}' : '' }
  if (!(n instanceof Element)) return ''
  const tag = n.tagName.toLowerCase()
  const attrs = [...n.attributes].filter((a) => !a.name.startsWith('data-') && a.name !== 'class').map((a) => a.name === 'style' ? `style=${jsxStyle(a.value)}` : `${a.name === 'for' ? 'htmlFor' : a.name === 'tabindex' ? 'tabIndex' : a.name}=${JSON.stringify(a.value)}`)
  const kids = [...n.childNodes].map((c) => jsx(c, pad + '  ')).filter(Boolean)
  const open = `${pad}<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`
  return kids.length ? `${open}>\n${kids.join('\n')}\n${pad}</${tag}>` : `${open} />`
}
const pascal = (id: string) => id.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()).replace(/^(\d)/, 'Ui$1')
/** React 컴포넌트 한 개 (모양만 · 움직임과 상태는 직접 붙여요) */
export function cardReact(pv: HTMLElement, id: string) {
  const doc = new DOMParser().parseFromString(cardHTML(pv), 'text/html').body.firstElementChild!
  return `// UI Drawer · ${id} (모양만 옮긴 뼈대예요. 상태 · 움직임은 직접 붙이세요)\nexport function ${pascal(id)}() {\n  return (\n${jsx(doc, '    ')}\n  )\n}\n`
}
/** Vue 단일 파일 컴포넌트 */
export const cardVue = (pv: HTMLElement, id: string) => `<!-- UI Drawer · ${id} (모양만 옮긴 뼈대예요) -->\n<template>\n  ${cardHTML(pv)}\n</template>\n`

/** 스타일을 클래스로 빼서 HTML + CSS 두 덩어리로 (같은 스타일은 한 클래스로 묶어요) */
export function cardCSS(pv: HTMLElement, id: string) {
  const doc = new DOMParser().parseFromString(cardHTML(pv), 'text/html').body.firstElementChild!
  const map = new Map<string, string>()
  const walk = (el: Element) => {
    const st = el.getAttribute('style')
    if (st) { if (!map.has(st)) map.set(st, `${id}-${map.size + 1}`); el.removeAttribute('style'); el.setAttribute('class', map.get(st)!) }
    ;[...el.children].forEach(walk)
  }
  walk(doc)
  const css = [...map].map(([st, c]) => `.${c} { ${st.split(';').filter(Boolean).join('; ')}; }`).join('\n')
  return `<!-- UI Drawer · ${id} -->\n${doc.outerHTML}\n\n<style>\n${css}\n</style>\n`
}
/** Tailwind: 값을 그대로 옮긴 임의 값 클래스 [속성:값] (기본값 · 0 은 빼요) */
const SKIP = /^(normal|none|auto|0px|visible|static|0 1 auto|row|start|stretch|1|matrix\(1, 0, 0, 1, 0, 0\))$/
export function cardTailwind(pv: HTMLElement, id: string) {
  const doc = new DOMParser().parseFromString(cardHTML(pv), 'text/html').body.firstElementChild!
  const walk = (el: Element) => {
    const st = el.getAttribute('style')
    if (st) {
      const cls = st.split(';').map((d) => d.split(/:(.*)/s)).filter(([k, v]) => k && v && !SKIP.test(v.trim()) && !/^(animation|transition)$/.test(k.trim()))
        .map(([k, v]) => `[${k.trim()}:${v.trim().replace(/\s+/g, '_')}]`)
      el.removeAttribute('style'); el.setAttribute('class', cls.join(' '))
    }
    ;[...el.children].forEach(walk)
  }
  walk(doc)
  return `<!-- UI Drawer · ${id} (Tailwind 임의 값 클래스) -->\n${doc.outerHTML}\n`
}

/** 공유 이미지 (1200×630): 왼쪽 그림, 오른쪽 이름 · 영어 이름 · 설명. SNS · 메신저에 붙이기 좋아요 */
export function downloadShareCard(pv: HTMLElement, e: { id: string; ko: string; en: string; desc: string }) {
  const img = new Image()
  img.onload = () => {
    const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H
    const g = c.getContext('2d')!
    const v = (name: string, fb: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb
    const font = (s: string) => `${s} -apple-system, "Apple SD Gothic Neo", Pretendard, "Noto Sans KR", sans-serif`
    const wrap = (text: string, x: number, y: number, max: number, lh: number, lines: number) => {
      let line = '', n = 0
      for (const ch of text) { if (g.measureText(line + ch).width > max && line) { g.fillText(line, x, y); y += lh; line = ch; if (++n >= lines - 1) { line += '…'; break } } else line += ch }
      g.fillText(line, x, y); return y + lh
    }
    g.fillStyle = v('--md-surface', '#f6faf8'); g.fillRect(0, 0, W, H)
    const box = { x: 56, y: 96, w: 560, h: 440 }
    g.fillStyle = v('--md-surface-container-low', '#eef3f1'); g.beginPath(); g.roundRect(box.x, box.y, box.w, box.h, 28); g.fill()
    const k = Math.min((box.w - 40) / img.width, (box.h - 40) / img.height), w = img.width * k, h = img.height * k
    g.drawImage(img, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h)
    const x = 672, max = 470
    g.fillStyle = v('--md-primary', '#006a60'); g.font = font('600 22px'); g.fillText('UI Drawer · UI 이름 사전', x, 130)
    g.fillStyle = v('--md-on-surface', '#191c1b'); g.font = font('500 54px'); let y = wrap(e.ko, x, 215, max, 64, 2)
    g.fillStyle = v('--md-on-surface-variant', '#3f4946'); g.font = font('400 28px'); g.fillText(e.en, x, y + 4); y += 60
    g.fillStyle = v('--md-on-surface', '#191c1b'); g.font = font('400 24px'); wrap(e.desc, x, y + 10, max, 36, 4)
    g.fillStyle = v('--md-on-surface-variant', '#3f4946'); g.font = font('400 20px'); g.fillText(`${location.host}${location.pathname}#/w/${e.id}`, x, H - 56)
    c.toBlob((b) => b && save(b, `ui-drawer-${e.id}-share.png`))
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cardSVG(pv))
}
