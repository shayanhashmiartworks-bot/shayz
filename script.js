// ========================================
// SHAYZ.WORLD - Core Experience Engine
// ========================================

const interactLayer = document.getElementById('interact-layer');
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

// 2. Audio Engine (Terror Layering)
function playTerrorSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const duration = 1.2;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(2.0, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    masterGain.connect(audioCtx.destination);

    // Deep Sub Rumble
    const rumble = audioCtx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(55, audioCtx.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(1, audioCtx.currentTime + duration);
    rumble.connect(masterGain);
    rumble.start();
    rumble.stop(audioCtx.currentTime + duration);

    // High Frequency Metallic Scream
    const scream = audioCtx.createOscillator();
    scream.type = 'square';
    scream.frequency.setValueAtTime(1500, audioCtx.currentTime);
    scream.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.5);
    scream.connect(masterGain);
    scream.start();
    scream.stop(audioCtx.currentTime + 0.5);

    // White Noise Distortion
    const bufferSize = audioCtx.sampleRate * duration;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i/bufferSize);
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;
    noise.connect(filter);
    filter.connect(masterGain);
    noise.start();
}

// 3. Jumpscare Rendering
function drawScare() {
    if (!jumpscare.classList.contains('active')) return;

    // Background flicker
    ctx.fillStyle = Math.random() > 0.8 ? '#fff' : '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Abstract Distorted Entity
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 + Math.random() * 50;
    
    // Core Distortions
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(cx + (Math.random()-0.5)*200, cy + (Math.random()-0.5)*200, 
                150 + Math.random()*100, 0, Math.PI*2);
        ctx.stroke();
    }

    // Nightmare Eyes
    ctx.fillStyle = '#fff';
    const eyeSize = 60 + Math.random() * 100;
    ctx.beginPath();
    ctx.ellipse(cx - 120, cy - 80, eyeSize, eyeSize * 1.5, Math.random(), 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 120, cy - 80, eyeSize, eyeSize * 1.5, Math.random(), 0, Math.PI*2);
    ctx.fill();

    // Red Gaze
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(cx - 120 + (Math.random()-0.5)*40, cy - 80, 20, 0, Math.PI*2);
    ctx.arc(cx + 120 + (Math.random()-0.5)*40, cy - 80, 20, 0, Math.PI*2);
    ctx.fill();

    // Void Mouth
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy + 180);
    ctx.lineTo(cx + 200, cy + 180);
    ctx.quadraticCurveTo(cx, cy + 400 + Math.random()*200, cx - 200, cy + 180);
    ctx.stroke();

    scareInterval = requestAnimationFrame(drawScare);
}

// 4. Experience Sequencer
function triggerExperience() {
    interactLayer.classList.add('hidden');
    
    // Flash White
    document.body.style.background = '#fff';
    
    setTimeout(() => {
        document.body.style.background = '#000';
        jumpscare.classList.add('active');
        jumpscare.style.display = 'flex';
        
        playTerrorSound();
        drawScare();
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 200, 50, 300]);

        // Transition to Reveal
        setTimeout(() => {
            jumpscare.classList.remove('active');
            jumpscare.style.display = 'none';
            cancelAnimationFrame(scareInterval);
            
            revealScreen.style.display = 'flex';
            setTimeout(() => revealScreen.classList.add('reveal-active'), 100);

            // Transition to Hub
            setTimeout(() => {
                revealScreen.style.opacity = '0';
                setTimeout(() => {
                    revealScreen.style.display = 'none';
                    mainHub.style.display = 'flex';
                    document.body.style.overflowY = 'auto';
                    document.body.classList.remove('loading');
                }, 1000);
            }, 3500);
        }, 850);
    }, 50);
}

// Initial Interaction Listener
interactLayer.addEventListener('mousedown', triggerExperience);
interactLayer.addEventListener('touchstart', triggerExperience, { passive: true });

// 5. Hub Dynamics
// Custom Cursor
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Subtle background parallax for the hub
    if (mainHub.style.display === 'flex') {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        document.querySelector('.links-container').style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Magnetic Links Effect
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

// Dropdown Logic
moreTrigger.addEventListener('click', () => {
    hubDropdown.classList.toggle('show');
    moreTrigger.querySelector('.link-sub').textContent = 
        hubDropdown.classList.contains('show') ? 'COLLAPSE NETWORK' : 'PROJECTS & SOURCE';
});

// Title Glitch Effect (Random)
const title = document.querySelector('.glitch-title');
setInterval(() => {
    if (mainHub.style.display === 'flex') {
        const intense = Math.random() > 0.95;
        title.style.textShadow = intense 
            ? `${Math.random()*15}px 0 rgba(255,0,0,0.8), ${-Math.random()*15}px 0 rgba(0,255,255,0.8)`
            : 'none';
        if (intense) setTimeout(() => title.style.textShadow = 'none', 100);
    }
}, 2000);
