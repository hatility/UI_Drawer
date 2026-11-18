import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

// 배포판에서만 오프라인 지원을 켜요 (개발 서버에서는 저장된 파일이 섞이지 않게 꺼 둬요)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* 지원하지 않으면 그냥 온라인으로 */ }) })
}
