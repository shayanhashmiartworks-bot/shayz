// ========================================
// SHAYZ.WORLD - Core Logic
// ========================================

const enterScreen = document.getElementById('enter-screen');
const jumpscare = document.getElementById('jumpscare');
const revealScreen = document.getElementById('reveal-screen');
const mainHub = document.getElementById('main-hub');
const canvas = document.getElementById('scare-canvas');
const ctx = canvas.getContext('2d');
const moreTrigger = document.getElementById('more-trigger');
const hubDropdown = document.getElementById('hub-dropdown');

let audioCtx = null;
let scareInterval;

// 1. Canvas Init
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

// 2. Horrifying Audio Engine
function playTerrorSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const duration = 1.0;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    masterGain.connect(audioCtx.destination);

    // Layer A: Low End Impact
    const rumble = audioCtx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(60, audioCtx.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + duration);
    rumble.connect(masterGain);
    rumble.start();
    rumble.stop(audioCtx.currentTime + duration);

    // Layer B: Metal Screech
    const screech = audioCtx.createOscillator();
    screech.type = 'square';
    screech.frequency.setValueAtTime(1200, audioCtx.currentTime);
    screech.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.6);
    screech.connect(masterGain);
    screech.start();
    screech.stop(audioCtx.currentTime + 0.6);

    // Layer C: Static Burst
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2000;
    noise.connect(noiseFilter);
    noiseFilter.connect(masterGain);
    noise.start();
}

// 3. Jumpscare Visuals
function drawScare() {
    if (!jumpscare.classList.contains('active')) return;

    ctx.fillStyle = Math.random() > 0.9 ? '#fff' : '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Distorted Nightmare Geometry
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = Math.random() * 20;

    // Head Shape
    ctx.beginPath();
    ctx.arc(centerX + (Math.random()-0.5)*100, centerY + (Math.random()-0.5)*100, 200 + Math.random()*50, 0, Math.PI*2);
    ctx.stroke();

    // Eyes
    for(let i=0; i<2; i++) {
        const xOffset = i === 0 ? -100 : 100;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(centerX + xOffset + (Math.random()-0.5)*50, centerY - 50 + (Math.random()-0.5)*50, 
                    40 + Math.random()*60, 80 + Math.random()*100, Math.random()*Math.PI, 0, Math.PI*2);
        ctx.fill();
        
        // Red pupils
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(centerX + xOffset, centerY - 50, 10 + Math.random()*20, 0, Math.PI*2);
        ctx.fill();
    }

    // Mouth
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY + 150);
    ctx.lineTo(centerX + 150, centerY + 150);
    ctx.quadraticCurveTo(centerX, centerY + 400 + Math.random()*200, centerX - 150, centerY + 150);
    ctx.stroke();

    scareInterval = requestAnimationFrame(drawScare);
}

// 4. State Transitions
enterScreen.addEventListener('click', () => {
    // Stage 1: The Scare
    enterScreen.style.display = 'none';
    jumpscare.classList.add('active');
    jumpscare.style.display = 'flex';
    playTerrorSound();
    drawScare();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // Stage 2: The Reveal
    setTimeout(() => {
        jumpscare.classList.remove('active');
        jumpscare.style.display = 'none';
        cancelAnimationFrame(scareInterval);
        
        revealScreen.style.display = 'flex';
        setTimeout(() => revealScreen.classList.add('reveal-active'), 100);

        // Stage 3: The Hub
        setTimeout(() => {
            revealScreen.style.opacity = '0';
            setTimeout(() => {
                revealScreen.style.display = 'none';
                mainHub.style.display = 'flex';
                document.body.style.overflowY = 'auto';
            }, 1000);
        }, 3500);
    }, 800);
});

// 5. Hub Interactions
moreTrigger.addEventListener('click', () => {
    hubDropdown.classList.toggle('show');
    moreTrigger.querySelector('.link-sub').textContent = 
        hubDropdown.classList.contains('show') ? 'COLLAPSE NETWORK' : 'EXPAND THE NETWORK';
});

// 6. Glitch Title Effect
const title = document.querySelector('.glitch-title');
setInterval(() => {
    if (mainHub.style.display === 'flex') {
        title.style.textShadow = `${Math.random()*10}px 0 rgba(255,0,0,0.5), ${-Math.random()*10}px 0 rgba(0,255,255,0.5)`;
        setTimeout(() => title.style.textShadow = 'none', 50);
    }
}, 3000);
