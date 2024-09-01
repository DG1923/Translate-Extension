const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
document.getElementById('reviewBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'review.html' });
});
document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
document.getElementById('btnTranslate').addEventListener('click', function () {
  const word = document.getElementById('wordInput').value;
  if (word !== '') {
    chrome.storage.sync.get(['sourceLang', 'targetLang'], function (result) {
      const sourceLang = result.sourceLang;
      const targetLang = result.targetLang;
      chrome.runtime.sendMessage({action:"translate", word: word, sourceLang: sourceLang, targetLang: targetLang}, function(response) {
        if(response.success){
          document.getElementById('meaning').textContent = response.meaning;
          document.getElementById('doChinhXac').textContent = response.dochinhxac;
        }
      });
    });
  } else {
    alert("Vui long nhap 1 tu");
  }
});

document.getElementById('btnWriteData').addEventListener('click', function () {
  const word = document.getElementById('wordInput').value;
  const meaning = document.getElementById('meaning').textContent;
  chrome.runtime.sendMessage({action:"addData", word: word, meaning: meaning}, function(response) {
    if(response.success){
      alert("Them thanh cong");
    }
  });
});

document.getElementById('readDataBtn').addEventListener('click', function () {
  chrome.runtime.sendMessage({action:"readData"}, function(response) {
    if(response.success){
      displayData(response.data);
    }
  });
})
function displayData(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  if (data) {
      for (let key in data) {
          resultDiv.innerHTML += `<p>Word: ${data[key].word}, Meaning: ${data[key].meaning}</p>`;
      }
  } else {
      resultDiv.innerHTML = '<p>No data found</p>';
  }
}