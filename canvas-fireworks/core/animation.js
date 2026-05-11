import { clearCanvas } from './canvas.js';
import { Firework } from './firework.js';
import { getConfig } from '../config.js';

let animationId = null;
let fireworks = [];
let isRunning = false;
let onFrameCallback = null;

export function startAnimation(callback = null) {
    if (isRunning) return;
    
    isRunning = true;
    onFrameCallback = callback;
    animate();
}

export function stopAnimation() {
    isRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function animate() {
    if (!isRunning) return;
    
    clearCanvas();
    
    fireworks = fireworks.filter(f => !f.isDead());
    fireworks.forEach(f => {
        f.update();
        f.draw();
    });
    
    if (onFrameCallback) {
        onFrameCallback();
    }
    
    animationId = requestAnimationFrame(animate);
}

export function addFirework(firework) {
    const config = getConfig();
    if (fireworks.length < config.demo.maxActive) {
        fireworks.push(firework);
    }
}

export function clearFireworks() {
    fireworks = [];
}

export function getFireworksCount() {
    return fireworks.length;
}
