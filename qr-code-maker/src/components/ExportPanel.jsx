import { Download, FileImage, FileJson, Copy, Check, Ruler } from 'lucide-react';
import { useState } from 'react';

const presetSizes = [
  { id: 'small', label: '小', size: 200, desc: '200×200' },
  { id: 'medium', label: '中', size: 400, desc: '400×400' },
  { id: 'large', label: '大', size: 800, desc: '800×800' },
  { id: 'xlarge', label: '超大', size: 1200, desc: '1200×1200' },
];

function ExportPanel({ onExport, qrCanvasRef }) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [customSize, setCustomSize] = useState(500);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportAsPNG = async () => {
    const size = useCustomSize ? customSize : presetSizes.find(s => s.id === selectedSize)?.size || 400;
    if (onExport) {
      await onExport('png', size);
    }
  };

  const exportAsSVG = async () => {
    const size = useCustomSize ? customSize : presetSizes.find(s => s.id === selectedSize)?.size || 400;
    if (onExport) {
      await onExport('svg', size);
    }
  };

  const exportAsJSON = async () => {
    if (onExport) {
      await onExport('json');
    }
  };

  const copyToClipboard = async () => {
    const size = useCustomSize ? customSize : presetSizes.find(s => s.id === selectedSize)?.size || 400;
    if (onExport) {
      const success = await onExport('clipboard', size);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon bg-amber-50">
          <Download size={20} className="text-amber-600" />
        </div>
        <h3 className="card-title">尺寸导出</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="section-label flex items-center gap-2">
            <Ruler size={14} />
            导出尺寸
          </label>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetSizes.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedSize(preset.id);
                  setUseCustomSize(false);
                }}
                className={`size-preset-btn ${
                  !useCustomSize && selectedSize === preset.id
                    ? 'size-preset-btn-active'
                    : 'size-preset-btn-inactive'
                }`}
              >
                <div className="font-semibold">{preset.label}</div>
                <div className="opacity-75 text-[10px]">{preset.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseCustomSize(!useCustomSize)}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                useCustomSize 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              自定义
            </button>
            <div className="flex-1 relative">
              <input
                type="number"
                value={customSize}
                onChange={(e) => {
                  setCustomSize(Math.max(100, Math.min(3000, parseInt(e.target.value) || 100)));
                  setUseCustomSize(true);
                }}
                className="input-field py-2 text-sm"
                placeholder="自定义尺寸"
                min="100"
                max="3000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">px</span>
            </div>
          </div>
        </div>

        <div>
          <label className="section-label">导出格式</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={exportAsPNG}
              className="export-btn bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <FileImage size={16} />
              PNG
            </button>
            <button
              onClick={exportAsSVG}
              className="export-btn bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FileImage size={16} />
              SVG
            </button>
            <button
              onClick={exportAsJSON}
              className="export-btn bg-amber-500 text-white hover:bg-amber-600"
            >
              <FileJson size={16} />
              JSON
            </button>
            <button
              onClick={copyToClipboard}
              className={`export-btn ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportPanel;
