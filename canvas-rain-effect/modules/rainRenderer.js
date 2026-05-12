export class RainRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.raindrops = [];
        this.splashes = [];
        this.rock = null;
        this.config = {
            density: 100,
            speed: 8,
            opacity: 0.6,
            isNightMode: false
        };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createRock();
        });
        this.createRock();
        this.createRaindrops();
        this.animate();
    }
    
    createRock() {
        const centerX = this.canvas.width * 0.65;
        const centerY = this.canvas.height - 80;
        const baseWidth = 150;
        const baseHeight = 60;
        
        const points = [];
        const segments = 12;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radiusVariation = Math.sin(i * 2.5) * 15 + Math.cos(i * 1.8) * 10;
            const radius = (i % 2 === 0 ? baseWidth / 2 : baseWidth / 2 - 20) + radiusVariation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * (baseHeight / 2) * (1 - Math.abs(Math.cos(angle)) * 0.3);
            points.push({ x, y });
        }
        
        this.rock = {
            points: points,
            centerX: centerX,
            centerY: centerY,
            width: baseWidth,
            height: baseHeight,
            wetAreas: []
        };
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createRaindrops() {
        this.raindrops = [];
        for (let i = 0; i < this.config.density; i++) {
            this.raindrops.push(this.createRaindrop());
        }
    }
    
    createRaindrop() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * this.config.speed + this.config.speed / 2,
            opacity: Math.random() * this.config.opacity * 0.5 + this.config.opacity * 0.5
        };
    }
    
    createSplash(x, y, isOnRock = false) {
        const particles = [];
        const particleCount = isOnRock ? 
            Math.floor(Math.random() * 4) + 4 : 
            Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = isOnRock ? 
                (Math.PI / particleCount) * i + Math.PI + Math.random() * 0.5 :
                (Math.PI / particleCount) * i + Math.random() * 0.3;
            const velocity = isOnRock ? 
                Math.random() * 2.5 + 1.5 : 
                Math.random() * 2 + 1;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: -Math.sin(angle) * velocity * (isOnRock ? 0.8 : 1),
                radius: Math.random() * 1.5 + 0.5,
                opacity: this.config.opacity * 0.8,
                life: 1
            });
        }
        
        return {
            particles: particles,
            rings: isOnRock ? [] : [{
                x: x,
                y: y,
                radius: 0,
                maxRadius: Math.random() * 8 + 4,
                opacity: this.config.opacity * 0.6,
                life: 1
            }]
        };
    }
    
    isPointOnRock(x, y) {
        if (!this.rock) return false;
        
        const rock = this.rock;
        const dx = x - rock.centerX;
        const dy = y - rock.centerY;
        
        const normalizedX = dx / (rock.width / 2);
        const normalizedY = dy / (rock.height / 2);
        
        const dist = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY * 2.5);
        
        if (dist < 1 && y < this.canvas.height - 10) {
            const surfaceY = rock.centerY + Math.sin(Math.acos(Math.max(-1, Math.min(1, normalizedX)))) * (rock.height / 2) * 0.7;
            return y >= surfaceY - 5 && y <= surfaceY + 20;
        }
        
        return false;
    }
    
    getRockSurfaceY(x) {
        if (!this.rock) return this.canvas.height;
        
        const rock = this.rock;
        const dx = x - rock.centerX;
        const normalizedX = dx / (rock.width / 2);
        
        if (Math.abs(normalizedX) > 1) return this.canvas.height;
        
        return rock.centerY + Math.sin(Math.acos(Math.max(-1, Math.min(1, normalizedX)))) * (rock.height / 2) * 0.6;
    }
    
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        
        if (newConfig.density !== undefined) {
            const diff = this.config.density - this.raindrops.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    this.raindrops.push(this.createRaindrop());
                }
            } else if (diff < 0) {
                this.raindrops.splice(0, Math.abs(diff));
            }
        }
    }
    
    update() {
        this.raindrops.forEach(drop => {
            drop.y += drop.speed;
            drop.opacity = Math.random() * this.config.opacity * 0.5 + this.config.opacity * 0.5;
            
            const dropBottom = drop.y + drop.length;
            
            if (this.isPointOnRock(drop.x, dropBottom)) {
                const surfaceY = this.getRockSurfaceY(drop.x);
                this.splashes.push(this.createSplash(drop.x, surfaceY, true));
                
                if (this.rock) {
                    this.rock.wetAreas.push({
                        x: drop.x,
                        y: surfaceY,
                        radius: Math.random() * 5 + 3,
                        life: 1
                    });
                }
                
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            } else if (dropBottom > this.canvas.height) {
                this.splashes.push(this.createSplash(drop.x, this.canvas.height - 2, false));
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
        
        this.splashes = this.splashes.filter(splash => {
            let hasLivingParticles = false;
            
            splash.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.15;
                particle.life -= 0.04;
                particle.opacity = particle.life * this.config.opacity * 0.8;
                
                if (particle.life > 0) {
                    hasLivingParticles = true;
                }
            });
            
            splash.rings.forEach(ring => {
                ring.radius += 0.4;
                ring.life -= 0.03;
                ring.opacity = ring.life * this.config.opacity * 0.6;
                
                if (ring.life > 0) {
                    hasLivingParticles = true;
                }
            });
            
            return hasLivingParticles;
        });
        
        if (this.rock) {
            this.rock.wetAreas = this.rock.wetAreas.filter(area => {
                area.life -= 0.005;
                return area.life > 0;
            });
        }
    }
    
    drawRock() {
        if (!this.rock) return;
        
        const rock = this.rock;
        const ctx = this.ctx;
        
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(rock.points[0].x, rock.points[0].y);
        for (let i = 1; i < rock.points.length; i++) {
            ctx.lineTo(rock.points[i].x, rock.points[i].y);
        }
        ctx.closePath();
        
        const rockGradient = ctx.createLinearGradient(
            rock.centerX - rock.width / 2, 
            rock.centerY - rock.height / 2,
            rock.centerX + rock.width / 2,
            rock.centerY + rock.height / 2
        );
        
        if (this.config.isNightMode) {
            rockGradient.addColorStop(0, '#4a5568');
            rockGradient.addColorStop(0.5, '#2d3748');
            rockGradient.addColorStop(1, '#1a202c');
        } else {
            rockGradient.addColorStop(0, '#9ca3af');
            rockGradient.addColorStop(0.5, '#6b7280');
            rockGradient.addColorStop(1, '#4b5563');
        }
        
        ctx.fillStyle = rockGradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(rock.points[0].x, rock.points[0].y);
        for (let i = 1; i < rock.points.length; i++) {
            ctx.lineTo(rock.points[i].x, rock.points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.config.isNightMode ? '#1a202c' : '#374151';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        for (let i = 0; i < 3; i++) {
            const detailX = rock.centerX + (Math.random() - 0.5) * rock.width * 0.6;
            const detailY = rock.centerY + (Math.random() - 0.5) * rock.height * 0.4;
            ctx.beginPath();
            ctx.arc(detailX, detailY, Math.random() * 8 + 3, 0, Math.PI * 2);
            ctx.fillStyle = this.config.isNightMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(75, 85, 99, 0.4)';
            ctx.fill();
        }
        
        rock.wetAreas.forEach(area => {
            ctx.beginPath();
            ctx.ellipse(area.x, area.y, area.radius * 1.5, area.radius * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.config.isNightMode ? 
                `rgba(100, 150, 200, ${area.life * 0.4})` : 
                `rgba(70, 130, 180, ${area.life * 0.35})`;
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawRock();
        
        const rainColor = this.config.isNightMode ? 
            `rgba(150, 200, 255, ${this.config.opacity})` : 
            `rgba(100, 150, 200, ${this.config.opacity})`;
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 1);
        if (this.config.isNightMode) {
            gradient.addColorStop(0, `rgba(150, 200, 255, 0)`);
            gradient.addColorStop(1, `rgba(150, 200, 255, ${this.config.opacity})`);
        } else {
            gradient.addColorStop(0, `rgba(100, 150, 200, 0)`);
            gradient.addColorStop(1, `rgba(100, 150, 200, ${this.config.opacity})`);
        }
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        
        this.raindrops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.stroke();
        });
        
        this.splashes.forEach(splash => {
            splash.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = rainColor;
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fill();
            });
            
            splash.rings.forEach(ring => {
                this.ctx.beginPath();
                this.ctx.ellipse(ring.x, ring.y, ring.radius, ring.radius * 0.4, 0, 0, Math.PI * 2);
                this.ctx.strokeStyle = rainColor;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = ring.opacity;
                this.ctx.stroke();
            });
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}