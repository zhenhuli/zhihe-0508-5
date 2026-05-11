import { useRef } from 'react';
import { Upload, Image, Trash2, Maximize2, Minimize2, CheckCircle, X } from 'lucide-react';

function LogoUploader({ logo, setLogo, logoSize, setLogoSize, logoEnabled, setLogoEnabled }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result);
        setLogoEnabled(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoEnabled(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizeChange = (delta) => {
    setLogoSize(prev => {
      const newSize = Math.min(50, Math.max(10, prev + delta));
      return newSize;
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon bg-purple-50">
          <Image size={20} className="text-purple-600" />
        </div>
        <h3 className="card-title">Logo 嵌入</h3>
      </div>

      <div className="space-y-4">
        {logo && logoEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border-2 border-dashed border-indigo-100">
              <div className="relative">
                <div className="absolute -inset-2 bg-white rounded-xl shadow-sm" />
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="relative max-h-24 max-w-24 object-contain"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogoEnabled(!logoEnabled)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  logoEnabled
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {logoEnabled ? (
                  <><CheckCircle size={16} /> 已启用</>
                ) : (
                  <><X size={16} /> 已禁用</>
                )}
              </button>
              
              <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                <button
                  onClick={() => handleSizeChange(-5)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                  title="缩小"
                >
                  <Minimize2 size={16} className="text-slate-500" />
                </button>
                <span className="text-sm font-medium text-slate-700 w-12 text-center">
                  {logoSize}%
                </span>
                <button
                  onClick={() => handleSizeChange(5)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                  title="放大"
                >
                  <Maximize2 size={16} className="text-slate-500" />
                </button>
              </div>
              
              <button
                onClick={handleRemoveLogo}
                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                title="移除 Logo"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-all">
              <Upload size={28} className="text-slate-400 group-hover:text-indigo-500 transition-all" />
            </div>
            <p className="text-base font-medium text-slate-600 group-hover:text-indigo-700 transition-all">点击上传 Logo</p>
            <p className="text-xs text-slate-400 mt-1">支持 PNG, JPG, SVG 格式</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {logo && !logoEnabled && (
          <div className="text-center">
            <button
              onClick={() => setLogoEnabled(true)}
              className="btn-primary w-full"
            >
              启用 Logo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoUploader;
