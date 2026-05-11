import { getConfig, getUserConfig, getEffectiveTrailAlpha } from '../config.js';

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;

export function initCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) {
        throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get 2D context from canvas');
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return { canvas, ctx, width, height };
}

export function resizeCanvas() {
    if (!canvas) return;
    
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
}

export function getCanvasContext() {
    return ctx;
}

export function getCanvasDimensions() {
    return { width, height };
}

export function clearCanvas() {
    if (!ctx) return;
    
    const config = getConfig();
    const userConfig = getUserConfig();
    
    const alpha = userConfig.trailEffect 
        ? getEffectiveTrailAlpha() 
        : 1;
    
    const color = userConfig.trailEffect 
        ? config.canvasColor.replace('0.2', alpha.toString())
        : config.canvasColorNoTrail;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

export function forceClearCanvas() {
    if (!ctx) return;
    
    const config = getConfig();
    ctx.fillStyle = config.canvasColorNoTrail;
    ctx.fillRect(0, 0, width, height);
}

export function drawCircle(x, y, radius, color, alpha = 1) {
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRgba(color, alpha);
    ctx.fill();
}

export function drawGlowingCircle(x, y, radius, color, alpha = 1) {
    if (!ctx) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, hexToRgba(color, alpha));
    gradient.addColorStop(0.4, hexToRgba(color, alpha * 0.5));
    gradient.addColorStop(1, hexToRgba(color, 0));
    
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2, false);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRgba(color, alpha);
    ctx.fill();
    
    ctx.restore();
}

export function hexToRgba(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return `rgba(255, 69, 0, ${alpha})`;
    }
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
