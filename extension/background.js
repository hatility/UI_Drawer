chrome.action.onClicked.addListener(async (tab) => {
  const { base = 'http://localhost:8081/' } = await chrome.storage.sync.get('base')
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: (b) => { window.__uidrawerBase = b }, args: [base] })
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['tags.js'] })
})
