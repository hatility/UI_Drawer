// 사이트 푸터: 그려봄 · My Pick 과 같은 틀 (브랜드 + 하틸리티 칩 · 링크 두 열 · 저작권 줄). 끝이 있는 화면 아래에만 붙어요.
import { AUTHOR, ORG, ORG_LINE, REPO, issueUrl } from './about'
import { useTx } from './i18n'

export function SiteFooter() {
  const tx = useTx()
  const go: [string, string][] = [['#/dict', tx('사전', 'Dictionary')], ['#/learn', tx('배우기', 'Learn')], ['#/play', tx('체험관', 'Playground')], ['#/tags', tx('어디서나 이름표', 'Name tags anywhere')], ['#/drawers', tx('서랍 지도', 'Drawer map')]]
  const more: [string, string, boolean?][] = [['#/about', tx('이 사이트에 대해', 'About')], ['#/news', tx('새로 들어온 카드', 'New cards')], ['#/mine', tx('내 서랍', 'My drawer')], [issueUrl('new-card', '[새 카드] ', {}), tx('없는 UI 제안하기', 'Suggest a card'), true], [issueUrl('bug', '[고장] ', {}), tx('고장 알리기', 'Report a bug'), true]]
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const
  return (
    <footer className="foot">
      <div className="foot-card">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="foot-mark" href="#/" aria-label={tx('UI Drawer 처음으로', 'UI Drawer home')}><img src="/icon-192.png" alt="" width={28} height={28} /><b>UI Drawer</b></a>
            <p>{tx('이름이 생각 안 나는 그 UI, 서랍에서 꺼내 보세요. 가입 없이, 기록은 내 브라우저에만 남아요.', 'That UI whose name you forgot — pull it out of the drawer. No sign-up; everything stays in your browser.')}</p>
            <a className="foot-hat" href={ORG.url} {...ext}><img src="/hatility.png" alt="" width={30} height={30} /><span><b>{tx('하틸리티가 만든 상자', 'A hatility box')}</b><small>{tx(ORG_LINE, 'A small studio making little web services anyone can open and use right away.')}</small></span></a>
          </div>
          <nav aria-label={tx('둘러보기', 'Browse')}>
            <h2>{tx('둘러보기', 'Browse')}</h2>
            <ul>{go.map(([href, name]) => <li key={href}><a href={href}>{name}</a></li>)}</ul>
          </nav>
          <nav aria-label={tx('알아보기', 'More')}>
            <h2>{tx('알아보기', 'More')}</h2>
            <ul>{more.map(([href, name, out]) => <li key={href}><a href={href} {...(out ? ext : {})}>{name}{out && <span className="foot-ext" aria-hidden="true">↗</span>}</a></li>)}</ul>
          </nav>
        </div>
        <p className="foot-copy">
          <span>© 2026 hatility · {tx('만든 사람', 'Made by')} <a href={AUTHOR.url} {...ext}>{AUTHOR.name}</a> · UI Drawer v{__APP_VERSION__} · <a href={REPO + '/blob/main/LICENSE'} {...ext}>MIT</a> · <a href={REPO} {...ext}>{tx('소스 코드', 'Source')}</a></span>
          <span className="foot-small"><a href="#/about">{tx('AI와 함께 만들었어요', 'Built with AI')}</a><a href="#/about">{tx('내 기록은 어디에', 'Where my data lives')}</a></span>
        </p>
      </div>
    </footer>
  )
}
