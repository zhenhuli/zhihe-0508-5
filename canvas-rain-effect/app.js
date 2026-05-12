import { RainRenderer } from './modules/rainRenderer.js';
import { Controls } from './modules/controls.js';

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('day-mode');
    
    const canvas = document.getElementById('rainCanvas');
    const rainRenderer = new RainRenderer(canvas);
    
    const controls = new Controls((config) => {
        rainRenderer.updateConfig(config);
    });
    
    rainRenderer.updateConfig(controls.getConfig());
    
    console.log('🌧️ Canvas雨滴特效已启动!');
    console.log('📁 项目结构:');
    console.log('   - index.html (主页面)');
    console.log('   - style.css (样式)');
    console.log('   - app.js (入口)');
    console.log('   - modules/');
    console.log('     ├── rainRenderer.js (雨滴渲染模块)');
    console.log('     └── controls.js (参数控制模块)');
});
