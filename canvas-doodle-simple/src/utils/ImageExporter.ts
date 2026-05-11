import type { Layer } from '../types';

export class ImageExporter {
  private layers: Layer[];
  private width: number;
  private height: number;
  private backgroundColor: string;

  constructor(layers: Layer[], width: number, height: number, backgroundColor: string = '#ffffff') {
    this.layers = layers;
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  exportAsPNG(filename: string = 'doodle.png'): void {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.width;
    exportCanvas.height = this.height;
    const ctx = exportCanvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    
    const visibleLayers = this.layers.filter(l => l.visible);
    visibleLayers.forEach(layer => {
      ctx.drawImage(layer.canvas, 0, 0);
    });
    
    this.downloadImage(exportCanvas.toDataURL('image/png'), filename);
  }

  exportAsJPG(filename: string = 'doodle.jpg', quality: number = 0.92): void {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.width;
    exportCanvas.height = this.height;
    const ctx = exportCanvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    
    const visibleLayers = this.layers.filter(l => l.visible);
    visibleLayers.forEach(layer => {
      ctx.drawImage(layer.canvas, 0, 0);
    });
    
    this.downloadImage(exportCanvas.toDataURL('image/jpeg', quality), filename);
  }

  exportAsJSON(): void {
    const layerData = this.layers.map(layer => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      locked: layer.locked,
      zIndex: layer.zIndex,
      imageData: layer.canvas.toDataURL('image/png')
    }));
    
    const projectData = {
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      layers: layerData,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    this.downloadFile(url, 'doodle.json');
    URL.revokeObjectURL(url);
  }

  private downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setLayers(layers: Layer[]): void {
    this.layers = layers;
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }
}
