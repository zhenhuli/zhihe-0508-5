const config = {
    canvasColor: 'rgba(10, 10, 20, 0.2)',
    canvasColorNoTrail: 'rgba(10, 10, 20, 1)',
    
    firework: {
        speed: 8,
        gravity: 0.15,
        targetY: 0.3,
        colors: [
            '#ff4500', '#00ff7f', '#1e90ff', '#ff69b4',
            '#ffd700', '#ff1493', '#00ffff', '#7cfc00',
            '#ffa500', '#9370db', '#ff6347', '#4169e1'
        ]
    },
    
    particle: {
        count: 80,
        speed: 5,
        gravity: 0.05,
        friction: 0.96,
        life: 1,
        decay: 0.01,
        size: 3,
        alpha: 1
    },
    
    demo: {
        interval: 800,
        fireworksPerBurst: 3,
        maxActive: 100
    },
    
    fullscreen: {
        interval: 200,
        fireworksPerBurst: 2
    }
};

export const EXPLOSION_TYPES = {
    CIRCLE: 'circle',
    RING: 'ring',
    STAR: 'star',
    HEART: 'heart',
    WATERFALL: 'waterfall',
    SPIRAL: 'spiral',
    DOUBLE_RING: 'doubleRing',
    RANDOM: 'random'
};

export const EXPLOSION_NAMES = {
    [EXPLOSION_TYPES.CIRCLE]: '🎆 圆形爆炸',
    [EXPLOSION_TYPES.RING]: '💍 环形爆炸',
    [EXPLOSION_TYPES.STAR]: '⭐ 星形爆炸',
    [EXPLOSION_TYPES.HEART]: '❤️ 心形爆炸',
    [EXPLOSION_TYPES.WATERFALL]: '💧 瀑布爆炸',
    [EXPLOSION_TYPES.SPIRAL]: '🌀 螺旋爆炸',
    [EXPLOSION_TYPES.DOUBLE_RING]: '💎 双环爆炸',
    [EXPLOSION_TYPES.RANDOM]: '🎲 随机效果'
};

let userConfig = {
    color: '#ff4500',
    particleCount: 80,
    explosionSpeed: 5,
    particleSize: 3,
    trailLength: 10,
    trailEffect: true,
    fullscreenMode: false,
    randomColor: false,
    multicolor: false,
    explosionType: EXPLOSION_TYPES.CIRCLE
};

export function getConfig() {
    return config;
}

export function getUserConfig() {
    return userConfig;
}

export function updateUserConfig(key, value) {
    userConfig[key] = value;
}

export function getEffectiveParticleCount() {
    return userConfig.particleCount;
}

export function getEffectiveExplosionSpeed() {
    return userConfig.explosionSpeed * 0.8;
}

export function getEffectiveParticleSize() {
    return userConfig.particleSize;
}

export function getEffectiveTrailAlpha() {
    const base = 0.1;
    const maxTrail = 30;
    const ratio = userConfig.trailLength / maxTrail;
    return base + (0.18 * (1 - ratio));
}

export function getRandomColor() {
    const colors = config.firework.colors;
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getFireworkColor() {
    if (userConfig.randomColor) {
        return getRandomColor();
    }
    return userConfig.color;
}

export function getRandomColorPalette(count = 4) {
    const colors = config.firework.colors;
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export function getRandomExplosionType() {
    const types = [
        EXPLOSION_TYPES.CIRCLE,
        EXPLOSION_TYPES.RING,
        EXPLOSION_TYPES.STAR,
        EXPLOSION_TYPES.HEART,
        EXPLOSION_TYPES.WATERFALL,
        EXPLOSION_TYPES.SPIRAL,
        EXPLOSION_TYPES.DOUBLE_RING
    ];
    return types[Math.floor(Math.random() * types.length)];
}

export function getEffectiveExplosionType() {
    if (userConfig.explosionType === EXPLOSION_TYPES.RANDOM) {
        return getRandomExplosionType();
    }
    return userConfig.explosionType;
}
