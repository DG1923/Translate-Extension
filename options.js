document.getElementById('save').addEventListener('click', () => {
  const sourceLang = document.getElementById('sourceLang').value;
  const targetLang = document.getElementById('targetLang').value;
  chrome.storage.sync.set({ sourceLang, targetLang }, () => {
    alert('Saved your setting !');
  });
});

// Load saved settings
chrome.storage.sync.get(['sourceLang', 'targetLang'], (result) => {
  document.getElementById('sourceLang').value = result.sourceLang || 'en';
  document.getElementById('targetLang').value = result.targetLang || 'vi';
});