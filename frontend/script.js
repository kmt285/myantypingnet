const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

// မြန်မာစာကြောင်းများ (Unicode)
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
let correctChars = 0;
let totalTypedChars = 0;

// စာကြောင်းအသစ်ထုတ်ပေးသည့် Function
function loadNewText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
    
    textDisplay.innerHTML = '';
    // စာကြောင်းကို စာလုံးတစ်လုံးချင်းစီခွဲပြီး HTML <span> ထဲထည့်မည်
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
    textInput.value = '';
}

// Timer စတင်သည့် Function
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
                textInput.disabled = true; // အချိန်ကုန်ရင် ဆက်ရိုက်လို့မရအောင် ပိတ်မည်
            }
        }, 1000);
    }
}

// WPM နှင့် Accuracy တွက်ချက်သည့် Function
function calculateStats() {
    // အချိန်မည်မျှ ကြာသွားပြီလဲ (မိနစ်ဖြင့်)
    const timeElapsed = (60 - timeLeft) / 60; 
    
    if (timeElapsed > 0) {
        // WPM = (မှန်ကန်သော စာလုံးအရေအတွက် / ၅) / ကြာချိန်(မိနစ်)
        const wpm = Math.round((correctChars / 5) / timeElapsed);
        wpmDisplay.innerText = wpm > 0 ? wpm : 0;
    }

    // မှန်ကန်မှု ရာခိုင်နှုန်း
    if (totalTypedChars > 0) {
        const accuracy = Math.round((correctChars / totalTypedChars) * 100);
        accuracyDisplay.innerText = accuracy;
    }
}

// User စာရိုက်တိုင်း အလုပ်လုပ်မည့် အပိုင်း
textInput.addEventListener('input', () => {
    startTimer();
    
    const arrayQuote = textDisplay.querySelectorAll('span');
    const arrayValue = textInput.value.split('');
    
    correctChars = 0;
    totalTypedChars = arrayValue.length;

    let allCorrect = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            // မရိုက်ရသေးသော စာလုံးများ
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            allCorrect = false;
        } else if (character === characterSpan.innerText) {
            // ရိုက်တာမှန်လျှင်
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            // ရိုက်တာမှားလျှင်
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            allCorrect = false;
        }
    });

    calculateStats();

    // စာကြောင်းတစ်ကြောင်းလုံး မှန်ကန်စွာ ရိုက်ပြီးသွားလျှင် နောက်တစ်ကြောင်း အလိုအလျောက် ပြောင်းမည်
    if (allCorrect && arrayValue.length === arrayQuote.length) {
        loadNewText();
    }
});

// ပြန်စရန် ခလုတ် နှိပ်လျှင်
restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    isTyping = false;
    correctChars = 0;
    totalTypedChars = 0;
    
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 100;
    textInput.disabled = false;
    textInput.focus();
    
    loadNewText();
});

// Website စတက်ချိန်တွင် စာကြောင်းတစ်ကြောင်း စတင်ပြသထားမည်
loadNewText();
