import { useState, useRef } from 'react';
import { QrCode, Sparkles, Lightbulb, Zap, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import ContentInput from './components/ContentInput';
import StyleCustomizer from './components/StyleCustomizer';
import LogoUploader from './components/LogoUploader';
import ExportPanel from './components/ExportPanel';
import QRCodePreview from './components/QRCodePreview';

function App() {
  const qrPreviewRef = useRef(null);
  const [content, setContent] = useState('https://example.com');
  const [contentType, setContentType] = useState('url');
  
  const [style, setStyle] = useState({
    foreground: '#1e293b',
    background: '#ffffff',
    gradient: ['#6366f1', '#8b5cf6'],
    gradientEnabled: false,
    borderRadius: 0,
    errorLevel: 'M'
  });
  
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(20);
  const [logoEnabled, setLogoEnabled] = useState(false);

  const handleExport = async (format, size) => {
    if (!content) {
      alert('请先输入二维码内容');
      return false;
    }

    try {
      if (format === 'json') {
        const config = {
          content,
          contentType,
          style,
          logo: logo ? '已设置' : '未设置',
          logoSize,
          logoEnabled,
          exportSize: size,
          exportFormat: format
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-config-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
      }

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      await QRCode.toCanvas(canvas, content, {
        width: size,
        margin: 2,
        color: {
          dark: style.foreground,
          light: style.background
        },
        errorCorrectionLevel: style.errorLevel
      });

      if (style.gradientEnabled && style.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, style.gradient[0]);
        gradient.addColorStop(1, style.gradient[1]);
        
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, size, size);
        
        const gradientData = tempCtx.getImageData(0, 0, size, size).data;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
            data[i] = gradientData[i];
            data[i + 1] = gradientData[i + 1];
            data[i + 2] = gradientData[i + 2];
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      if (logo && logoEnabled) {
        const logoImg = new Image();
        logoImg.src = logo;
        
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
        });

        const logoActualSize = (size * logoSize) / 100;
        const logoX = (size - logoActualSize) / 2;
        const logoY = (size - logoActualSize) / 2;

        const padding = logoActualSize * 0.1;
        ctx.fillStyle = style.background;
        ctx.fillRect(
          logoX - padding,
          logoY - padding,
          logoActualSize + padding * 2,
          logoActualSize + padding * 2
        );

        ctx.drawImage(logoImg, logoX, logoY, logoActualSize, logoActualSize);
      }

      if (style.borderRadius > 0) {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = size;
        finalCanvas.height = size;
        const finalCtx = finalCanvas.getContext('2d');
        
        finalCtx.fillStyle = style.background;
        finalCtx.fillRect(0, 0, size, size);
        
        const radius = style.borderRadius * (size / 400);
        finalCtx.beginPath();
        finalCtx.roundRect(0, 0, size, size, radius);
        finalCtx.closePath();
        finalCtx.clip();
        
        finalCtx.drawImage(canvas, 0, 0);
        canvas.width = finalCanvas.width;
        canvas.height = finalCanvas.height;
        ctx.drawImage(finalCanvas, 0, 0);
      }

      if (format === 'png') {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-${size}x${size}-${Date.now()}.png`;
        link.click();
        return true;
      }

      if (format === 'svg') {
        const svgString = await QRCode.toString(content, {
          type: 'svg',
          width: size,
          margin: 2,
          color: {
            dark: style.foreground,
            light: style.background
          },
          errorCorrectionLevel: style.errorLevel
        });

        let modifiedSvg = svgString;
        if (style.gradientEnabled && style.gradient) {
          const gradientDef = `
            <defs>
              <linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${style.gradient[0]}" />
                <stop offset="100%" style="stop-color:${style.gradient[1]}" />
              </linearGradient>
            </defs>
          `;
          modifiedSvg = modifiedSvg.replace(
            '<svg',
            `<svg ${gradientDef}`
          );
          modifiedSvg = modifiedSvg.replace(
            new RegExp(`fill="${style.foreground.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
            'fill="url(#qrGradient)"'
          );
        }

        if (logo && logoEnabled) {
          const logoSizePx = (size * logoSize) / 100;
          const logoX = (size - logoSizePx) / 2;
          const logoY = (size - logoSizePx) / 2;
          const logoPadding = logoSizePx * 0.1;
          
          const logoSvg = `
            <rect x="${logoX - logoPadding}" y="${logoY - logoPadding}" 
                  width="${logoSizePx + logoPadding * 2}" 
                  height="${logoSizePx + logoPadding * 2}" 
                  fill="${style.background}"/>
            <image x="${logoX}" y="${logoY}" width="${logoSizePx}" height="${logoSizePx}" 
                   href="${logo}"/>
          `;
          modifiedSvg = modifiedSvg.replace('</svg>', `${logoSvg}</svg>`);
        }

        if (style.borderRadius > 0) {
          const radius = style.borderRadius * (size / 400);
          modifiedSvg = modifiedSvg.replace(
            '<svg',
            `<svg style="border-radius: ${radius}px; overflow: hidden;"`
          );
        }

        const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-${size}x${size}-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
      }

      if (format === 'clipboard') {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          return true;
        } catch (err) {
          console.error('复制到剪贴板失败:', err);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
      return false;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 pointer-events-none" />
      
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl blur-md opacity-50" />
                  <div className="relative p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    高级二维码生成器
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </h1>
                  <p className="text-sm text-slate-500">创建自定义样式的专业二维码</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                  <Zap size={14} />
                  <span className="font-medium">实时预览</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                  <Lightbulb size={14} />
                  <span className="font-medium">多种样式</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <ContentInput 
                content={content} 
                setContent={setContent}
                contentType={contentType}
                setContentType={setContentType}
              />
              <LogoUploader
                logo={logo}
                setLogo={setLogo}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
                logoEnabled={logoEnabled}
                setLogoEnabled={setLogoEnabled}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <StyleCustomizer 
                style={style} 
                setStyle={setStyle}
              />
              <ExportPanel 
                onExport={handleExport}
                qrCanvasRef={qrPreviewRef}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <QRCodePreview
                ref={qrPreviewRef}
                content={content}
                style={style}
                logo={logo}
                logoSize={logoSize}
                logoEnabled={logoEnabled}
              />
              
              <div className="card">
                <div className="card-header">
                  <div className="card-icon bg-amber-50">
                    <Lightbulb size={20} className="text-amber-600" />
                  </div>
                  <h3 className="card-title">使用提示</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { num: 1, text: '选择内容类型并输入要编码的信息' },
                    { num: 2, text: '自定义颜色、渐变和圆角样式' },
                    { num: 3, text: '可选：上传 Logo 并调整大小' },
                    { num: 4, text: '选择尺寸并导出为 PNG/SVG 格式' }
                  ].map((item) => (
                    <li key={item.num} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold">
                        {item.num}
                      </span>
                      <span className="text-sm text-slate-600 pt-0.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 py-8 bg-white/60 backdrop-blur-xl border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <QrCode size={16} className="text-indigo-500" />
                <span>高级二维码生成器</span>
                <span className="text-slate-300">|</span>
                <span>支持渐变、Logo、自定义尺寸导出</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="#" 
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>更多功能</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
