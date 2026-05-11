import type { Layer } from '../types';

export class LayerManager {
  private layers: Layer[] = [];
  private currentLayerId: string = '';
  private container: HTMLDivElement | null = null;
  private width: number;
  private height: number;

  constructor(width: number, height: number, container?: HTMLDivElement) {
    this.width = width;
    this.height = height;
    this.container = container ?? null;
    this.createDefaultLayer();
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    return canvas;
  }

  private createDefaultLayer(): void {
    const layer: Layer = {
      id: 'layer-1',
      name: 'Layer 1',
      canvas: this.createCanvas(),
      visible: true,
      locked: false,
      zIndex: 1
    };
    this.layers.push(layer);
    this.currentLayerId = layer.id;
    if (this.container) {
      this.container.appendChild(layer.canvas);
    }
  }

  addLayer(name?: string): Layer {
    const newZIndex = this.layers.length + 1;
    const layer: Layer = {
      id: `layer-${Date.now()}`,
      name: name || `Layer ${newZIndex}`,
      canvas: this.createCanvas(),
      visible: true,
      locked: false,
      zIndex: newZIndex
    };
    this.layers.push(layer);
    if (this.container) {
      this.container.appendChild(layer.canvas);
    }
    return layer;
  }

  removeLayer(id: string): boolean {
    if (this.layers.length <= 1) return false;
    
    const index = this.layers.findIndex(l => l.id === id);
    if (index === -1) return false;
    
    const layer = this.layers[index];
    if (layer.canvas.parentElement) {
      layer.canvas.parentElement.removeChild(layer.canvas);
    }
    
    this.layers.splice(index, 1);
    this.updateZIndices();
    
    if (this.currentLayerId === id) {
      this.currentLayerId = this.layers[0].id;
    }
    
    return true;
  }

  private updateZIndices(): void {
    this.layers.forEach((layer, index) => {
      layer.zIndex = index + 1;
      layer.canvas.style.zIndex = String(index + 1);
    });
  }

  selectLayer(id: string): boolean {
    const layer = this.layers.find(l => l.id === id);
    if (!layer || layer.locked) return false;
    this.currentLayerId = id;
    return true;
  }

  toggleVisibility(id: string): void {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.visible = !layer.visible;
      layer.canvas.style.display = layer.visible ? 'block' : 'none';
    }
  }

  toggleLock(id: string): void {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.locked = !layer.locked;
    }
  }

  getCurrentLayer(): Layer | null {
    return this.layers.find(l => l.id === this.currentLayerId) || null;
  }

  getLayers(): Layer[] {
    return [...this.layers];
  }

  getLayerById(id: string): Layer | null {
    return this.layers.find(l => l.id === id) || null;
  }

  moveLayerUp(id: string): boolean {
    const index = this.layers.findIndex(l => l.id === id);
    if (index === -1 || index === this.layers.length - 1) return false;
    
    const temp = this.layers[index];
    this.layers[index] = this.layers[index + 1];
    this.layers[index + 1] = temp;
    
    this.updateZIndices();
    return true;
  }

  moveLayerDown(id: string): boolean {
    const index = this.layers.findIndex(l => l.id === id);
    if (index === -1 || index === 0) return false;
    
    const temp = this.layers[index];
    this.layers[index] = this.layers[index - 1];
    this.layers[index - 1] = temp;
    
    this.updateZIndices();
    return true;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    
    // 保存每个图层的图像数据
    const layerImages: { layer: Layer; imageData: ImageData | null }[] = [];
    this.layers.forEach(layer => {
      const ctx = layer.canvas.getContext('2d');
      let imageData: ImageData | null = null;
      if (ctx) {
        try {
          imageData = ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
        } catch (e) {
          imageData = null;
        }
      }
      layerImages.push({ layer, imageData });
    });
    
    // 调整大小并恢复图像数据
    layerImages.forEach(({ layer, imageData }) => {
      layer.canvas.width = width;
      layer.canvas.height = height;
      layer.canvas.style.width = '100%';
      layer.canvas.style.height = '100%';
      
      if (imageData) {
        const ctx = layer.canvas.getContext('2d');
        if (ctx) {
          try {
            ctx.putImageData(imageData, 0, 0);
          } catch (e) {
            // 忽略错误
          }
        }
      }
    });
  }

  destroy(): void {
    this.layers.forEach(layer => {
      if (layer.canvas.parentElement) {
        layer.canvas.parentElement.removeChild(layer.canvas);
      }
    });
    this.layers = [];
  }
}
