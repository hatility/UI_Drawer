// 체험관 사이트 2: 커뮤니티 ‘빵수다’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Bell, Bold, Heart, Italic, MessageCircle, MoreVertical, PenLine, Search, Smile, X } from 'lucide-react'
import { josa } from './data'
import './sites.css'

export type SiteHandle = { demo: (id: string) => void }
type Props = { saw: (id: string) => void }

type Post = { id: number; author: string; color: string; cat: string; title: string; body: string; min: number; likes: number; liked: boolean; comments: string[] }
const PEOPLE = [['몽글', '#c2552b'], ['빵순이', '#4a6fa5'], ['반죽왕', '#3f8f6b'], ['크루아상', '#9a5bb5']] as const
const CATS = ['전체', '자유', '질문', '후기', '레시피']
const TRENDING = ['소금빵 맛집', '천연 발효종', '오븐 온도', '버터 대신', '크루아상 접기']
const mk = (id: number, p: number, cat: string, title: string, body: string, min: number, likes: number, comments: string[] = []): Post =>
  ({ id, author: PEOPLE[p][0], color: PEOPLE[p][1], cat, title, body, min, likes, liked: false, comments })
const FIRST: Post[] = [
  mk(1, 1, '후기', '성수 소금빵 줄 서서 먹어 봤어요', '아침 8시에 갔는데 벌써 줄이 길었어요. 겉은 바삭하고 속은 버터가 촉촉하게 배어 있어서 줄 선 보람이 있었어요. 다음엔 바게트도 사 보려고요.', 3, 24, ['저도 가 볼래요!']),
  mk(2, 2, '질문', '오븐 온도를 몇 도로 해야 하나요?', '집 오븐으로 식빵을 굽는데 겉만 타고 속은 덜 익어요.', 18, 8, ['170도로 낮추고 시간을 늘려 보세요', '호일을 덮어도 돼요']),
  mk(3, 3, '자유', '크루아상 결 살리기 성공했어요', '버터를 차갑게 유지하는 게 제일 중요했어요. 접을 때마다 냉장고에 30분씩 쉬게 했더니 결이 살아났어요.', 60 * 5, 41),
  mk(4, 0, '자유', '이번 주 빵 클래스 모집해요', '토요일 오후 2시, 소금빵 만들기 클래스예요. 자리가 6개 남았어요.', 60 * 26, 15),
]
const MORE: Post[] = [
  mk(5, 1, '후기', '통밀 깜파뉴 첫 도전 기록', '발효가 생각보다 오래 걸렸지만 향이 정말 좋아요.', 60 * 30, 9),
  mk(6, 2, '질문', '버터 대신 올리브유 써도 되나요?', '비건 친구에게 구워 주고 싶어요.', 60 * 50, 4),
]
const NOTI0 = [
  { t: '빵순이님이 내 글에 댓글을 달았어요', read: false },
  { t: '반죽왕님이 내 글을 좋아해요', read: false },
  { t: '이번 주 인기 글이 나왔어요', read: true },
]
const ago = (min: number) => (min < 1 ? '방금' : min < 60 ? `${min}분 전` : min < 60 * 24 ? `${Math.floor(min / 60)}시간 전` : `${Math.floor(min / 60 / 24)}일 전`)
const EMOJI = ['😀', '😍', '🥐', '👍', '🎉', '😢', '🍞', '❤️']

export const Community = forwardRef<SiteHandle, Props>(function Community({ saw }, ref) {
  const [posts, setPosts] = useState(FIRST)
  const [cat, setCat] = useState('전체')
  const [sort, setSort] = useState<'인기순' | '최신순' | '댓글순'>('최신순')
  const [sortOpen, setSortOpen] = useState(false)
  const [q, setQ] = useState('')
  const [qFocus, setQFocus] = useState(false)
  const [recent, setRecent] = useState(['소금빵', '발효종'])
  const [noti, setNoti] = useState(NOTI0)
  const [notiOpen, setNotiOpen] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number[]>([])
  const [openComments, setOpenComments] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [emoji, setEmoji] = useState(false)
  const [menu, setMenu] = useState<number | null>(null)
  const [report, setReport] = useState<number | null>(null)
  const [compose, setCompose] = useState(false)
  const [dial, setDial] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [fmt, setFmt] = useState({ b: false, i: false })
  const [posting, setPosting] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreLeft, setMoreLeft] = useState(true)
  const [toast, setToast] = useState<{ msg: string; k: number } | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  // 댓글 답장 · 반응: 누구에게 답하는지 인용으로 보여 주고, 댓글마다 이모지 반응을 달아요
  const [replyTo, setReplyTo] = useState<{ who: string; text: string } | null>(null)
  const [reactAt, setReactAt] = useState<string | null>(null)
  const [reacts, setReacts] = useState<Record<string, string>>({})

  const say = (msg: string) => { setToast({ msg, k: Date.now() }); saw('toast') }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toast])
  // 바깥을 누르면 작은 판들이 닫혀요
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.cm-noti-wrap')) setNotiOpen(false)
      if (!t.closest('.cm-sort-wrap')) setSortOpen(false)
      if (!t.closest('.cm-kebab-wrap')) setMenu(null)
      if (!t.closest('.cm-search')) setQFocus(false)
      if (!t.closest('.cm-emoji-wrap')) setEmoji(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const word = q.trim()
  let list = posts.filter((p) => (cat === '전체' || p.cat === cat) && (!word || p.title.includes(word)))
  list = [...list].sort((a, b) => (sort === '인기순' ? b.likes - a.likes : sort === '댓글순' ? b.comments.length - a.comments.length : a.min - b.min))
  const unread = noti.filter((n) => !n.read).length

  const find = (w: string) => { setQ(w); setQFocus(false); if (w) setRecent((r) => [w, ...r.filter((x) => x !== w)].slice(0, 5)); saw('search-highlight') }
  const like = (id: number) => { setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))); saw('micro-interaction') }
  const comment = (id: number) => {
    if (!draft.trim()) return
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, comments: [...p.comments, draft.trim()] } : p)))
    setDraft(''); setReplyTo(null); say(replyTo ? '답장을 달았어요' : '댓글을 달았어요')
  }
  const submit = () => {
    if (!title.trim()) return
    setPosting(true); saw('loading-button')
    setTimeout(() => {
      setPosts((ps) => [mk(Date.now(), 0, cat === '전체' ? '자유' : cat, title.trim(), text.trim() || '(내용 없음)', 0, 0), ...ps])
      setPosting(false); setCompose(false); setTitle(''); setText(''); setSort('최신순')
      say('글을 올렸어요'); saw('optimistic-ui')
    }, 800)
  }
  const submitRef = useRef(submit)
  submitRef.current = submit
  const loadMore = () => {
    setLoadingMore(true); saw('skeleton')
    setTimeout(() => { setPosts((ps) => [...ps, ...MORE]); setLoadingMore(false); setMoreLeft(false); saw('load-more') }, 800)
  }
  const mentionAt = draft.match(/@(\S*)$/)
  const mentions = mentionAt ? PEOPLE.filter(([n]) => n.startsWith(mentionAt[1])) : []

  useImperativeHandle(ref, () => ({
    demo(id) {
      const after = (fn: () => void, ms = 350) => setTimeout(fn, ms)
      scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })
      switch (id) {
        case 'notification-center': case 'unread-dot': after(() => { setNotiOpen(true); saw('notification-center') }); break
        case 'recent-searches': case 'trending-keywords': after(() => { setQFocus(true); saw(id) }); break
        case 'search-highlight': after(() => find('소금빵')); break
        case 'sort-menu': after(() => { setSortOpen(true); saw('sort-menu') }); break
        case 'hover-card': after(() => { setHover(FIRST[0].id); saw('hover-card'); after(() => setHover(null), 2500) }); break
        case 'truncation': after(() => setExpanded([])); break
        case 'rich-text-editor': after(() => { setCompose(true); saw('rich-text-editor') }); break
        case 'mention': after(() => { setOpenComments(FIRST[0].id); setDraft('@빵'); saw('mention') }); break
        case 'emoji-picker': after(() => { setOpenComments(FIRST[0].id); setEmoji(true); saw('emoji-picker') }); break
        case 'load-more': after(() => scroller.current?.scrollTo({ top: 9999, behavior: 'smooth' })); break
        case 'first-use-empty': setCat('레시피'); saw('first-use-empty'); break
        case 'optimistic-ui': after(() => { setCompose(true); setTitle('오늘 구운 소금빵 자랑해요'); after(() => submitRef.current(), 700) }); break
        case 'speed-dial': setDial(true); saw('speed-dial'); break
        case 'comment-thread': after(() => { setOpenComments(FIRST[1].id); saw('comment-thread') }); break
        case 'reply-quote': after(() => { setOpenComments(FIRST[1].id); setReplyTo({ who: PEOPLE[1][0], text: FIRST[1].comments[0] }); saw('reply-quote') }); break
        case 'emoji-reaction': after(() => { setOpenComments(FIRST[1].id); setReactAt(`${FIRST[1].id}-0`); saw('emoji-reaction') }); break
        case 'no-results': after(() => find('마카롱')); break
        case 'copy-link': case 'kebab': after(() => { setMenu(FIRST[0].id); saw('popover') }); break
      }
    },
  }))

  return (
    <div className="site cm">
      <header className="site-bar" data-ui="gnb">
        <b className="site-logo">빵수다</b>
        <div className="cm-search" data-ui="search-bar">
          <Search size={16} />
          <input value={q} placeholder="글 제목으로 찾기" aria-label="글 찾기" onFocus={() => setQFocus(true)} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') find(word) }} />
          {q && <button className="cm-clear" aria-label="지우기" onClick={() => setQ('')}><X size={11} /></button>}
          {qFocus && !q && (
            <div className="site-pop cm-search-pop">
              <div data-ui="recent-searches"><small>최근 검색어</small>{recent.length ? recent.map((r) => <span key={r} className="cm-recent"><button onMouseDown={(e) => { e.preventDefault(); find(r) }}>{r}</button><button aria-label={`${r} 지우기`} onMouseDown={(e) => { e.preventDefault(); setRecent((x) => x.filter((y) => y !== r)) }}><X size={12} /></button></span>) : <em>최근 검색어가 없어요</em>}</div>
              <div data-ui="trending-keywords"><small>인기 검색어</small>{TRENDING.map((t, i) => <button key={t} className="cm-trend" onMouseDown={(e) => { e.preventDefault(); find(t) }}><b>{i + 1}</b>{t}</button>)}</div>
            </div>
          )}
        </div>
        <div className="cm-noti-wrap">
          <button className="site-icon" aria-label={`알림 ${unread}개`} onClick={() => { setNotiOpen((o) => !o); saw('notification-center') }} data-ui="badge">
            <Bell size={19} />{unread > 0 && <em className="site-badge">{unread}</em>}
          </button>
          {notiOpen && (
            <div className="site-pop cm-noti" data-ui="notification-center">
              <div className="cm-noti-head"><b>알림</b><button onClick={() => setNoti((n) => n.map((x) => ({ ...x, read: true })))}>모두 읽음</button></div>
              {noti.map((n, i) => <button key={i} className={`cm-noti-row${n.read ? '' : ' unread'}`} onClick={() => setNoti((x) => x.map((y, j) => (j === i ? { ...y, read: true } : y)))}>{!n.read && <i data-ui={i === 0 ? 'unread-dot' : undefined} />}{n.t}</button>)}
            </div>
          )}
        </div>
        <span className="cm-facepile" data-ui="avatar-group" title="지금 9명이 보고 있어요">{PEOPLE.slice(1).map(([n, c]) => <i key={n} style={{ background: c }}>{n[0]}</i>)}<i className="more">+6</i></span>
        <span className="cm-me" data-ui="presence-dot" title="몽글 (접속 중)"><span className="site-avatar" style={{ background: PEOPLE[0][1] }}>몽</span><i /></span>
      </header>

      <div className="site-scroll" ref={scroller}>
        <div className="cm-main">
          <div className="cm-tabs" data-ui="tabs" role="tablist">
            {CATS.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="cm-tools">
            {word ? <span className="cm-result">‘{word}’ 검색 결과 {list.length}개 <button onClick={() => setQ('')}>지우기</button></span> : <span />}
            <div className="cm-sort-wrap">
              <button className="cm-sort" data-ui="sort-menu" onClick={() => { setSortOpen((o) => !o); saw('sort-menu') }}>{sort} ▾</button>
              {sortOpen && <div className="site-pop cm-sort-pop" role="menu">{(['최신순', '인기순', '댓글순'] as const).map((s) => <button key={s} role="menuitemradio" aria-checked={sort === s} className={sort === s ? 'on' : ''} onClick={() => { setSort(s); setSortOpen(false) }}>{s}</button>)}</div>}
            </div>
          </div>

          {list.length === 0 ? (
            cat === '레시피' && !word ? (
              <div className="site-empty" data-ui="first-use-empty"><span><PenLine size={22} /></span><b>아직 레시피가 없어요</b><small>첫 레시피를 올려 볼까요?</small><button className="site-btn" onClick={() => setCompose(true)}>레시피 쓰기</button></div>
            ) : (
              <div className="site-empty" data-ui="no-results"><span><Search size={22} /></span><b>‘{word}’ 결과가 없어요</b><small>다른 말로 찾아보세요</small><button className="site-btn site-btn--line" onClick={() => setQ('')}>검색어 지우기</button></div>
            )
          ) : (
            <div className="cm-feed" data-ui="feed">
              {list.map((p, i) => {
                const long = p.body.length > 50
                const open = expanded.includes(p.id)
                const at = word ? p.title.indexOf(word) : -1
                return (
                  <article key={p.id} className={`cm-post${p.min === 0 ? ' cm-new' : ''}`} data-ui={p.min === 0 ? 'optimistic-ui' : undefined}>
                    <div className="cm-post-head">
                      <span className="site-avatar" style={{ background: p.color }}>{p.author[0]}</span>
                      <span className="cm-author" onMouseEnter={() => { setHover(p.id); saw('hover-card') }} onMouseLeave={() => setHover(null)} data-ui={i === 0 ? 'hover-card' : undefined}>
                        {p.author}
                        {hover === p.id && <span className="site-pop cm-hovercard"><span className="site-avatar" style={{ background: p.color }}>{p.author[0]}</span><span><b>{p.author}</b><small>글 {12 + (p.id % 30)}개 · 가입 2년</small></span></span>}
                      </span>
                      <small className="cm-time" data-ui={i === 0 ? 'relative-time' : undefined} title={`${p.min}분 전에 올렸어요`}>{ago(p.min)}</small>
                      <span className="cm-cat">{p.cat}</span>
                      <div className="cm-kebab-wrap">
                        <button className="site-icon" aria-label="더보기" data-ui={i === 0 ? 'kebab' : undefined} onClick={() => { setMenu(menu === p.id ? null : p.id); saw('popover') }}><MoreVertical size={16} /></button>
                        {menu === p.id && (
                          <div className="site-pop cm-menu" data-ui="popover">
                            <button data-ui="copy-link" onClick={() => { setMenu(null); say('링크를 복사했어요'); saw('copy-link') }}>링크 복사</button>
                            <button className="site-danger" onClick={() => { setMenu(null); setReport(p.id); saw('alert') }}>신고하기</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div data-h="3">{at >= 0 ? <>{p.title.slice(0, at)}<mark data-ui="search-highlight">{word}</mark>{p.title.slice(at + word.length)}</> : p.title}</div>
                    <p className={long && !open ? 'cm-clamp' : ''} data-ui={long && !open && i < 3 ? 'truncation' : undefined}>{p.body}</p>
                    {long && <button className="cm-more" onClick={() => setExpanded((x) => (open ? x.filter((y) => y !== p.id) : [...x, p.id]))}>{open ? '접기' : '…더보기'}</button>}
                    <div className="cm-actions">
                      <button className={p.liked ? 'on' : ''} aria-pressed={p.liked} onClick={() => like(p.id)} data-ui={i === 0 ? 'micro-interaction' : undefined}><Heart size={16} />{p.likes}</button>
                      <button aria-expanded={openComments === p.id} onClick={() => setOpenComments(openComments === p.id ? null : p.id)}><MessageCircle size={16} />{p.comments.length}</button>
                    </div>
                    {openComments === p.id && (
                      <div className="cm-comments" data-ui="comment-thread">
                        {p.comments.map((c, j) => {
                          const who = PEOPLE[(j + 1) % 4][0], key = `${p.id}-${j}`
                          return (
                            <div key={j} className={`cm-c${j ? ' cm-reply' : ''}`}>
                              <p><b>{who}</b> {c}{reacts[key] && <span className="cm-react-got">{reacts[key]}</span>}</p>
                              <span className="cm-c-act">
                                <button onClick={() => { setReplyTo({ who, text: c }); saw('reply-quote') }}>답장</button>
                                <button aria-expanded={reactAt === key} onClick={() => { setReactAt(reactAt === key ? null : key); saw('emoji-reaction') }}>반응</button>
                              </span>
                              {reactAt === key && <div className="cm-reacts" data-ui="emoji-reaction">{['👍', '❤️', '😂', '😮', '🥐'].map((e) => <button key={e} onClick={() => { setReacts((r) => ({ ...r, [key]: e })); setReactAt(null) }}>{e}</button>)}</div>}
                            </div>
                          )
                        })}
                        {replyTo && <div className="cm-quote" data-ui="reply-quote"><span><b>{replyTo.who}</b>에게 답장 · {replyTo.text}</span><button aria-label="답장 그만" onClick={() => setReplyTo(null)}><X size={14} /></button></div>}
                        <div className="cm-write">
                          <input value={draft} placeholder="댓글 달기 · @로 사람 부르기" aria-label="댓글" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !mentions.length) comment(p.id) }} data-ui="text-field" />
                          <div className="cm-emoji-wrap">
                            <button className="site-icon" aria-label="이모지" onClick={() => { setEmoji((o) => !o); saw('emoji-picker') }}><Smile size={18} /></button>
                            {emoji && <div className="site-pop cm-emoji" data-ui="emoji-picker">{EMOJI.map((e) => <button key={e} onClick={() => { setDraft((d) => d + e); setEmoji(false) }}>{e}</button>)}</div>}
                          </div>
                          <button className="site-btn" onClick={() => comment(p.id)}>등록</button>
                          {mentions.length > 0 && (
                            <div className="site-pop cm-mention" data-ui="mention">
                              {mentions.map(([n, c]) => <button key={n} onClick={() => { setDraft(draft.replace(/@\S*$/, `@${n} `)); saw('mention') }}><span className="site-avatar site-avatar--sm" style={{ background: c }}>{n[0]}</span>{n}</button>)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
              {loadingMore && [0, 1].map((i) => <div key={i} className="cm-post cm-sk" data-ui="skeleton"><i /><i /><i /></div>)}
              {moreLeft && !loadingMore && cat === '전체' && !word && <button className="site-btn site-btn--line cm-loadmore" data-ui="load-more" onClick={loadMore}>더보기</button>}
            </div>
          )}
        </div>
      </div>

      <div className="cm-dial" data-ui="speed-dial">
        {dial && (['투표 만들기', '사진 올리기'] as const).map((t) => <button key={t} className="cm-dial-item" onClick={() => { setDial(false); say(`${josa(t, '은', '는')} 체험관에 없어요`) }}>{t}</button>)}
        {dial && <button className="cm-dial-item" onClick={() => { setDial(false); setCompose(true) }}>글쓰기</button>}
        <button className={`site-fab${dial ? ' on' : ''}`} data-ui="fab" aria-expanded={dial} aria-label={dial ? '닫기' : '새로 만들기'} onClick={() => { setDial((d) => !d); saw('speed-dial') }}>{dial ? <X size={20} /> : <PenLine size={18} />}{dial ? '' : '만들기'}</button>
      </div>

      {(compose || report !== null) && <div className="pg-dim" onClick={() => { if (!posting) { setCompose(false); setReport(null) } }} />}
      {compose && (
        <div className="pg-modal cm-compose" role="dialog" aria-modal="true" aria-label="글쓰기" data-ui="modal">
          <div data-h="4">글쓰기</div>
          <input className="cm-title" value={title} placeholder="제목" aria-label="제목" onChange={(e) => setTitle(e.target.value)} />
          <div className="cm-rte" data-ui="rich-text-editor">
            <div className="cm-rte-bar">
              <button aria-pressed={fmt.b} className={fmt.b ? 'on' : ''} aria-label="굵게" onClick={() => setFmt((f) => ({ ...f, b: !f.b }))}><Bold size={15} /></button>
              <button aria-pressed={fmt.i} className={fmt.i ? 'on' : ''} aria-label="기울임" onClick={() => setFmt((f) => ({ ...f, i: !f.i }))}><Italic size={15} /></button>
            </div>
            <textarea value={text} placeholder="빵 이야기를 들려주세요" aria-label="내용" maxLength={500} onChange={(e) => setText(e.target.value)} style={{ fontWeight: fmt.b ? 700 : 400, fontStyle: fmt.i ? 'italic' : 'normal' }} />
            <small data-ui="textarea">{text.length} / 500</small>
          </div>
          <div className="pg-row cm-compose-actions">
            <button className="pg-btn pg-btn--line" disabled={posting} onClick={() => setCompose(false)}>취소</button>
            <button className="pg-btn" disabled={!title.trim() || posting} data-ui={posting ? 'loading-button' : title.trim() ? undefined : 'disabled'} onClick={submit}>{posting ? <><i className="pg-spin" />올리는 중</> : '올리기'}</button>
          </div>
        </div>
      )}
      {report !== null && (
        <div className="pg-modal pg-modal--alert" role="alertdialog" aria-modal="true" data-ui="alert">
          <div data-h="4">이 글을 신고할까요?</div>
          <p>체험관이라 실제로 신고되지는 않아요.</p>
          <div className="pg-row"><button className="pg-btn pg-btn--line" onClick={() => setReport(null)}>취소</button><button className="pg-btn" onClick={() => { setReport(null); say('신고했어요 (체험이에요)') }}>신고하기</button></div>
        </div>
      )}
      <div className="pg-toasts">{toast && <div key={toast.k} className="pg-toast" data-ui="toast" role="status">{toast.msg}</div>}</div>
    </div>
  )
})
