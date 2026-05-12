export class Controls {
    constructor(onChange) {
        this.onChange = onChange;
        this.isNightMode = false;
        this.initElements();
        this.bindEvents();
    }
    
    initElements() {
        this.densitySlider = document.getElementById('density');
        this.speedSlider = document.getElementById('speed');
        this.opacitySlider = document.getElementById('opacity');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.densityValue = document.getElementById('densityValue');
        this.speedValue = document.getElementById('speedValue');
        this.opacityValue = document.getElementById('opacityValue');
    }
    
    bindEvents() {
        this.densitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.densityValue.textContent = value;
            this.notifyChange({ density: value });
        });
        
        this.speedSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.speedValue.textContent = value;
            this.notifyChange({ speed: value });
        });
        
        this.opacitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.opacityValue.textContent = value;
            this.notifyChange({ opacity: value });
        });
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.isNightMode = !this.isNightMode;
        
        if (this.isNightMode) {
            document.body.classList.remove('day-mode');
            document.body.classList.add('night-mode');
            this.themeToggle.textContent = '☀️ 切换白天模式';
        } else {
            document.body.classList.remove('night-mode');
            document.body.classList.add('day-mode');
            this.themeToggle.textContent = '🌙 切换黑夜模式';
        }
        
        this.notifyChange({ isNightMode: this.isNightMode });
    }
    
    notifyChange(config) {
        if (this.onChange) {
            this.onChange(config);
        }
    }
    
    getConfig() {
        return {
            density: parseInt(this.densitySlider.value),
            speed: parseInt(this.speedSlider.value),
            opacity: parseFloat(this.opacitySlider.value),
            isNightMode: this.isNightMode
        };
    }
}