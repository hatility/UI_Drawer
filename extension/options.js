const el = document.getElementById('base')
chrome.storage.sync.get('base').then(({ base }) => { el.value = base || 'http://localhost:8081/' })
document.getElementById('save').onclick = async () => { await chrome.storage.sync.set({ base: el.value.trim() }); document.getElementById('ok').textContent = '저장했어요' }
