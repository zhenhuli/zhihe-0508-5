import { initCanvas, forceClearCanvas } from './core/canvas.js';
import { Firework } from './core/firework.js';
import { startAnimation, addFirework, clearFireworks } from './core/animation.js';
import { initUI } from './ui.js';
import { getConfig, getUserConfig } from './config.js';

let demoMode = false;
let fullscreenMode = false;
let demoInterval = null;
let fullscreenInterval = null;

function init() {
    initCanvas('fireworks-canvas');
    initUI();
    setupEventListeners();
    startAnimation();
}

function setupEventListeners() {
    const canvas = document.getElementById('fireworks-canvas');
    
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    document.addEventListener('clearCanvas', handleClearCanvas);
    document.addEventListener('demoModeChange', handleDemoModeChange);
    document.addEventListener('fullscreenModeChange', handleFullscreenModeChange);
}

function handleCanvasClick(e) {
    if (!demoMode && !fullscreenMode) {
        createFireworkAtPosition(e.clientX, e.clientY);
    }
}

function handleTouchStart(e) {
    if (!demoMode && !fullscreenMode && e.touches.length > 0) {
        const touch = e.touches[0];
        createFireworkAtPosition(touch.clientX, touch.clientY);
    }
}

function createFireworkAtPosition(x, y) {
    const { height } = { height: window.innerHeight };
    const targetY = y * 0.5 + (Math.random() * 100 - 50);
    
    const firework = new Firework(x, height, x, Math.min(targetY, height * 0.7));
    addFirework(firework);
}

function handleClearCanvas() {
    clearFireworks();
    forceClearCanvas();
}

function handleDemoModeChange(e) {
    demoMode = e.detail.enabled;
    
    if (demoMode) {
        startDemoMode();
        if (fullscreenMode) {
            stopFullscreenMode();
            const checkbox = document.getElementById('fullscreen-mode');
            if (checkbox) checkbox.checked = false;
            fullscreenMode = false;
        }
    } else {
        stopDemoMode();
    }
}

function handleFullscreenModeChange(e) {
    fullscreenMode = e.detail.enabled;
    
    if (fullscreenMode) {
        startFullscreenMode();
        if (demoMode) {
            stopDemoMode();
            const demoBtn = document.getElementById('demo-btn');
            if (demoBtn) {
                demoBtn.classList.remove('active');
                demoBtn.textContent = '演示模式';
            }
            demoMode = false;
        }
    } else {
        stopFullscreenMode();
    }
}

function startDemoMode() {
    const config = getConfig();
    
    demoInterval = setInterval(() => {
        for (let i = 0; i < config.demo.fireworksPerBurst; i++) {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight * (0.1 + Math.random() * 0.5);
            
            const firework = new Firework(x, window.innerHeight, x, y);
            addFirework(firework);
        }
    }, config.demo.interval);
}

function stopDemoMode() {
    if (demoInterval) {
        clearInterval(demoInterval);
        demoInterval = null;
    }
}

function startFullscreenMode() {
    const config = getConfig();
    
    fullscreenInterval = setInterval(() => {
        for (let i = 0; i < config.fullscreen.fireworksPerBurst; i++) {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight * (0.05 + Math.random() * 0.5);
            
            const firework = new Firework(x, window.innerHeight, x, y);
            addFirework(firework);
        }
    }, config.fullscreen.interval);
}

function stopFullscreenMode() {
    if (fullscreenInterval) {
        clearInterval(fullscreenInterval);
        fullscreenInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', init);
