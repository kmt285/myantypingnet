// အခြေခံ လေ့ကျင့်ရန် စာကြောင်း (က-အ, Space ခြားထားသည်)
const lessonText = "က ခ ဂ ဃ င စ ဆ ဇ ဈ ည"; 

const completedTextSpan = document.getElementById('completed-text');
const currentCharSpan = document.getElementById('current-char');
const upcomingTextSpan = document.getElementById('upcoming-text');
const inputField = document.getElementById('hidden-input');

let currentIndex = 0;

function updateDisplay() {
    const completed = lessonText.substring(0, currentIndex);
    const current = lessonText.charAt(currentIndex);
    const upcoming = lessonText.substring(currentIndex + 1);

    completedTextSpan.innerText = completed;
    currentCharSpan.innerText = current === " " ? "␣" : current; // Space ဖြစ်နေလျှင် ␣ သင်္ကေတပြမည်
    upcomingTextSpan.innerText = upcoming;

    highlightKey(current);
}

// နှိပ်ရမည့် ခလုတ်ကို လင်းပြသည့် Function
function highlightKey(char) {
    // ယခင်လင်းနေသော ခလုတ်များကို ပိတ်မည်
    document.querySelectorAll('kbd').forEach(kbd => {
        kbd.classList.remove('highlight', 'correct-press', 'wrong-press');
    });

    // လက်ရှိ နှိပ်ရမည့် ခလုတ်ကို ရှာပြီး လင်းပြမည်
    const keyToHighlight = document.querySelector(`kbd[data-key="${char}"]`);
    if (keyToHighlight) {
        keyToHighlight.classList.add('highlight');
    }
}

inputField.addEventListener('input', (e) => {
    const typedChar = e.data; // နောက်ဆုံး ရိုက်ထည့်လိုက်သော စာလုံး
    const targetChar = lessonText.charAt(currentIndex);
    
    // User ရိုက်လိုက်တာက လိုချင်တဲ့ စာလုံးနဲ့ ထပ်တူကျလျှင်
    if (typedChar === targetChar) {
        const activeKey = document.querySelector(`kbd[data-key="${targetChar}"]`);
        if (activeKey) {
            activeKey.classList.add('correct-press');
        }

        currentIndex++;
        
        // သင်ခန်းစာ ပြီးသွားလျှင်
        if (currentIndex >= lessonText.length) {
            currentIndex = 0; // ပြန်စမည် (နောက်ပိုင်းတွင် Level 2 သို့ ကူးရန် ပြင်နိုင်သည်)
            alert("ဂုဏ်ယူပါတယ်! ပထမဆင့် ပြီးဆုံးသွားပါပြီ။");
        }
        
        // နောက်တစ်လုံးသို့ ကူးမည် (အချိန်ခဏလေးဆွဲပြီးမှ ကူးမည်၊ သို့မှ အစိမ်းရောင်လင်းတာကို မြင်ရမည်)
        setTimeout(() => {
            inputField.value = ''; // Input ကို ရှင်းထုတ်မည်
            updateDisplay();
        }, 150);

    } else {
        // မှားနှိပ်မိလျှင်
        const wrongKey = document.querySelector(`kbd[data-key="${typedChar}"]`);
        if (wrongKey) {
            wrongKey.classList.add('wrong-press');
            setTimeout(() => wrongKey.classList.remove('wrong-press'), 200);
        }
        inputField.value = ''; // မှားရိုက်မိတာကို ရှင်းထုတ်မည်
    }
});

// Website စတက်ချိန်တွင် ပထမဆုံးစာလုံးကို ပြင်ဆင်မည်
updateDisplay();
