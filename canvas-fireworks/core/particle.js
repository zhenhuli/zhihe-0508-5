import { drawGlowingCircle } from './canvas.js';
import { getConfig, getEffectiveParticleSize } from '../config.js';

export class Particle {
    constructor(x, y, color, angle, speed) {
        const config = getConfig();
        
        this.x = x;
        this.y = y;
        this.color = color;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.gravity = config.particle.gravity;
        this.friction = config.particle.friction;
        
        this.life = config.particle.life;
        this.decay = config.particle.decay * (0.5 + Math.random() * 0.5);
        this.alpha = config.particle.alpha;
        
        this.size = getEffectiveParticleSize() * (0.5 + Math.random() * 0.5);
        this.baseSize = this.size;
        
        this.brightness = 0.5 + Math.random() * 0.5;
    }
    
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.life -= this.decay;
        this.alpha = this.life;
        
        if (this.alpha < 0) this.alpha = 0;
        
        this.size = this.baseSize * this.alpha;
    }
    
    draw() {
        if (this.alpha <= 0.01) return;
        
        drawGlowingCircle(
            this.x,
            this.y,
            this.size,
            this.color,
            this.alpha * this.brightness
        );
    }
    
    isDead() {
        return this.life <= 0;
    }
}

export function createExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
        const angle = angleStep * i + (Math.random() * 0.2 - 0.1);
        const particleSpeed = speed * (0.5 + Math.random() * 0.8);
        particles.push(new Particle(x, y, color, angle, particleSpeed));
    }
    
    return particles;
}

export function createMulticolorExplosionParticles(x, y, colors, count, speed) {
    const particles = [];
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
        const angle = angleStep * i + (Math.random() * 0.2 - 0.1);
        const particleSpeed = speed * (0.5 + Math.random() * 0.8);
        const particleColor = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, particleColor, angle, particleSpeed));
    }
    
    return particles;
}

export function createRainbowExplosionParticles(x, y, baseColor, count, speed) {
    const particles = [];
    const angleStep = (Math.PI * 2) / count;
    
    const baseHsl = hexToHsl(baseColor);
    
    for (let i = 0; i < count; i++) {
        const angle = angleStep * i + (Math.random() * 0.2 - 0.1);
        const particleSpeed = speed * (0.5 + Math.random() * 0.8);
        
        const hueVariation = (i / count) * 120 + (Math.random() * 60 - 30);
        const hue = (baseHsl.h + hueVariation) % 360;
        const particleColor = hslToHex(hue, Math.max(50, baseHsl.s), baseHsl.l);
        
        particles.push(new Particle(x, y, particleColor, angle, particleSpeed));
    }
    
    return particles;
}

function hexToHsl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return { h: 0, s: 100, l: 50 };
    }
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function createRingExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
        const angle = angleStep * i;
        const particleSpeed = speed;
        particles.push(new Particle(x, y, color, angle, particleSpeed));
    }
    
    return particles;
}

export function createStarExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    const points = 5;
    const outerRadius = speed;
    const innerRadius = speed * 0.4;
    
    const pointsPerPoint = Math.ceil(count / (points * 2));
    
    for (let p = 0; p < points; p++) {
        const baseAngle = (Math.PI * 2 / points) * p - Math.PI / 2;
        
        for (let i = 0; i < pointsPerPoint; i++) {
            const progress = i / pointsPerPoint;
            const currentRadius = innerRadius + (outerRadius - innerRadius) * progress;
            const spreadAngle = baseAngle + (Math.random() * 0.2 - 0.1);
            
            particles.push(new Particle(x, y, color, spreadAngle, currentRadius));
        }
        
        const innerAngle = baseAngle + Math.PI / points;
        for (let i = 0; i < pointsPerPoint; i++) {
            const progress = i / pointsPerPoint;
            const currentRadius = innerRadius * (0.5 + progress * 0.5);
            const spreadAngle = innerAngle + (Math.random() * 0.15 - 0.075);
            
            particles.push(new Particle(x, y, color, spreadAngle, currentRadius));
        }
    }
    
    return particles;
}

export function createHeartExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const scale = speed * 0.8;
        
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        const angle = Math.atan2(heartY, heartX);
        const particleSpeed = Math.sqrt(heartX * heartX + heartY * heartY) / 16 * scale;
        
        particles.push(new Particle(x, y, color, angle, particleSpeed));
    }
    
    return particles;
}

export function createWaterfallExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
        const angle = Math.PI / 2 + (Math.random() * 0.8 - 0.4);
        const particleSpeed = speed * (0.3 + Math.random() * 0.7);
        
        const particle = new Particle(x, y, color, angle, particleSpeed);
        particle.gravity *= 1.5;
        particle.friction = 0.99;
        particles.push(particle);
    }
    
    return particles;
}

export function createSpiralExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    const spirals = 3;
    const particlesPerSpiral = Math.ceil(count / spirals);
    
    for (let s = 0; s < spirals; s++) {
        const spiralOffset = (Math.PI * 2 / spirals) * s;
        
        for (let i = 0; i < particlesPerSpiral; i++) {
            const progress = i / particlesPerSpiral;
            const angle = spiralOffset + progress * Math.PI * 4;
            const particleSpeed = speed * (0.3 + progress * 0.7);
            
            particles.push(new Particle(x, y, color, angle, particleSpeed));
        }
    }
    
    return particles;
}

export function createDoubleRingExplosionParticles(x, y, color, count, speed) {
    const particles = [];
    const innerCount = Math.ceil(count * 0.4);
    const outerCount = count - innerCount;
    
    const innerAngleStep = (Math.PI * 2) / innerCount;
    for (let i = 0; i < innerCount; i++) {
        const angle = innerAngleStep * i;
        particles.push(new Particle(x, y, color, angle, speed * 0.5));
    }
    
    const outerAngleStep = (Math.PI * 2) / outerCount;
    for (let i = 0; i < outerCount; i++) {
        const angle = outerAngleStep * i + (Math.PI / outerCount);
        particles.push(new Particle(x, y, color, angle, speed));
    }
    
    return particles;
}

export function createMulticolorRingExplosionParticles(x, y, colors, count, speed) {
    const particles = [];
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
        const angle = angleStep * i;
        const particleSpeed = speed;
        const particleColor = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, particleColor, angle, particleSpeed));
    }
    
    return particles;
}

export function createMulticolorStarExplosionParticles(x, y, colors, count, speed) {
    const particles = createStarExplosionParticles(x, y, colors[0], count, speed);
    return particles.map(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        return p;
    });
}

export function createMulticolorHeartExplosionParticles(x, y, colors, count, speed) {
    const particles = createHeartExplosionParticles(x, y, colors[0], count, speed);
    return particles.map(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        return p;
    });
}

export function createMulticolorWaterfallExplosionParticles(x, y, colors, count, speed) {
    const particles = createWaterfallExplosionParticles(x, y, colors[0], count, speed);
    return particles.map(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        return p;
    });
}

export function createMulticolorSpiralExplosionParticles(x, y, colors, count, speed) {
    const particles = createSpiralExplosionParticles(x, y, colors[0], count, speed);
    return particles.map(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        return p;
    });
}

export function createMulticolorDoubleRingExplosionParticles(x, y, colors, count, speed) {
    const particles = createDoubleRingExplosionParticles(x, y, colors[0], count, speed);
    return particles.map(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        return p;
    });
}
