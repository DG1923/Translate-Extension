let words = [];
let currentIndex = 0;

class word{
  id;
  word;
  meaning;
  interval;
  repitation;
  easyFactor;
  nextReviewDate;
  constructor({id,word, meaning, interval, repitation, easyFactor, nextReviewDate}) {
    this.id = id;
    this.word = word;
    this.meaning = meaning;
    this.interval = interval;
    this.repitation = repitation;
    this.easyFactor = easyFactor;
    this.nextReviewDate = new Date(nextReviewDate).toISOString().split('T')[0];
  }
}

document.querySelector('.card').addEventListener('click', function() {
  this.classList.toggle('active');
});
function applySmAlgorithm(quality) {
  const word = words[currentIndex];
  
  if (quality >= 3) {
    if (word.repitation === 0) {
      word.interval = 1;
    } else if (word.repitation === 1) {
      word.interval = 6;
    } else {
      word.interval = Math.round(word.interval * word.easeFactor);
    }
    word.repitation++;
  } else {
    word.repitation = 0;
    word.interval = 1;
  }
  
  word.easeFactor = word.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (word.easeFactor < 1.3) word.easeFactor = 1.3;
  
  const now = new Date();
  word.nextReviewDate = new Date(now.getTime() + word.interval * 24 * 60 * 60 * 1000);//because time is in milliseconds so we need to convert to day
  word.nextReviewDate = word.nextReviewDate.toISOString().split('T')[0];
  chrome.runtime.sendMessage({
    action:"updateData",
    id:word.id,
    interval:word.interval,
    repitation:word.repitation,
    easyFactor:word.easyFactor,
    nextReviewDate:word.nextReviewDate}, 
      function(response) {
          if(response.success){
            console.log("Update thanh cong !!!");
          }
  });
}
function loadWords() {
 try{
  chrome.runtime.sendMessage({action:"readData"}, function(response) {
    if(response.success){
      let current_date = new Date().toISOString().split('T')[0];
      words = Object.entries(response.data).map(([key, value]) => (
        new word({
          id: value.id,
          word: value.word,
          meaning: value.meaning,
          interval: value.interval||0,
          repitation: value.repitation||0,
          easyFactor: Number(value.easyFactor)||2.5,
          nextReviewDate: value.nextReviewDate||Date.now(),
        })
      )).filter(word => word.nextReviewDate <= current_date);
      showWord();
    } else {
      console.error('Không thể tải dữ liệu từ Firebase');
    }
  });
 } catch (error) {
  console.error("update error:",error);
 }

}

function showWord() {
  if (currentIndex < words.length) {
    document.getElementById('word').textContent = words[currentIndex].word +" "+words[currentIndex].nextReviewDate;
    document.getElementById('meaning').textContent = words[currentIndex].meaning;
    document.querySelector('.card').classList.remove('active');
  } else {
    document.getElementById('word').textContent = 'Đã hoàn thành!';
    document.getElementById('meaning').textContent = '';
    document.getElementById('btnEasy').style.display = 'none';
    document.getElementById('btnGood').style.display = 'none';
    document.getElementById('btnHard').style.display = 'none';
    document.getElementById('btnAgain').style.display = 'none';
  }
}
document.getElementById('btnEasy').addEventListener('click', function() {
    applySmAlgorithm(5);
    currentIndex++;
    showWord();
});
document.getElementById('btnGood').addEventListener('click',function(){
  applySmAlgorithm(4);
  currentIndex++;
  showWord();
});
document.getElementById('btnHard').addEventListener('click', function(){
  applySmAlgorithm(3);
  currentIndex++;
  showWord();
});
document.getElementById('btnAgain').addEventListener('click', function(){
  applySmAlgorithm(0);
  currentIndex++;
  showWord();
});

loadWords();