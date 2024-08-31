const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
import { ref, onValue, push, set, get, update } from "./firebase/firebaseDatabase.js";
import { initializeApp } from "./firebase/firebaseapp.js";
import { getDatabase } from "./firebase/firebaseDatabase.js";

document.getElementById('reviewBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'review.html' });
});
document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('submitButton').addEventListener('click', function () {
  const word = document.getElementById('wordInput').value;
  if (word !== '') {
    chrome.storage.sync.get(['sourceLang', 'targetLang'], function (result) {
      const sourceLang = result.sourceLang;
      const targetLang = result.targetLang;
      document.getElementById('apiUrl').textContent = sourceLang + '|' + targetLang;
      const apiUrl = `${TRANSLATE_API_URL}?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const meaning = data.responseData.translatedText || 'Không tìm thấy nghĩa của từ này';
          const dochinhxac = data.responseData.match;
          document.getElementById('doChinhXac').textContent = `Đó chính xác: ${dochinhxac}`;
          document.getElementById('output').textContent = `Nghĩa của từ "${word}" là: ${meaning}`;
        
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('output').textContent = 'Có lỗi xảy ra. Vui lòng thử lại.',error;
        });
        
    });
  } else {
    document.getElementById('output').textContent = 'Vui lòng nhập một từ.';
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyDvXLhf7X0Ccq250bI6isWGArHE20o95uw",
  authDomain: "dg-learning-cf9cc.firebaseapp.com",
  databaseURL: "https://dg-learning-cf9cc-default-rtdb.firebaseio.com",
  projectId: "dg-learning-cf9cc",
  storageBucket: "dg-learning-cf9cc.appspot.com",
  messagingSenderId: "863488488320",
  appId: "1:863488488320:web:b99ca0f1b8fada5c32c765",
  measurementId: "G-MR5Z5LVDG5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('readDataBtn').addEventListener('click', () => readData(database));
export function readData(database) {
    const dbRef = ref(database, 'vocab');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        displayData(data);
    });
}
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