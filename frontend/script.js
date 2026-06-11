const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

const sampleTexts = [
    "မြန်မာနိုင်ငံသည် အရှေ့တောင်အာရှတွင် တည်ရှိသည်။",
    "ကွန်ပျူတာ လက်ကွက်ကို မှန်ကန်စွာ ရိုက်တတ်ရန် အရေးကြီးပါသည်။",
    "နည်းပညာ တိုးတက်လာသည်နှင့်အမျှ ကျွန်ုပ်တို့လည်း လေ့လာနေရမည်။",
    "စာဖတ်ခြင်းသည် အသိပညာကို တိုးပွားစေသော အကောင်းဆုံး အလေ့အကျင့်ဖြစ်သည်။",
    "ကြိုးစားသူတိုင်းအတွက် အောင်မြင်မှုဆိုတာ တစ်နေ့နေ့မှာ ရောက်လာမှာပါ။"
];

let timeLeft = 60;
let timer = null;
let isTyping = false;
let currentText = "";
let previousCorrectChars = 0;
let totalTypedChars = 0;

function loadNewText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
    
    // မြန်မာစာကို မခွဲတော့ဘဲ အတိုင်းပြမည် (Unicode မပျက်စေရန်)
    textDisplay.innerText = currentText;
    
    textInput.value = '';
    textInput.classList.remove('error-input', 'correct-input');
}

function startTimer() {
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.innerText = timeLeft;
                calculateStats();
            } else {
                clearInterval(timer);
                textInput.disabled = true;
            }
        }, 1000);
    }
}

function calculateStats(currentCorrectChars = 0) {
    const timeElapsed = (60 - timeLeft) / 60; 
    const totalCorrect = previousCorrectChars + currentCorrectChars;

    if (timeElapsed > 0) {
        const wpm = Math.round((totalCorrect / 5) / timeElapsed);
        wpmDisplay.innerText = wpm > 0 ? wpm : 0;
    }

    if (totalTypedChars > 0) {
        const accuracy = Math.round((totalCorrect / totalTypedChars) * 100);
        accuracyDisplay.innerText = accuracy > 100 ? 100 : accuracy;
    }
}

textInput.addEventListener('input', (e) => {
    startTimer();
    const typedText = textInput.value;
    
    // Backspace မဟုတ်ရင် ရိုက်လိုက်တဲ့ အကြိမ်ရေကို မှတ်မည်
    if (e.inputType !== 'deleteContentBackward') {
        totalTypedChars++; 
    }

    let currentCorrectChars = 0;
    let isCorrectSoFar = true;

    // ရိုက်ထားသလောက် မှန်/မမှန် စစ်ဆေးခြင်း
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentText[i] && isCorrectSoFar) {
            currentCorrectChars++;
        } else {
            isCorrectSoFar = false;
        }
    }

    // စာကြောင်းတစ်ကြောင်းလုံး အတိအကျ မှန်သွားလျှင် နောက်တစ်ကြောင်းပြောင်းမည်
    if (typedText === currentText) {
        previousCorrectChars += currentText.length;
        calculateStats(0);
        loadNewText();
    } else if (isCorrectSoFar) {
        // မှန်နေသရွေ့ Input Box ကို အစိမ်းနုရောင်ပြမည်
        textInput.classList.remove('error-input');
        textInput.classList.add('correct-input');
        calculateStats(currentCorrectChars);
    } else {
        // တစ်လုံးမှားသွားတာနဲ့ Input Box ကို အနီနုရောင်ပြမည်
        textInput.classList.remove('correct-input');
        textInput.classList.add('error-input');
        calculateStats(currentCorrectChars);
    }
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    isTyping = false;
    previousCorrectChars = 0;
    totalTypedChars = 0;
    
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 100;
    textInput.disabled = false;
    textInput.focus();
    textInput.classList.remove('error-input', 'correct-input');
    
    loadNewText();
});

loadNewText();
