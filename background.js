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
  chrome.storage.local.set({ sourceLang: 'en', targetLang: 'vi', words: [] });
  chrome.contextMenus.create({
    id: "translateWord",
    title: "Dịch '%s'",
    contexts: ["selection"]
  });
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    translateWord(request.word, request.sourceLang, request.targetLang, sendResponse);
    return true;
  }
  if (request.action === "readData") {
    readData(sendResponse);
    return true;
  }
  if (request.action === "addData") {
    addData(request.word, request.meaning, sendResponse);
    return true;
  }
  if (request.action === "updateData") {
    updateDate(request.id, request.interval, request.repitation, request.easyFactor, request.nextReviewDate, sendResponse);
    return true;
  }


});

function updateDate(id, interval, repitation, easyFactor, nextReviewDate, sendResponse) {
  const dbRef = ref(database, 'vocab/');
  sendResponse({ success: true });
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      let key_id = null;
      for (let key in data) {
        if (data[key].id === id) {
          key_id = key;
          break;
        }
      }
      if (key_id !== null) {
        update(ref(database, 'vocab/' + key_id), {
          interval: parseInt(interval),
          repitation: parseInt(repitation),
          easyFactor: parseFloat(easyFactor),
          nextReviewDate: nextReviewDate,
        }).then(() => {
          sendResponse({ success: true });
        }).catch((error) => {
          console.error("E-updateData: Update Error ", error);
          sendResponse({ success: false, error: error.message });
        });
      }
    } else {
      console.log("E-updateData: not found data !");
      sendResponse({ success: false, error: "Data not found" });
    }
  }).catch((error) => {
    console.error("E-updateData: Snapshot Error ", error);
    sendResponse({ success: false, error: error.message });
  });
}
function addData(word, meaning, sendResponse) {
  const dbRef = ref(database, 'vocab');
  const addNewWordRef = push(dbRef);
  const id = 'Giap' + addNewWordRef.key;
  set(addNewWordRef, {
    id: id,
    word: word,
    meaning: meaning,
    interval: 0,
    repitation: 0,
    easyFactor: 2.5,
    nextReviewDate: new Date(Date.now()).toISOString().split('T')[0],
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
