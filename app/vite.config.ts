import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

// 화면 아래에 보여 줄 버전은 package.json 에서 가져와요 (한 곳만 고치면 되게)
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({ plugins: [react()], server: { port: 5180 }, define: { __APP_VERSION__: JSON.stringify(version) },
  // 첫 묶음엔 카드 831장의 글과 그림(사전 · 홈에서 바로 씀)이 들어 있어서 800KB 쯤이에요 (gzip 240KB). 경고 기준만 맞춰요
  build: { chunkSizeWarningLimit: 900 } })
