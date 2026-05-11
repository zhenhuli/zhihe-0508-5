import { drawGlowingCircle, getCanvasDimensions } from './canvas.js';
import { 
    createExplosionParticles, 
    createMulticolorExplosionParticles, 
    createRainbowExplosionParticles,
    createRingExplosionParticles,
    createStarExplosionParticles,
    createHeartExplosionParticles,
    createWaterfallExplosionParticles,
    createSpiralExplosionParticles,
    createDoubleRingExplosionParticles,
    createMulticolorRingExplosionParticles,
    createMulticolorStarExplosionParticles,
    createMulticolorHeartExplosionParticles,
    createMulticolorWaterfallExplosionParticles,
    createMulticolorSpiralExplosionParticles,
    createMulticolorDoubleRingExplosionParticles
} from './particle.js';
import { 
    getConfig, 
    getFireworkColor, 
    getEffectiveParticleCount, 
    getEffectiveExplosionSpeed, 
    getRandomColor, 
    getRandomColorPalette, 
    getUserConfig,
    getEffectiveExplosionType,
    EXPLOSION_TYPES
} from '../config.js';

const FIREWORK_COLOR_PATTERN = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function isValidColor(color) {
    return FIREWORK_COLOR_PATTERN.test(color);
}

export class Firework {
    constructor(startX, startY, targetX, targetY, color = null) {
        const config = getConfig();
        const { height } = getCanvasDimensions();
        
        this.x = startX;
        this.y = startY;
        
        this.targetX = targetX;
        this.targetY = targetY;
        
        let finalColor = color || getFireworkColor();
        if (!isValidColor(finalColor)) {
            finalColor = getRandomColor();
        }
        this.color = finalColor;
        
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * config.firework.speed;
        this.vy = (dy / distance) * config.firework.speed;
        
        this.gravity = config.firework.gravity * 0.5;
        this.exploded = false;
        this.particles = [];
        
        this.trail = [];
        this.trailLength = 5;
    }
    
    update() {
        if (!this.exploded) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }
            
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 10 || this.vy >= 0 || this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles = this.particles.filter(p => !p.isDead());
            this.particles.forEach(p => p.update());
        }
    }
    
    explode() {
        this.exploded = true;
        
        const count = getEffectiveParticleCount();
        const speed = getEffectiveExplosionSpeed();
        const userConfig = getUserConfig();
        const explosionType = getEffectiveExplosionType();
        
        const palette = userConfig.multicolor ? getRandomColorPalette(5) : [this.color];
        const useMulticolor = userConfig.multicolor;
        
        switch (explosionType) {
            case EXPLOSION_TYPES.RING:
                this.particles = useMulticolor 
                    ? createMulticolorRingExplosionParticles(this.x, this.y, palette, count, speed)
                    : createRingExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.STAR:
                this.particles = useMulticolor
                    ? createMulticolorStarExplosionParticles(this.x, this.y, palette, count, speed)
                    : createStarExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.HEART:
                this.particles = useMulticolor
                    ? createMulticolorHeartExplosionParticles(this.x, this.y, palette, count, speed)
                    : createHeartExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.WATERFALL:
                this.particles = useMulticolor
                    ? createMulticolorWaterfallExplosionParticles(this.x, this.y, palette, count, speed)
                    : createWaterfallExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.SPIRAL:
                this.particles = useMulticolor
                    ? createMulticolorSpiralExplosionParticles(this.x, this.y, palette, count, speed)
                    : createSpiralExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.DOUBLE_RING:
                this.particles = useMulticolor
                    ? createMulticolorDoubleRingExplosionParticles(this.x, this.y, palette, count, speed)
                    : createDoubleRingExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
                
            case EXPLOSION_TYPES.CIRCLE:
            default:
                this.particles = useMulticolor
                    ? createMulticolorExplosionParticles(this.x, this.y, palette, count, speed)
                    : createExplosionParticles(this.x, this.y, this.color, count, speed);
                break;
        }
    }
    
    draw() {
        if (!this.exploded) {
            this.trail.forEach((point, i) => {
                const alpha = (i + 1) / this.trail.length * 0.5;
                const size = (i + 1) / this.trail.length * 2;
                drawGlowingCircle(point.x, point.y, size, this.color, alpha);
            });
            
            drawGlowingCircle(this.x, this.y, 3, this.color, 1);
        } else {
            this.particles.forEach(p => p.draw());
        }
    }
    
    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

export function createFirework(x, y) {
    const { height } = getCanvasDimensions();
    const targetY = y * 0.3 + (Math.random() * 100 - 50);
    
    const startX = Math.random() < 0.5 
        ? 0 
        : (Math.random() < 0.5 ? (typeof window !== 'undefined' && window.innerWidth || 800) : x);
    const startY = height;
    
    return new Firework(x, startY, x, targetY);
}

export function createRandomFirework() {
    const { width, height } = getCanvasDimensions();
    
    const targetX = Math.random() * width;
    const targetY = height * (0.1 + Math.random() * 0.4);
    
    return new Firework(targetX, height, targetX, targetY);
}
