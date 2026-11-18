// 휴대폰처럼 마우스를 올릴 수 없는 기기에서는, 카드가 화면에 들어올 때 그림을 한 번 움직여요.
// (.in-view 가 붙으면 preview.css 의 ‘올렸을 때’ 움직임이 그대로 돌아요. 화면을 벗어나면 떼서 다음에 또 움직여요.)
let io: IntersectionObserver | null = null
export function watchInView(el: Element | null) {
  if (!el || typeof IntersectionObserver === 'undefined' || !matchMedia('(hover: none)').matches) return
  io ??= new IntersectionObserver((list) => {
    for (const e of list) e.target.classList.toggle('in-view', e.isIntersecting && e.intersectionRatio > 0.6)
  }, { threshold: [0, 0.6] })
  io.observe(el)
}
