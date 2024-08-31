const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sourceLang: 'en', targetLang: 'vi', words: [] });
  chrome.contextMenus.create({
    id: "translateWord",
    title: "Dịch '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateWord") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: translateSelection,
      args: [info.selectionText]
    });
    var sourceLang, targetLang;
    chrome.storage.sync.get(['sourceLang', 'targetLang'], (result) => {
      sourceLang = result.sourceLang;
      targetLang = result.targetLang;
    })
  
  }
});
function translateSelection(selectedText) {
  chrome.storage.sync.get(['sourceLang', 'targetLang'], (result) => {
    const sourceLang = result.sourceLang;
    const targetLang = result.targetLang;
    fetch(`${TRANSLATE_API_URL}?q=${encodeURIComponent(selectedText)}&langpair=${sourceLang}|${targetLang}`)
      .then(response => response.json())
      .then(data => {
        const meaning = data.responseData.translatedText;
        alert(meaning,'la nghia cua tu ',selectedText);
        chrome.tabs.sendMessage(tab.id, {
          action: "showTranslation",
          word: selectedText,
          meaning: meaning
        });
      })
      .catch(error => console.error('Error:', error));
  });
}




