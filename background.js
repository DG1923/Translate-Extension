const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';

//<-------------------------Config Firebase----------------------->
import { ref, onValue, push, set, get, update } from "./firebase/firebaseDatabase.js";
import { initializeApp } from "./firebase/firebaseapp.js";
import { getDatabase } from "./firebase/firebaseDatabase.js";
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
//<-------------------------Config Firebase----------------------->

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sourceLang: 'en', targetLang: 'vi', words: [] });
  chrome.contextMenus.create({
    id: "translateWord",
    title: "Dịch '%s'",
    contexts: ["selection"]
  });
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "translate") {
    translateWord(request.word, request.sourceLang, request.targetLang, sendResponse);
    return true;//keep the message chanel open for sendResponse
  } else if (request.action == "readData") {
    readData(sendResponse);
    return true;
  } else if (request.action == "addData") {
    addData(request.word, request.meaning, sendResponse);
    return true;
  }
});
function addData(word, meaning, sendResponse) {
  const dbRef = ref(database, 'vocab');
  const addNewWordRef = push(dbRef);
  set(addNewWordRef, {
    word: word, meaning: meaning
  }).then(() => {
    sendResponse({
      success: true,
    });
  }).catch((error) => {
    sendResponse({
      success: false,
    });
  });
}

function readData(sendResponse) {
  const dbdRef = ref(database, 'vocab');
  onValue(dbdRef, (snapshot) => {
    const data = snapshot.val();
    sendResponse({
      success: true,
      data,
    });
  });
}
function translateWord(word, sourceLang, targetLang, sendResponse) {
  const apiUrl = `${TRANSLATE_API_URL}?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const meaning = data.responseData.translatedText || 'Không tìm thấy nghĩa của từ này';
      const dochinhxac = data.responseData.match;
      sendResponse({
        //if success will send data
        success: true,
        word,
        meaning,
        dochinhxac,
      });

    })
    .catch(error => {
      console.error('Error:', error);
      chrome.sendResponse({
        success: false,
        error,
      })
    });
}
