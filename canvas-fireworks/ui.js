import { updateUserConfig, getUserConfig } from './config.js';

export function initUI() {
    setupControlPanel();
    setupColorControls();
    setupSliderControls();
    setupCheckboxControls();
    setupButtons();
}

function setupControlPanel() {
    const toggleBtn = document.getElementById('toggle-panel');
    const panel = document.querySelector('.control-panel');
    
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        toggleBtn.textContent = panel.classList.contains('collapsed') ? '展开' : '收起';
    });
}

function setupColorControls() {
    const colorPicker = document.getElementById('color-picker');
    const colorPresets = document.querySelectorAll('.color-preset');
    
    colorPicker.addEventListener('input', (e) => {
        updateUserConfig('color', e.target.value);
        updateUserConfig('randomColor', false);
        updateActiveColorPreset(null);
    });
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            
            if (color === 'random') {
                updateUserConfig('randomColor', true);
            } else {
                updateUserConfig('color', color);
                updateUserConfig('randomColor', false);
                colorPicker.value = color;
            }
            
            updateActiveColorPreset(preset);
        });
    });
}

function updateActiveColorPreset(activePreset) {
    const presets = document.querySelectorAll('.color-preset');
    presets.forEach(p => p.classList.remove('active'));
    
    if (activePreset) {
        activePreset.classList.add('active');
    }
}

function setupSliderControls() {
    const particleCountSlider = document.getElementById('particle-count');
    const particleCountValue = document.getElementById('particle-count-value');
    
    particleCountSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        particleCountValue.textContent = value;
        updateUserConfig('particleCount', value);
    });
    
    const explosionSpeedSlider = document.getElementById('explosion-speed');
    const explosionSpeedValue = document.getElementById('explosion-speed-value');
    
    explosionSpeedSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        explosionSpeedValue.textContent = value;
        updateUserConfig('explosionSpeed', value);
    });
    
    const particleSizeSlider = document.getElementById('particle-size');
    const particleSizeValue = document.getElementById('particle-size-value');
    
    particleSizeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        particleSizeValue.textContent = value;
        updateUserConfig('particleSize', value);
    });
    
    const trailLengthSlider = document.getElementById('trail-length');
    const trailLengthValue = document.getElementById('trail-length-value');
    
    trailLengthSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        trailLengthValue.textContent = value;
        updateUserConfig('trailLength', value);
    });
}

function setupCheckboxControls() {
    const fullscreenMode = document.getElementById('fullscreen-mode');
    
    fullscreenMode.addEventListener('change', (e) => {
        updateUserConfig('fullscreenMode', e.target.checked);
        
        const event = new CustomEvent('fullscreenModeChange', {
            detail: { enabled: e.target.checked }
        });
        document.dispatchEvent(event);
    });
    
    const trailEffect = document.getElementById('trail-effect');
    
    trailEffect.addEventListener('change', (e) => {
        updateUserConfig('trailEffect', e.target.checked);
    });
    
    const multicolor = document.getElementById('multicolor');
    
    multicolor.addEventListener('change', (e) => {
        updateUserConfig('multicolor', e.target.checked);
    });
    
    const explosionType = document.getElementById('explosion-type');
    
    explosionType.addEventListener('change', (e) => {
        updateUserConfig('explosionType', e.target.value);
    });
}

function setupButtons() {
    const clearBtn = document.getElementById('clear-btn');
    
    clearBtn.addEventListener('click', () => {
        const event = new CustomEvent('clearCanvas');
        document.dispatchEvent(event);
    });
    
    const demoBtn = document.getElementById('demo-btn');
    
    demoBtn.addEventListener('click', () => {
        demoBtn.classList.toggle('active');
        const isActive = demoBtn.classList.contains('active');
        demoBtn.textContent = isActive ? '停止演示' : '演示模式';
        
        const event = new CustomEvent('demoModeChange', {
            detail: { enabled: isActive }
        });
        document.dispatchEvent(event);
    });
}
