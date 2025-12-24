// ========================================
// SHAYZ.WORLD - Chaos Experience Engine
// ========================================

const enterScreen = document.getElementById('enter-screen');
const wakeTrigger = document.getElementById('wake-trigger');
const bootLog = document.getElementById('boot-log');
const jumpscare = document.getElementById('jumpscare');
const revealScreen = document.getElementById('reveal-screen');
const mainHub = document.getElementById('main-hub');
const canvas = document.getElementById('scare-canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('custom-cursor');
const moreTrigger = document.getElementById('more-trigger');
const hubDropdown = document.getElementById('hub-dropdown');
const progressStatus = document.querySelector('.progress-status');

let audioCtx = null;
let scareInterval;

// 1. Data Stream Logic (More Fuss)
function startDataStream() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/░▒▓█";
    setInterval(() => {
        if (!enterScreen.style.display || enterScreen.style.display !== 'none') {
            const line = document.createElement('div');
            line.style.opacity = Math.random();
            let text = "";
            for (let i = 0; i < 20; i++) text += chars[Math.floor(Math.random() * chars.length)];
            line.textContent = text;
            bootLog.appendChild(line);
            if (bootLog.childNodes.length > 50) bootLog.removeChild(bootLog.firstChild);
            bootLog.scrollTop = bootLog.scrollHeight;
        }
    }, 50);

    // Progress percentage
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 3);
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressStatus.textContent = `HARVESTING_DATA: ${progress}%`;
    }, 100);
}

// 2. Audio Engine (Terror Layering)
function playTerrorSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.0;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(2.0, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    masterGain.connect(audioCtx.destination);

    // Deep Sawtooth
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(5, audioCtx.currentTime + duration);
    osc.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);

    // High Square Screech
    const screech = audioCtx.createOscillator();
    screech.type = 'square';
    screech.frequency.setValueAtTime(2000, audioCtx.currentTime);
    screech.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);
    screech.connect(masterGain);
    screech.start();
    screech.stop(audioCtx.currentTime + 0.4);

    // FM Distortion Noise
    const mod = audioCtx.createOscillator();
    mod.frequency.value = 100;
    const modGain = audioCtx.createGain();
    modGain.gain.value = 1000;
    mod.connect(modGain);
    
    const carrier = audioCtx.createOscillator();
    carrier.frequency.value = 440;
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    carrier.start();
    carrier.stop(audioCtx.currentTime + 0.3);
}

// 3. Jumpscare Rendering (Chaotic)
function drawScare() {
    if (!jumpscare.classList.contains('active')) return;
    
    // Random invert/flicker
    ctx.fillStyle = Math.random() > 0.9 ? '#fff' : '#000';
    if (Math.random() > 0.95) ctx.filter = 'invert(1)';
    else ctx.filter = 'none';
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = Math.random() * 60;
    
    // Chaos Geometry
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const r = 200 + Math.random() * 200;
        ctx.arc(cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*300, r, 0, Math.PI*2);
        ctx.stroke();
    }

    // Nightmare Eyes (Distorted)
    ctx.fillStyle = '#fff';
    const eSize = 100 + Math.random() * 150;
    ctx.beginPath();
    ctx.ellipse(cx - 150 + (Math.random()-0.5)*50, cy - 100, eSize, eSize * 2, Math.random(), 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 150 + (Math.random()-0.5)*50, cy - 100, eSize, eSize * 2, Math.random(), 0, Math.PI*2);
    ctx.fill();

    // Piercing Red Gaze
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(cx - 150, cy - 100, 30 + Math.random()*20, 0, Math.PI*2);
    ctx.arc(cx + 150, cy - 100, 30 + Math.random()*20, 0, Math.PI*2);
    ctx.fill();

    // Screaming Void
    ctx.beginPath();
    ctx.moveTo(cx - 250, cy + 200);
    ctx.lineTo(cx + 250, cy + 200);
    ctx.quadraticCurveTo(cx + (Math.random()-0.5)*100, cy + 600 + Math.random()*200, cx - 250, cy + 200);
    ctx.stroke();

    scareInterval = requestAnimationFrame(drawScare);
}

// 4. State Transitions
function triggerScare() {
    enterScreen.style.display = 'none';
    jumpscare.classList.add('active');
    jumpscare.style.display = 'flex';
    
    playTerrorSound();
    drawScare();
    if (navigator.vibrate) navigator.vibrate([200, 100, 50, 50, 300]);

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
    }, 900);
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

// Initialize Fuss
window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startDataStream();
};
