document.addEventListener('dblclick', function(){
  selected = window.getSelection().toString().trim();
  if(selected.length > 0 && selected.length < 500){
    handleSelection();

  }
})
document.addEventListener('mouseup', function(){
  selected = window.getSelection().toString().trim();
  if(selected.length > 0 && selected.length < 500){
    showIcon();
  }
   
});

function removeIcon(){
  const icons = document.querySelectorAll('.translate-icon');
  icons.forEach(icon => icon.remove());
}

function showIcon(){
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('image/icon32.png'); // Đảm bảo đường dẫn đúng
  icon.className = 'translate-icon';
  icon.style.position = 'absolute';
  icon.style.left = `${rect.right + window.scrollX + 5}px`;
  icon.style.top = `${rect.top + window.scrollY}px`;
  icon.style.width = '32px'; // Đảm bảo kích thước đúng
  icon.style.height = '32px';
  document.body.appendChild(icon);
  icon.addEventListener('click', function() {
    handleSelection();
  });
  
}
function handleSelection() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.storage.sync.get(['sourceLang', 'targetLang'], function (result) {
      const sourceLang = result.sourceLang;
      const targetLang = result.targetLang;
      chrome.runtime.sendMessage(
        {
          action: "translate",
          word: selectedText,
          sourceLang: sourceLang,
          targetLang: targetLang
        },
        function (response) {
          if (response.success) {
            showPopup(response.meaning, response.word);
          }
        });
    });
  }
}

function showPopup(meaning, word) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.top = `${rect.bottom + window.scrollY}px`;
  popup.className = 'translation-popup';
  popup.innerHTML = `
    <p>Nghĩa là: ${meaning}</p>
    <button class = "btn-style" role="button" id="addToDict">Thêm vào từ điển</button>
  `;
  
  document.body.appendChild(popup);
  removeIcon();
  document.addEventListener('click', function removePopup(event) {
  if (!popup.contains(event.target)) {
      document.body.removeChild(popup);
      document.removeEventListener('click', removePopup);
    }
  });
  document.getElementById('addToDict').addEventListener('click', function () {
    chrome.runtime.sendMessage({action:"addData", word: word, meaning: meaning}, function(response) {
      if(response.success){
        alert("Đã thêm thành công!");
      }
    })
  });
 
}

