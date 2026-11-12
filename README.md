<div align="center">

# 🗄️ UI Drawer

### 이름이 생각 안 나는 그 UI, 서랍에서 꺼내 보세요.

<sub>토스트? 스낵바? 바텀시트? — 헷갈릴 때 꺼내 보는 <b>UI 이름 서랍장</b></sub>

<br>

![version](https://img.shields.io/badge/version-0.3.0-006A60?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-006A60?style=flat-square)
![Material 3](https://img.shields.io/badge/Material-3-006A60?style=flat-square&logo=materialdesign&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![PC](https://img.shields.io/badge/PC-site-6B6F7A?style=flat-square)

</div>

## 무엇을 하나요

| | |
|---|---|
| 🗄️ **서랍** | UI 이름 카드 150장을 10개 서랍(알림과 피드백 · 로딩 · 입력 폼 · 이동 구조 · 콘텐츠 담기 · 디자인 스타일 · 제스처 · 메뉴 아이콘 별명 · AI 화면 · 다크 패턴)에 나눠 담았어요. 카드에 마우스를 올리면 그림이 움직여요. |
| 🔍 **모양으로 찾기** | 이름을 몰라도 돼요. ‘아래에서 올라오는 창’, ‘점 세 개’처럼 모양을 적거나 `ㅌㅅㅌ`처럼 초성만 적어도 찾아요. |
| 📂 **사이드 시트** | 카드를 누르면 옆에서 설명 창이 밀려 나와요. (이 창의 이름도 드로어예요!) 이럴 때 쓰는지, 헷갈리는 친구와 무엇이 다른지 알려 줘요. |
| 🥐 **체험관** | 가상의 빵집 사이트 ‘몽글 베이커리’에서 UI를 직접 눌러 봐요. **이름표**를 켜면 화면의 모든 UI에 이름이 붙고, **스타일**을 바꾸면 같은 사이트가 플랫 · 글래스 · 뉴모피즘 · 브루탈 · 다크로 바뀌어요. |
| 📱 **모바일 체험** | 휴대폰 화면 안의 앱에서 당겨서 새로고침 · 밀어서 삭제 · 꾹 누르기 · 두 번 탭 · 바텀시트 끌어 내리기를 마우스로 직접 해 봐요. |

## 바로 띄우기 (Docker)

```bash
docker compose up -d --build
# → http://localhost:8081
```

포트를 바꾸려면 `PORT=9000 docker compose up -d --build`.
[Releases](../../releases) 의 zip 을 받아 풀고 같은 명령을 써도 돼요.

## 고쳐 보기

```bash
cd app
npm install
npm run dev     # http://localhost:5180
npm test
```

- 카드 더하기: `app/src/data.ts` 에 항목 하나 + `app/src/Preview.tsx` 에 그림 하나
- 체험관에 붙이기: 사이트 요소에 `data-ui="<카드 id>"` 를 달면 이름표가 붙어요

## 라이선스

[MIT](LICENSE) · 함께 쓴 것은 [NOTICE.md](NOTICE.md) 에 있어요.
머티리얼 3 디자인으로 만들었고, 그림은 [Stageshow](NOTICE.md) 킷(MIT)으로 그렸어요.
