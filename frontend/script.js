// မြန်မာ ဗျည်း ၃၃ လုံး၊ သရုပ် နှင့် Shift စာလုံးများ အစုံအလင်
const lessonText = "က ခ ဂ ဃ င စ ဆ ဇ ဈ ည ဋ ဌ ဍ ဎ ဏ တ ထ ဒ ဓ န ပ ဖ ဗ ဘ မ ယ ရ လ ဝ သ ဟ ဠ အ ဣ ဤ ဥ ဦ ဧ ဩ ဪ ါ ာ ိ ီ ု ူ ေ ဲ ံ ့ း ္ ် ျ ြ ွ ှ"; 

const completedTextSpan = document.getElementById('completed-text');
const currentCharSpan = document.getElementById('current-char');
const upcomingTextSpan = document.getElementById('upcoming-text');
const inputField = document.getElementById('hidden-input');

let currentIndex = 0;
const charMap = {};

// Keyboard ပေါ်ရှိ ခလုတ်များအားလုံးကို မှတ်သားခြင်း
document.querySelectorAll('kbd[data-key]').forEach(kbd => {
    const key = kbd.getAttribute('data-key');
    const shiftKey = kbd.getAttribute('data-shift');
    const finger = kbd.getAttribute('data-finger');
    const hand = kbd.getAttribute('data-hand');

    // ပုံမှန်စာလုံး
    charMap[key] = { el: kbd, isShift: false, finger: finger, hand: hand };
    
    // Shift နှိပ်ရမည့် စာလုံးပါဝင်လျှင်
    if (shiftKey) {
        charMap[shiftKey] = { el: kbd, isShift: true, finger: finger, hand: hand };
    }
});

charMap[' '] = { el: document.querySelector('.space-key'), isShift: false, finger: 'thumb', hand: 'both' };

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
    // ယခင် လင်းနေသည်များကို ပိတ်မည်
    document.querySelectorAll('kbd').forEach(k => k.classList.remove('highlight'));
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('active'));

    const targetData = charMap[char];
    
    if (targetData) {
        // အဓိက နှိပ်ရမည့် ခလုတ်ကို လင်းပြမည်
        targetData.el.classList.add('highlight');

        // အကယ်၍ Shift နှိပ်ရန် လိုအပ်သော စာလုံးဖြစ်လျှင်
        if (targetData.isShift) {
            if (targetData.hand === 'left') {
                // ဘယ်လက်ဖြင့် ရိုက်ရမည်ဆိုလျှင် ညာဘက် Shift နှင့် ညာလက်သန်းကို လင်းပြမည်
                document.getElementById('right-shift').classList.add('highlight');
                document.getElementById('right-pinky').classList.add('active');
            } else {
                // ညာလက်ဖြင့် ရိုက်ရမည်ဆိုလျှင် ဘယ်ဘက် Shift နှင့် ဘယ်လက်သန်းကို လင်းပြမည်
                document.getElementById('left-shift').classList.add('highlight');
                document.getElementById('left-pinky').classList.add('active');
            }
        }

        // အဓိက နှိပ်ရမည့် လက်ချောင်းကို လင်းပြမည်
        if (targetData.finger === 'thumb') {
            document.querySelectorAll('#thumb').forEach(t => t.classList.add('active'));
        } else {
            document.getElementById(targetData.finger).classList.add('active');
        }
    }
}

inputField.addEventListener('input', (e) => {
    // ဝင်လာသမျှ အစွန်းထွက်စာလုံးကို နောက်ဆုံး Character အနေဖြင့် ယူမည်
    const typedValue = inputField.value;
    const typedChar = typedValue.charAt(typedValue.length - 1); 
    const targetChar = lessonText.charAt(currentIndex);
    
    if (typedChar === targetChar) {
        currentIndex++;
        
        if (currentIndex >= lessonText.length) {
            currentIndex = 0; 
            alert("ဂုဏ်ယူပါတယ်! မြန်မာလက်ကွက် အပြည့်အစုံ လေ့ကျင့်မှု ပြီးဆုံးပါပြီ။");
        }
        
        // Typing အတွေ့အကြုံ ချောမွေ့စေရန် Input ကို ချက်ချင်း ရှင်းမည်
        setTimeout(() => {
            inputField.value = ''; 
            updateDisplay();
        }, 50);

    } else {
        inputField.value = ''; 
    }
});

updateDisplay();
