const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

// Professional စာပိုဒ်များ (စကားလုံးများကို Space ဖြင့် သေချာခွဲထားသည်)
const sampleParagraphs = [
    "မြန်မာနိုင်ငံ သည် အရှေ့တောင် အာရှ တွင် တည်ရှိ သော နိုင်ငံ တစ်ခု ဖြစ်သည် ။ ကွန်ပျူတာ နည်းပညာ များ သည် ယနေ့ ခေတ် တွင် အလွန် အရေးပါ လာပြီ ဖြစ်သည် ။",
    "ကြိုးစားမှု သည် အောင်မြင်ခြင်း ရဲ့ သော့ချက် ဖြစ်သည် ။ အချိန် ကို တန်ဖိုး ထားပြီး မိမိ ရဲ့ အရည်အချင်း ကို အမြဲတမ်း မြှင့်တင် နေသင့် သည် ။",
    "ခေတ်မီ နည်းပညာ များ ကို အကျွမ်းတဝင် ရှိစေရန် အတွက် စာရိုက် အမြန်နှုန်း သည် လည်း မရှိမဖြစ် လိုအပ် သော ကျွမ်းကျင်မှု တစ်ခု ဖြစ်လာ သည် ။"
];

let timeLeft = 60;
let timer = null;
let isTyping = false;
let wordsArray = [];
let wordElements = [];
let currentWordIndex = 0;
let correctWordsCount = 0;
let totalKeystrokes = 0;
let correctKeystrokes = 0;

// စာပိုဒ်အသစ် ပြင်ဆင်ခြင်း
function initGame() {
    const randomPara = sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)];
    wordsArray = randomPara.split(" "); // Space ဖြင့် စကားလုံးများ ခွဲထုတ်ခြင်း
    
    textDisplay.innerHTML = '';
    wordElements = [];

    // စကားလုံး တစ်လုံးချင်းစီကို Span ထဲထည့်ပြခြင်း
    wordsArray.forEach((word, index) => {
        const span = document.createElement('span');
        span.classList.add('word');
        span.innerText = word;
        textDisplay.appendChild(span);
        wordElements.push(span);
    });

    currentWordIndex = 0;
    wordElements[currentWordIndex].classList.add('active'); // ပထမဆုံး စကားလုံးကို Active လုပ်ထားမည်
    
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
}

function startTimer() {
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.innerText = timeLeft;
                calculateWPM();
            } else {
                endGame();
            }
        }, 1000);
    }
}

function calculateWPM() {
    const timeElapsed = (60 - timeLeft) / 60; // မိနစ်
    if (timeElapsed > 0) {
        // Professional WPM တွက်နည်း: (စုစုပေါင်း မှန်ကန်သော Keystrokes / ၅) / ကြာချိန်
        const wpm = Math.round((correctKeystrokes / 5) / timeElapsed);
        wpmDisplay.innerText = wpm > 0 ? wpm : 0;
    }

    if (totalKeystrokes > 0) {
        const accuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
        accuracyDisplay.innerText = accuracy + '%';
    }
}

function endGame() {
    clearInterval(timer);
    textInput.disabled = true;
    textInput.value = 'အချိန်ပြည့်သွားပါပြီ...';
}

// User စာရိုက်သည့်အခါ အလုပ်လုပ်မည့် Logic
textInput.addEventListener('input', (e) => {
    startTimer();
    const currentWord = wordsArray[currentWordIndex];
    const typedValue = textInput.value;

    // Space bar နှိပ်လိုက်လျှင် (စကားလုံး တစ်လုံးပြီးသွားပြီဟု သတ်မှတ်မည်)
    if (typedValue.endsWith(' ')) {
        const typedWord = typedValue.trim();
        totalKeystrokes += typedWord.length + 1; // Space ပါ ထည့်တွက်သည်

        if (typedWord === currentWord) {
            wordElements[currentWordIndex].classList.replace('active', 'correct');
            correctWordsCount++;
            correctKeystrokes += currentWord.length + 1;
        } else {
            wordElements[currentWordIndex].classList.replace('active', 'incorrect');
        }

        currentWordIndex++;
        
        // စာပိုဒ် ဆုံးသွားလျှင်
        if (currentWordIndex >= wordsArray.length) {
            endGame();
            return;
        }

        // နောက်စကားလုံးသို့ ကူးမည်
        wordElements[currentWordIndex].classList.add('active');
        textInput.value = ''; // Input box ကို ရှင်းထုတ်မည်
    } else {
        // Space မနှိပ်သေးဘဲ ရိုက်နေစဉ် မှန်/မမှန် စစ်ဆေးခြင်း (Live Feedback)
        if (currentWord.startsWith(typedValue)) {
            wordElements[currentWordIndex].classList.remove('error-highlight');
        } else {
            wordElements[currentWordIndex].classList.add('error-highlight');
        }
    }
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    isTyping = false;
    correctWordsCount = 0;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = '100%';
    
    initGame();
});

// စတင်ခြင်း
initGame();
