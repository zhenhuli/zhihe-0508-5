import type { Layer } from '../types';

interface HistorySnapshot {
  layers: string[];
  currentLayerId: string;
}

export class HistoryManager {
  private history: HistorySnapshot[] = [];
  private currentIndex: number = -1;
  private maxHistory: number = 50;
  private layerManager: { getLayers: () => Layer[]; getCurrentLayerId: () => string };

  constructor(layerManager: { getLayers: () => Layer[]; getCurrentLayerId: () => string }) {
    this.layerManager = layerManager;
  }

  private saveSnapshot(): HistorySnapshot {
    const layers = this.layerManager.getLayers();
    const layerData: string[] = layers.map(layer => {
      return layer.canvas.toDataURL();
    });
    
    return {
      layers: layerData,
      currentLayerId: this.layerManager.getCurrentLayerId()
    };
  }

  push(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    this.history.push(this.saveSnapshot());
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): boolean {
    if (this.currentIndex <= 0) return false;
    
    this.currentIndex--;
    this.restoreSnapshot(this.history[this.currentIndex]);
    return true;
  }

  redo(): boolean {
    if (this.currentIndex >= this.history.length - 1) return false;
    
    this.currentIndex++;
    this.restoreSnapshot(this.history[this.currentIndex]);
    return true;
  }

  private restoreSnapshot(snapshot: HistorySnapshot): void {
    const layers = this.layerManager.getLayers();
    layers.forEach((layer, index) => {
      const img = new Image();
      img.onload = () => {
        const ctx = layer.canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = snapshot.layers[index];
    });
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistoryCount(): number {
    return this.history.length;
  }
}
