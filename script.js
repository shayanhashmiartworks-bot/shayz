// ========================================
// SHAYZ.WORLD - Surreal Jumpscare Logic
// ========================================

const enterScreen = document.getElementById('enter-screen');
const jumpscare = document.getElementById('jumpscare');
const mainContent = document.getElementById('main-content');
const canvas = document.getElementById('scare-canvas');
const ctx = canvas.getContext('2d');

let audioCtx = null;

// Initialize Canvas for Jumpscare
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', initCanvas);
initCanvas();

// Draw Nightmare Face on Canvas
function drawScare(t) {
    if (!jumpscare.classList.contains('active')) return;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Glitchy distorted eyes
    const eyeSpread = canvas.width * 0.15;
    const eyeSize = canvas.width * 0.1 + Math.random() * 50;
    
    ctx.fillStyle = '#fff';
    // Left eye
    ctx.beginPath();
    ctx.ellipse(centerX - eyeSpread + Math.random()*20, centerY - 100, eyeSize, eyeSize * 1.5, Math.random(), 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.ellipse(centerX + eyeSpread - Math.random()*20, centerY - 100, eyeSize, eyeSize * 1.5, Math.random(), 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY + 100);
    ctx.quadraticCurveTo(centerX, centerY + 400 + Math.random()*100, centerX + 200, centerY + 100);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    
    // Random noise lines
    for(let i=0; i<10; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.strokeStyle = `rgba(255,255,255,${Math.random()})`;
        ctx.stroke();
    }
    
    requestAnimationFrame(drawScare);
}

// Intense Glitch Sound
function playScream() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const duration = 0.8;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    masterGain.connect(audioCtx.destination);

    // Deep rumble
    const rumble = audioCtx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(40, audioCtx.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + duration);
    rumble.connect(masterGain);
    rumble.start();
    rumble.stop(audioCtx.currentTime + duration);

    // High frequency noise scream
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
        output[i] = (Math.random() * 2 - 1) * (1 - i/output.length);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    noise.connect(filter);
    filter.connect(masterGain);
    noise.start();
}

// Execution
enterScreen.addEventListener('click', () => {
    enterScreen.style.opacity = '0';
    setTimeout(() => {
        enterScreen.style.display = 'none';
        
        // Activate Jumpscare
        jumpscare.classList.add('active');
        playScream();
        requestAnimationFrame(drawScare);
        
        // Vibrate if mobile
        if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

        // End Scare
        setTimeout(() => {
            jumpscare.classList.remove('active');
            mainContent.classList.add('visible');
        }, 800);
    }, 500);
});

// Subtle background shift for surreal feel
document.addEventListener('mousemove', (e) => {
    if (mainContent.classList.contains('visible')) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        document.querySelector('.reveal-container').style.transform = `translate(${x}px, ${y}px)`;
    }
});
