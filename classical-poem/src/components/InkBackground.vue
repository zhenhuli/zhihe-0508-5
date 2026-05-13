<template>
  <div class="ink-background">
    <canvas ref="canvas" class="ink-canvas"></canvas>
    <div class="ink-overlay"></div>
  </div>
</template>

<script>
export default {
  name: 'InkBackground',
  data() {
    return {
      particles: [],
      animationId: null
    };
  },
  mounted() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    handleResize() {
      this.resizeCanvas();
    },
    createParticles() {
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 100 + 50,
          opacity: Math.random() * 0.03 + 0.01,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          growth: 0
        });
      }
    },
    drawParticle(particle) {
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius
      );
      gradient.addColorStop(0, `rgba(139, 69, 19, ${particle.opacity})`);
      gradient.addColorStop(0.5, `rgba(139, 69, 19, ${particle.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < -particle.radius) particle.x = this.canvas.width + particle.radius;
        if (particle.x > this.canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = this.canvas.height + particle.radius;
        if (particle.y > this.canvas.height + particle.radius) particle.y = -particle.radius;
        
        this.drawParticle(particle);
      });
      
      this.animationId = requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.ink-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: var(--color-bg);
}

.ink-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ink-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(139, 69, 19, 0.02) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(139, 69, 19, 0.02) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(139, 69, 19, 0.01) 0%, transparent 70%);
}
</style>
