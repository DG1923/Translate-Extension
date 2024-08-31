let words = [];
let currentIndex = 0;
const MAX_WORDS_PER_SESSION = 20;

document.querySelector('.card').addEventListener('click', function() {
  this.classList.toggle('active');
});

function loadWords() {
  const today = new Date().toISOString().split('T')[0];
  chrome.storage.sync.get(['words'], (result) => {
    if (result.words && result.words.length > 0) {
      showWord();
    } else {
      document.getElementById('word').textContent = 'Không có dữ liệu từ vựng!';
    }
  });
}

function showWord() {
  if (currentIndex < words.length) {
    document.getElementById('word').textContent = words[currentIndex].word;
    document.getElementById('meaning').textContent = words[currentIndex].meaning;
    document.querySelector('.card').classList.remove('active');
  } else {
    document.getElementById('word').textContent = 'Đã hoàn thành!';
    document.getElementById('meaning').textContent = '';
    document.getElementById('rememberBtn').style.display = 'none';
    document.getElementById('forgetBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
  }
}

function updateWord(remembered) {
  const word = words[currentIndex];
  const today = new Date();
  word.lastReviewDate = today.toISOString().split('T')[0];
  
  if (remembered) {
    word.interval = Math.round(word.interval * word.easeFactor);
    word.easeFactor = Math.max(1.3, word.easeFactor + 0.1);
  } else {
    word.interval = 1;
    word.easeFactor = Math.max(1.3, word.easeFactor - 0.2);
  }
  
  word.nextReviewDate = new Date(today.getTime() + word.interval * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  updateStorageWord(word);
  currentIndex++;
  showWord();
}

function updateStorageWord(updatedWord) {
  chrome.storage.sync.get(['words'], (result) => {
    let allWords = result.words || [];
    const index = allWords.findIndex(w => w.word === updatedWord.word);
    if (index !== -1) {
      allWords[index] = updatedWord;
    } else {
      allWords.push(updatedWord);
    }
    chrome.storage.sync.set({ words: allWords }, () => {
      console.log('Word updated in storage');
    });
  });
}

document.getElementById('rememberBtn').addEventListener('click', () => updateWord(true));
document.getElementById('forgetBtn').addEventListener('click', () => updateWord(false));
document.getElementById('nextBtn').addEventListener('click', showWord);

loadWords();