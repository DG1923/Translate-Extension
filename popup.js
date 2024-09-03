const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
let vocab = '';
let meaning = '';
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
          vocab = response.word;
          meaning = response.meaning;
          document.getElementById('meaning').value = response.meaning;
          document.getElementById('doChinhXac').textContent =" Độ chính xác: "+ response.dochinhxac*100+"%";
        }
      });
    });
  } else {
    alert("Vui long nhap 1 tu");
  }
});


document.getElementById('btnWriteData').addEventListener('click', function () {
  chrome.runtime.sendMessage({action:"addData",word: vocab, meaning: meaning }, function(response) {
    if(response.success){
      document.getElementById('thongbao').textContent = "Thêm thành công";
      setTimeout(() => {
        document.getElementById('thongbao').textContent = "";
      }, 2000);
    }
  });
})
