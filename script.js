// ========================================
// SHAYZ.WORLD - Jumpscare + Reveal
// ========================================

const enterScreen = document.getElementById('enter-screen');
const jumpscare = document.getElementById('jumpscare');
const mainContent = document.getElementById('main-content');

let audioContext = null;

// Create horrifying sound
function createScareSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Layer 1: Low rumble
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(50, audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.5);
    gain1.gain.setValueAtTime(0.8, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start();
    osc1.stop(audioContext.currentTime + 0.6);
    
    // Layer 2: High scream
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(800, audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
    gain2.gain.setValueAtTime(0.5, audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.start();
    osc2.stop(audioContext.currentTime + 0.5);
    
    // Layer 3: Distorted noise
    const bufferSize = audioContext.sampleRate * 0.5;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.6, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    noise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noise.start();
    noise.stop(audioContext.currentTime + 0.4);
    
    // Layer 4: Sudden impact
    const osc3 = audioContext.createOscillator();
    const gain3 = audioContext.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(150, audioContext.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.3);
    gain3.gain.setValueAtTime(1, audioContext.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    osc3.connect(gain3);
    gain3.connect(audioContext.destination);
    osc3.start();
    osc3.stop(audioContext.currentTime + 0.3);
}

// Handle enter click
function handleEnter() {
    // Hide enter screen
    enterScreen.classList.add('hidden');
    
    // Show jumpscare
    jumpscare.classList.add('active');
    
    // Play scary sound
    createScareSound();
    
    // Add screen flash effect
    document.body.style.background = '#fff';
    setTimeout(() => {
        document.body.style.background = '#000';
    }, 50);
    setTimeout(() => {
        document.body.style.background = '#ff0000';
    }, 100);
    setTimeout(() => {
        document.body.style.background = '#000';
    }, 150);
    
    // End jumpscare after delay
    setTimeout(() => {
        jumpscare.classList.remove('active');
        jumpscare.style.display = 'none';
        mainContent.classList.add('visible');
    }, 600);
}

// Event listeners
enterScreen.addEventListener('click', handleEnter);
enterScreen.addEventListener('touchstart', handleEnter, { passive: true });

// Prevent scroll
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Add random glitch effect to main content
function randomGlitch() {
    if (mainContent.classList.contains('visible')) {
        const words = document.querySelectorAll('.word');
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        randomWord.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        randomWord.style.opacity = Math.random() * 0.5 + 0.5;
        
        setTimeout(() => {
            randomWord.style.transform = 'none';
            randomWord.style.opacity = 1;
        }, 100);
    }
    
    setTimeout(randomGlitch, Math.random() * 3000 + 2000);
}

// Start random glitches after content shows
setTimeout(randomGlitch, 3000);

// Subtle cursor effect on mobile (vibrate if supported)
if (navigator.vibrate) {
    enterScreen.addEventListener('touchstart', () => {
        navigator.vibrate(50);
    });
}

