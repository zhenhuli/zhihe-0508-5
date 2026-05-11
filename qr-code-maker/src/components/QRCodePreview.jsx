import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCode from 'qrcode';
import { QrCode, Eye } from 'lucide-react';

const QRCodePreview = forwardRef(({ content, style, logo, logoSize, logoEnabled }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getContainer: () => containerRef.current,
    generateQRCode: async (size) => {
      return await generateQRCodeInternal(size);
    }
  }));

  const generateQRCodeInternal = async (size = 400) => {
    if (!content || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    try {
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

      return canvas;
    } catch (error) {
      console.error('二维码生成失败:', error);
      return null;
    }
  };

  useEffect(() => {
    if (content) {
      generateQRCodeInternal(400);
    }
  }, [content, style, logo, logoSize, logoEnabled]);

  return (
    <div className="card">
      <div className="card-header justify-center">
        <div className="card-icon bg-indigo-50">
          <QrCode size={20} className="text-indigo-600" />
        </div>
        <h3 className="card-title">二维码预览</h3>
      </div>
      
      <div 
        ref={containerRef}
        className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-slate-100"
        style={{ minHeight: '360px' }}
      >
        {content ? (
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-10 blur-lg" />
            <canvas
              ref={canvasRef}
              className="relative max-w-full h-auto shadow-xl"
              style={{
                borderRadius: `${style.borderRadius}px`,
                maxWidth: '280px',
                maxHeight: '280px'
              }}
            />
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="w-40 h-40 mx-auto mb-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-white/50">
              <div className="text-center">
                <QrCode size={48} className="mx-auto mb-2 text-slate-300" />
                <span className="text-xs text-slate-400">等待输入</span>
              </div>
            </div>
            <p className="text-sm">请在左侧输入内容生成二维码</p>
          </div>
        )}
      </div>

      {content && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
            <Eye size={12} />
            {style.errorLevel} 级容错
          </span>
          {style.borderRadius > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
              圆角 {style.borderRadius}px
            </span>
          )}
          {style.gradientEnabled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
              渐变效果
            </span>
          )}
          {logoEnabled && logo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
              Logo 嵌入
            </span>
          )}
        </div>
      )}
    </div>
  );
});

QRCodePreview.displayName = 'QRCodePreview';

export default QRCodePreview;
