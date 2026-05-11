import { Palette, Square, Circle } from 'lucide-react';

const presetGradients = [
  { id: 'none', label: '无渐变', colors: null },
  { id: 'blue-purple', label: '蓝紫渐变', colors: ['#3b82f6', '#8b5cf6'] },
  { id: 'pink-orange', label: '粉橙渐变', colors: ['#ec4899', '#f97316'] },
  { id: 'green-teal', label: '青绿渐变', colors: ['#10b981', '#14b8a6'] },
  { id: 'red-pink', label: '红粉渐变', colors: ['#ef4444', '#ec4899'] },
  { id: 'yellow-orange', label: '黄橙渐变', colors: ['#eab308', '#f97316'] },
];

const errorLevels = [
  { id: 'L', label: '低', desc: '7%', value: 'L' },
  { id: 'M', label: '中', desc: '15%', value: 'M' },
  { id: 'Q', label: '较高', desc: '25%', value: 'Q' },
  { id: 'H', label: '高', desc: '30%', value: 'H' },
];

function StyleCustomizer({ style, setStyle }) {
  const handleColorChange = (key, value) => {
    setStyle(prev => ({ ...prev, [key]: value }));
  };

  const handleGradientChange = (gradient) => {
    setStyle(prev => ({
      ...prev,
      gradient: gradient.colors,
      gradientEnabled: gradient.id !== 'none'
    }));
  };

  const handleBorderRadiusChange = (value) => {
    setStyle(prev => ({ ...prev, borderRadius: parseInt(value) }));
  };

  const handleErrorLevelChange = (level) => {
    setStyle(prev => ({ ...prev, errorLevel: level }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon bg-emerald-50">
          <Palette size={20} className="text-emerald-600" />
        </div>
        <h3 className="card-title">样式美化</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="section-label">前景色</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={style.foreground}
                  onChange={(e) => handleColorChange('foreground', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-200 overflow-hidden"
                  style={{ WebkitAppearance: 'none', appearance: 'none', padding: 0 }}
                />
              </div>
              <input
                type="text"
                value={style.foreground}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="flex-1 input-field py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="section-label">背景色</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={style.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-200 overflow-hidden"
                  style={{ WebkitAppearance: 'none', appearance: 'none', padding: 0 }}
                />
              </div>
              <input
                type="text"
                value={style.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1 input-field py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="section-label">渐变效果</label>
          <div className="grid grid-cols-3 gap-2">
            {presetGradients.map((gradient) => (
              <button
                key={gradient.id}
                onClick={() => handleGradientChange(gradient)}
                className={`p-2 rounded-xl text-xs font-medium transition-all ${
                  (!style.gradientEnabled && gradient.id === 'none') || 
                  (style.gradientEnabled && 
                   style.gradient?.[0] === gradient.colors?.[0] && 
                   style.gradient?.[1] === gradient.colors?.[1])
                    ? 'ring-2 ring-indigo-500 ring-offset-2 bg-white'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div 
                  className="gradient-preview"
                  style={{
                    background: gradient.colors 
                      ? `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})`
                      : style.foreground
                  }}
                />
                {gradient.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="section-label mb-0">圆角样式</label>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
              {style.borderRadius}px
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
            <Circle size={16} className="text-slate-400" />
            <input
              type="range"
              min="0"
              max="30"
              value={style.borderRadius}
              onChange={(e) => handleBorderRadiusChange(e.target.value)}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <Square size={16} className="text-slate-400" />
          </div>
        </div>

        <div>
          <label className="section-label">容错率</label>
          <div className="grid grid-cols-4 gap-2">
            {errorLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleErrorLevelChange(level.value)}
                className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                  style.errorLevel === level.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="opacity-75 text-[10px]">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleCustomizer;
