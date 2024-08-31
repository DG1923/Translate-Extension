chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showTranslation") {
    alert(request.word,' ',request.meaning);
    showTranslationPopup(request.word, request.meaning);
  }
});

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