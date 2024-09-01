chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showTranslation") {
    alert(request.word,' ',request.meaning);
    showTranslationPopup(request.word, request.meaning);
  }
});

document.addEventListener('dblclick', handleSelection);
document.addEventListener('mouseup', handleSelection);

function handleSelection() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.storage.sync.get(['sourceLang', 'targetLang'], function (result) {
      const sourceLang = result.sourceLang;
      const targetLang = result.targetLang;
      chrome.runtime.sendMessage({action:"translate", word: selectedText, sourceLang: sourceLang, targetLang: targetLang}, function(response) {
        if(response.success){
          alert(response.meaning,' ',sourceLang,' ',targetLang);
        }
      });
    });
  }
}

function showTranslationPopup(word, meaning) {
  const popup = document.createElement('div');
  alert(word,' ',meaning);
  document.body.appendChild(popup);
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPopup") {
    alert(request.lang,' ',request.target);
  }
});