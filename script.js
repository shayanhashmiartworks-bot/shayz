// ========================================
// SHAYZ.WORLD - Core Experience Engine
// ========================================

const enterScreen = document.getElementById('enter-screen');
const wakeTrigger = document.getElementById('wake-trigger');
const jumpscare = document.getElementById('jumpscare');
const revealScreen = document.getElementById('reveal-screen');
const mainHub = document.getElementById('main-hub');
const canvas = document.getElementById('scare-canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('custom-cursor');
const moreTrigger = document.getElementById('more-trigger');
const hubDropdown = document.getElementById('hub-dropdown');

let audioCtx = null;
let scareInterval;

// 1. Initialize
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', init);
init();

// 2. Audio Engine
function playTerrorSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.0;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.8, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    masterGain.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + duration);
    osc.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);

    const screech = audioCtx.createOscillator();
    screech.type = 'square';
    screech.frequency.setValueAtTime(1000, audioCtx.currentTime);
    screech.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.5);
    screech.connect(masterGain);
    screech.start();
    screech.stop(audioCtx.currentTime + 0.5);
}

// 3. Jumpscare Visuals
function drawScare() {
    if (!jumpscare.classList.contains('active')) return;
    ctx.fillStyle = Math.random() > 0.85 ? '#fff' : '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = Math.random() * 40;
    
    ctx.beginPath();
    ctx.arc(cx + (Math.random()-0.5)*100, cy + (Math.random()-0.5)*100, 200 + Math.random()*100, 0, Math.PI*2);
    ctx.stroke();

    // Red eyes
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(cx - 100 + (Math.random()-0.5)*40, cy - 50, 20 + Math.random()*30, 0, Math.PI*2);
    ctx.arc(cx + 100 + (Math.random()-0.5)*40, cy - 50, 20 + Math.random()*30, 0, Math.PI*2);
    ctx.fill();

    scareInterval = requestAnimationFrame(drawScare);
}

// 4. State Transitions
function triggerScare() {
    enterScreen.style.display = 'none';
    jumpscare.classList.add('active');
    jumpscare.style.display = 'flex';
    
    playTerrorSound();
    drawScare();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    setTimeout(() => {
        jumpscare.classList.remove('active');
        jumpscare.style.display = 'none';
        cancelAnimationFrame(scareInterval);
        
        revealScreen.style.display = 'flex';
        setTimeout(() => revealScreen.classList.add('reveal-active'), 100);

        setTimeout(() => {
            revealScreen.style.opacity = '0';
            setTimeout(() => {
                revealScreen.style.display = 'none';
                mainHub.style.display = 'flex';
                document.body.style.overflowY = 'auto';
            }, 1000);
        }, 3500);
    }, 850);
}

wakeTrigger.addEventListener('click', triggerScare);
wakeTrigger.addEventListener('touchstart', triggerScare, { passive: true });

// 5. Hub Dynamics
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    if (mainHub.style.display === 'flex') {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        document.querySelector('.links-container').style.transform = `translate(${x}px, ${y}px)`;
    }
});

const magnets = document.querySelectorAll('.magnetic');
magnets.forEach(m => {
    m.addEventListener('mousemove', (e) => {
        const rect = m.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        m.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
        document.body.classList.add('cursor-hover');
    });
    m.addEventListener('mouseleave', () => {
        m.style.transform = '';
        document.body.classList.remove('cursor-hover');
    });
});

moreTrigger.addEventListener('click', () => {
    hubDropdown.classList.toggle('show');
    moreTrigger.querySelector('.link-sub').textContent = 
        hubDropdown.classList.contains('show') ? 'COLLAPSE NETWORK' : 'PROJECTS & SOURCE';
});
