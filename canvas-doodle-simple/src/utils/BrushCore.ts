import type { Point, BrushConfig } from '../types';

export class BrushCore {
  private ctx: CanvasRenderingContext2D;
  private config: BrushConfig;
  private isDrawing: boolean = false;
  private lastPoint: Point | null = null;

  constructor(ctx: CanvasRenderingContext2D, config: BrushConfig) {
    this.ctx = ctx;
    this.config = config;
    this.setupContext();
  }

  private setupContext(): void {
    this.ctx.strokeStyle = this.config.color;
    this.ctx.lineWidth = this.config.size;
    this.ctx.globalAlpha = this.config.opacity;
    this.ctx.lineCap = this.config.lineCap;
    this.ctx.lineJoin = this.config.lineJoin;
  }

  setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.setupContext();
  }

  setConfig(config: Partial<BrushConfig>): void {
    this.config = { ...this.config, ...config };
    this.setupContext();
  }

  getConfig(): BrushConfig {
    return { ...this.config };
  }

  startDrawing(point: Point): void {
    this.isDrawing = true;
    this.lastPoint = point;
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  draw(point: Point): void {
    if (!this.isDrawing || !this.lastPoint) return;
    
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    this.lastPoint = point;
  }

  endDrawing(): void {
    this.isDrawing = false;
    this.lastPoint = null;
    this.ctx.closePath();
  }

  erase(point: Point): void {
    if (!this.lastPoint) return;
    
    const eraseSize = this.config.size;
    this.ctx.clearRect(
      point.x - eraseSize / 2,
      point.y - eraseSize / 2,
      eraseSize,
      eraseSize
    );
    this.lastPoint = point;
  }

  startErase(point: Point): void {
    this.isDrawing = true;
    this.lastPoint = point;
  }

  endErase(): void {
    this.isDrawing = false;
    this.lastPoint = null;
  }

  isDrawingState(): boolean {
    return this.isDrawing;
  }
}
