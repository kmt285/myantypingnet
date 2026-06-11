// လက်ချောင်း အစုံသုံးရမည့် အခြေခံ စာလုံးများ လေ့ကျင့်ရန်
const lessonText = "က ခ င စ ဆ တ န ပ ဖ မ ယ ရ လ ဝ သ ဟ အ"; 

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
    currentCharSpan.innerText = current === " " ? "␣" : current;
    upcomingTextSpan.innerText = upcoming;

    highlightKeyAndFinger(current);
}

function highlightKeyAndFinger(char) {
    // ယခင် လင်းနေသော ကီးဘုတ်နှင့် လက်ချောင်းများကို ပိတ်မည်
    document.querySelectorAll('kbd').forEach(kbd => kbd.classList.remove('highlight'));
    document.querySelectorAll('.finger').forEach(finger => finger.classList.remove('active'));

    // လက်ရှိ နှိပ်ရမည့် ခလုတ်ကို ရှာမည်
    const keyToHighlight = document.querySelector(`kbd[data-key="${char}"]`);
    
    if (keyToHighlight) {
        // ခလုတ်ကို မီးလင်းပြမည်
        keyToHighlight.classList.add('highlight');
        
        // ထိုခလုတ်ကို နှိပ်ရမည့် လက်ချောင်းအမည်ကို ယူမည် (ဥပမာ - "left-pinky")
        const fingerId = keyToHighlight.getAttribute('data-finger');
        
        // သက်ဆိုင်ရာ လက်ချောင်းကိုပါ မီးလင်းပြမည် (Thumb ဆိုလျှင် နှစ်ဖက်လုံး လင်းပြနိုင်သည်)
        if(fingerId === "thumb") {
            document.querySelectorAll('#thumb').forEach(t => t.classList.add('active'));
        } else {
            const fingerToHighlight = document.getElementById(fingerId);
            if (fingerToHighlight) {
                fingerToHighlight.classList.add('active');
            }
        }
    }
}

inputField.addEventListener('input', (e) => {
    const typedChar = e.data; 
    const targetChar = lessonText.charAt(currentIndex);
    
    if (typedChar === targetChar) {
        currentIndex++;
        
        if (currentIndex >= lessonText.length) {
            currentIndex = 0; 
            alert("ဂုဏ်ယူပါတယ်! လက်ချောင်းစုံ လေ့ကျင့်မှု ပြီးဆုံးပါပြီ။");
        }
        
        setTimeout(() => {
            inputField.value = ''; 
            updateDisplay();
        }, 100);

    } else {
        inputField.value = ''; 
    }
});

updateDisplay();
