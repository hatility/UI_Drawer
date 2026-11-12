// 배포 묶음 만들기: npm run release → ../release/v<버전>/ (= 'UI Drawer (HYBS)/배포/v<버전>/')
// 묶음에는 빌드된 web/ 과 nginx 설정, 이미지 하나짜리 Dockerfile · docker-compose 가 들어가요.
// 서버에서는 그 폴더에서 docker compose up -d --build 만 하면 돼요.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
const out = `../release/v${version}`
if (existsSync(out) && !process.argv.includes('--force')) {
  console.error(`${out} 가 이미 있어요. 다시 만들려면 npm run release -- --force`)
  process.exit(1)
}
execSync('npm run build', { stdio: 'inherit' })
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
cpSync('dist', `${out}/web`, { recursive: true })
cpSync('deploy/nginx.conf', `${out}/nginx.conf`)
writeFileSync(`${out}/Dockerfile`, `FROM nginx:1.27-alpine\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nCOPY web /usr/share/nginx/html\nEXPOSE 80\n`)
writeFileSync(`${out}/docker-compose.yml`, `# UI Drawer v${version}: docker compose up -d --build → http://서버주소:8081\nservices:\n  web:\n    build: .\n    image: ui-drawer:${version}\n    ports:\n      - "\${PORT:-8081}:80"\n    restart: unless-stopped\n`)
const log = readFileSync('CHANGELOG.md', 'utf8')
const m = log.match(new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\][^\\n]*\\n([\\s\\S]*?)(?=^## \\[|$(?![\\s\\S]))`, 'm'))
writeFileSync(`${out}/CHANGES.md`, `# UI Drawer v${version}\n\n${m ? m[1].trim() : ''}\n`)
console.log(`✓ ${out} 를 만들었어요`)
