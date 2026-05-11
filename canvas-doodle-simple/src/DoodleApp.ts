import type { Point, BrushConfig, ToolType } from './types';
import { BrushCore } from './utils/BrushCore';
import { ShapeDrawer } from './utils/ShapeDrawer';
import { LayerManager } from './utils/LayerManager';
import { HistoryManager } from './utils/HistoryManager';
import { ImageExporter } from './utils/ImageExporter';

export class DoodleApp {
  private container: HTMLDivElement;
  private canvasContainer: HTMLDivElement;
  private toolbar: HTMLDivElement;
  private layerPanel: HTMLDivElement;
  
  private toolType: ToolType = 'brush';
  private brushConfig: BrushConfig = {
    color: '#000000',
    size: 5,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round'
  };
  
  private layerManager: LayerManager;
  private historyManager: HistoryManager;
  private imageExporter: ImageExporter;
  private brushCore: BrushCore | null = null;
  private shapeDrawer: ShapeDrawer | null = null;
  
  private isDrawing: boolean = false;
  private lastPoint: Point | null = null;
  private savedImageData: ImageData | null = null;
  
  private width: number = 800;
  private height: number = 600;
  private backgroundColor: string = '#ffffff';

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.canvasContainer = document.createElement('div');
    this.toolbar = document.createElement('div');
    this.layerPanel = document.createElement('div');
    
    // 先初始化 UI 结构（不调用 updateLayerPanel）
    this.initUIStructure();
    
    // 计算画布大小
    this.updateCanvasSize();
    
    // 初始化 layerManager 和其他工具
    this.layerManager = new LayerManager(this.width, this.height, this.canvasContainer);
    this.historyManager = new HistoryManager({
      getLayers: () => this.layerManager.getLayers(),
      getCurrentLayerId: () => this.layerManager.getCurrentLayer()?.id || ''
    });
    this.imageExporter = new ImageExporter(
      this.layerManager.getLayers(),
      this.width,
      this.height,
      this.backgroundColor
    );
    
    // 现在更新图层面板
    this.updateLayerPanel();
    
    this.setupEventListeners();
    this.setupResizeListener();
    this.historyManager.push();
  }

  private initUIStructure(): void {
    this.container.innerHTML = '';
    this.container.style.display = 'flex';
    this.container.style.height = '100vh';
    this.container.style.overflow = 'hidden';
    
    this.initToolbar();
    this.initLayerPanelStructure();
    this.initCanvasContainer();
    
    this.container.appendChild(this.toolbar);
    this.container.appendChild(this.canvasContainer);
    this.container.appendChild(this.layerPanel);
  }

  private initLayerPanelStructure(): void {
    this.layerPanel.style.width = '200px';
    this.layerPanel.style.backgroundColor = '#ecf0f1';
    this.layerPanel.style.overflowY = 'auto';
    this.layerPanel.style.padding = '10px';
    
    const header = document.createElement('h3');
    header.textContent = 'Layers';
    header.style.margin = '0 0 10px 0';
    header.style.color = '#2c3e50';
    this.layerPanel.appendChild(header);
  }

  private initToolbar(): void {
    this.toolbar.style.width = '60px';
    this.toolbar.style.backgroundColor = '#2c3e50';
    this.toolbar.style.display = 'flex';
    this.toolbar.style.flexDirection = 'column';
    this.toolbar.style.padding = '10px';
    this.toolbar.style.gap = '8px';
    this.toolbar.style.boxShadow = '2px 0 10px rgba(0,0,0,0.1)';
    
    const tools: { type: ToolType; icon: string }[] = [
      { type: 'brush', icon: '🖌️' },
      { type: 'eraser', icon: '🧹' },
      { type: 'rectangle', icon: '⬜' },
      { type: 'circle', icon: '⭕' },
      { type: 'line', icon: '📏' }
    ];
    
    tools.forEach(tool => {
      const button = this.createToolbarButton(tool.icon, () => this.setTool(tool.type));
      if (tool.type === this.toolType) {
        button.style.backgroundColor = '#3498db';
      }
      this.toolbar.appendChild(button);
    });
    
    this.toolbar.appendChild(document.createElement('hr'));
    
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = this.brushConfig.color;
    colorPicker.style.width = '100%';
    colorPicker.style.height = '40px';
    colorPicker.style.cursor = 'pointer';
    colorPicker.addEventListener('input', (e) => {
      this.brushConfig.color = (e.target as HTMLInputElement).value;
      this.updateBrushCore();
    });
    this.toolbar.appendChild(colorPicker);
    
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '50';
    sizeSlider.value = String(this.brushConfig.size);
    sizeSlider.style.width = '100%';
    sizeSlider.addEventListener('input', (e) => {
      this.brushConfig.size = Number((e.target as HTMLInputElement).value);
      this.updateBrushCore();
    });
    this.toolbar.appendChild(sizeSlider);
    
    const sizeLabel = document.createElement('span');
    sizeLabel.style.color = '#fff';
    sizeLabel.style.fontSize = '12px';
    sizeLabel.style.textAlign = 'center';
    sizeLabel.textContent = `${this.brushConfig.size}px`;
    sizeSlider.addEventListener('input', (e) => {
      sizeLabel.textContent = `${(e.target as HTMLInputElement).value}px`;
    });
    this.toolbar.appendChild(sizeLabel);
    
    this.toolbar.appendChild(document.createElement('hr'));
    
    const undoBtn = this.createToolbarButton('↩️', () => this.undo());
    this.toolbar.appendChild(undoBtn);
    
    const redoBtn = this.createToolbarButton('↪️', () => this.redo());
    this.toolbar.appendChild(redoBtn);
    
    this.toolbar.appendChild(document.createElement('hr'));
    
    const addLayerBtn = this.createToolbarButton('➕', () => this.addLayer());
    this.toolbar.appendChild(addLayerBtn);
    
    this.toolbar.appendChild(document.createElement('hr'));
    
    const exportPNGBtn = this.createToolbarButton('💾', () => this.exportPNG());
    this.toolbar.appendChild(exportPNGBtn);
    
    const exportJSONBtn = this.createToolbarButton('📄', () => this.exportJSON());
    this.toolbar.appendChild(exportJSONBtn);
  }

  private createToolbarButton(icon: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = icon;
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.backgroundColor = '#34495e';
    button.style.color = '#fff';
    button.style.fontSize = '20px';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.addEventListener('click', onClick);
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#3a506b';
    });
    button.addEventListener('mouseleave', () => {
      if (button.textContent !== '🖌️' || this.toolType !== 'brush') {
        button.style.backgroundColor = '#34495e';
      }
    });
    return button;
  }



  private updateLayerPanel(): void {
    const layers = this.layerManager.getLayers();
    this.layerPanel.innerHTML = '';
    
    const header = document.createElement('h3');
    header.textContent = 'Layers';
    header.style.margin = '0 0 10px 0';
    header.style.color = '#2c3e50';
    this.layerPanel.appendChild(header);
    
    layers.reverse().forEach(layer => {
      const layerItem = document.createElement('div');
      layerItem.style.display = 'flex';
      layerItem.style.alignItems = 'center';
      layerItem.style.gap = '8px';
      layerItem.style.padding = '5px';
      layerItem.style.borderRadius = '4px';
      layerItem.style.cursor = layer.locked ? 'not-allowed' : 'pointer';
      layerItem.style.backgroundColor = this.layerManager.getCurrentLayer()?.id === layer.id ? '#3498db' : '#fff';
      layerItem.style.color = this.layerManager.getCurrentLayer()?.id === layer.id ? '#fff' : '#2c3e50';
      
      const visibilityBtn = document.createElement('span');
      visibilityBtn.textContent = layer.visible ? '👁️' : '🙈';
      visibilityBtn.style.fontSize = '14px';
      visibilityBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.layerManager.toggleVisibility(layer.id);
        this.updateLayerPanel();
      });
      
      const lockBtn = document.createElement('span');
      lockBtn.textContent = layer.locked ? '🔒' : '🔓';
      lockBtn.style.fontSize = '14px';
      lockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.layerManager.toggleLock(layer.id);
        this.updateLayerPanel();
      });
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = layer.name;
      nameSpan.style.flex = '1';
      nameSpan.style.fontSize = '12px';
      
      const deleteBtn = document.createElement('span');
      deleteBtn.textContent = '🗑️';
      deleteBtn.style.fontSize = '14px';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.layerManager.removeLayer(layer.id);
        this.updateLayerPanel();
        this.updateBrushCore();
      });
      
      layerItem.appendChild(visibilityBtn);
      layerItem.appendChild(lockBtn);
      layerItem.appendChild(nameSpan);
      layerItem.appendChild(deleteBtn);
      
      layerItem.addEventListener('click', () => {
        if (!layer.locked) {
          this.layerManager.selectLayer(layer.id);
          this.updateLayerPanel();
          this.updateBrushCore();
        }
      });
      
      this.layerPanel.appendChild(layerItem);
    });
  }

  private initCanvasContainer(): void {
    this.canvasContainer.style.flex = '1';
    this.canvasContainer.style.position = 'relative';
    this.canvasContainer.style.backgroundColor = this.backgroundColor;
    this.canvasContainer.style.borderLeft = '1px solid #bdc3c7';
    this.canvasContainer.style.borderRight = '1px solid #bdc3c7';
  }

  private setupEventListeners(): void {
    this.canvasContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvasContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvasContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvasContainer.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    this.canvasContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvasContainer.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvasContainer.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.updateCanvasSize();
      this.layerManager.resize(this.width, this.height);
      this.imageExporter.setLayers(this.layerManager.getLayers());
    });
  }

  private updateCanvasSize(): void {
    // 获取 canvasContainer 实际可用的宽高
    const rect = this.canvasContainer.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
  }

  private getPointFromEvent(e: MouseEvent | Touch): Point {
    const rect = this.canvasContainer.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  private handleMouseDown(e: MouseEvent): void {
    const point = this.getPointFromEvent(e);
    this.startDrawing(point);
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDrawing) return;
    const point = this.getPointFromEvent(e);
    this.draw(point);
  }

  private handleMouseUp(): void {
    this.endDrawing();
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    const point = this.getPointFromEvent(touch);
    this.startDrawing(point);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isDrawing) return;
    const touch = e.touches[0];
    const point = this.getPointFromEvent(touch);
    this.draw(point);
  }

  private handleTouchEnd(): void {
    this.endDrawing();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        this.undo();
      } else if (e.key === 'y') {
        e.preventDefault();
        this.redo();
      }
    }
  }

  private startDrawing(point: Point): void {
    const currentLayer = this.layerManager.getCurrentLayer();
    if (!currentLayer || currentLayer.locked) return;
    
    this.isDrawing = true;
    this.lastPoint = point;
    
    if (this.toolType === 'brush') {
      this.brushCore?.startDrawing(point);
    } else if (this.toolType === 'eraser') {
      this.brushCore?.startErase(point);
    } else {
      // 保存当前画布状态
      const ctx = currentLayer.canvas.getContext('2d');
      if (ctx) {
        try {
          this.savedImageData = ctx.getImageData(0, 0, this.width, this.height);
        } catch (e) {
          this.savedImageData = null;
        }
      }
      this.shapeDrawer?.startShape(point);
    }
  }

  private draw(point: Point): void {
    if (!this.lastPoint) return;
    
    const currentLayer = this.layerManager.getCurrentLayer();
    if (!currentLayer || currentLayer.locked) return;
    
    if (this.toolType === 'brush') {
      this.brushCore?.draw(point);
    } else if (this.toolType === 'eraser') {
      this.brushCore?.erase(point);
    } else {
      const ctx = currentLayer.canvas.getContext('2d');
      if (ctx) {
        // 恢复之前保存的画布状态，保留之前的绘制内容
        if (this.savedImageData) {
          ctx.putImageData(this.savedImageData, 0, 0);
        } else {
          ctx.clearRect(0, 0, this.width, this.height);
          const prevLayers = this.layerManager.getLayers().filter(l => l.visible && l.zIndex < currentLayer.zIndex);
          prevLayers.forEach(layer => {
            ctx.drawImage(layer.canvas, 0, 0);
          });
        }
        
        ctx.strokeStyle = this.brushConfig.color;
        ctx.lineWidth = this.brushConfig.size;
        ctx.globalAlpha = this.brushConfig.opacity;
        
        const tempDrawer = new ShapeDrawer(ctx, this.brushConfig);
        tempDrawer.startShape(this.lastPoint);
        
        if (this.toolType === 'rectangle') {
          tempDrawer.drawRectangle(point);
        } else if (this.toolType === 'circle') {
          tempDrawer.drawCircle(point);
        } else if (this.toolType === 'line') {
          tempDrawer.drawLine(point);
        }
      }
    }
    
    this.lastPoint = point;
  }

  private endDrawing(): void {
    if (!this.isDrawing) return;
    
    if (this.toolType === 'brush') {
      this.brushCore?.endDrawing();
    } else if (this.toolType === 'eraser') {
      this.brushCore?.endErase();
    } else {
      // 图形工具绘制完成，清除保存的状态
      this.shapeDrawer?.clearPreview();
    }
    
    // 重置保存的图像数据
    this.savedImageData = null;
    
    this.historyManager.push();
    this.isDrawing = false;
    this.lastPoint = null;
  }

  private setTool(type: ToolType): void {
    this.toolType = type;
    this.updateBrushCore();
    
    const buttons = this.toolbar.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.backgroundColor = '#34495e';
    });
    
    const toolIcons: Record<ToolType, string> = {
      brush: '🖌️',
      eraser: '🧹',
      rectangle: '⬜',
      circle: '⭕',
      line: '📏'
    };
    
    buttons.forEach(btn => {
      if (btn.textContent === toolIcons[type]) {
        btn.style.backgroundColor = '#3498db';
      }
    });
  }

  private updateBrushCore(): void {
    const currentLayer = this.layerManager.getCurrentLayer();
    if (!currentLayer) return;
    
    const ctx = currentLayer.canvas.getContext('2d');
    if (!ctx) return;
    
    if (this.toolType === 'brush' || this.toolType === 'eraser') {
      if (!this.brushCore) {
        this.brushCore = new BrushCore(ctx, this.brushConfig);
      } else {
        // 切换到新的 context 并更新配置
        this.brushCore.setContext(ctx);
        this.brushCore.setConfig(this.brushConfig);
      }
    } else {
      if (!this.shapeDrawer) {
        this.shapeDrawer = new ShapeDrawer(ctx, this.brushConfig);
      } else {
        // 切换到新的 context 并更新配置
        this.shapeDrawer.setContext(ctx);
        this.shapeDrawer.setConfig(this.brushConfig);
      }
    }
  }

  private addLayer(): void {
    this.layerManager.addLayer();
    this.updateLayerPanel();
    this.updateBrushCore();
    this.historyManager.push();
  }

  private undo(): void {
    if (this.historyManager.undo()) {
      this.updateLayerPanel();
    }
  }

  private redo(): void {
    if (this.historyManager.redo()) {
      this.updateLayerPanel();
    }
  }

  private exportPNG(): void {
    this.imageExporter.setLayers(this.layerManager.getLayers());
    this.imageExporter.setBackgroundColor(this.backgroundColor);
    this.imageExporter.exportAsPNG();
  }

  private exportJSON(): void {
    this.imageExporter.setLayers(this.layerManager.getLayers());
    this.imageExporter.setBackgroundColor(this.backgroundColor);
    this.imageExporter.exportAsJSON();
  }

  destroy(): void {
    this.layerManager.destroy();
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('resize', () => {});
  }
}
