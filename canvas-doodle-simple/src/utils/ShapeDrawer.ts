import type { Point, BrushConfig } from '../types';

export class ShapeDrawer {
  private ctx: CanvasRenderingContext2D;
  private config: BrushConfig;
  private startPoint: Point | null = null;

  constructor(ctx: CanvasRenderingContext2D, config: BrushConfig) {
    this.ctx = ctx;
    this.config = config;
    this.setupContext();
  }

  private setupContext(): void {
    this.ctx.strokeStyle = this.config.color;
    this.ctx.lineWidth = this.config.size;
    this.ctx.globalAlpha = this.config.opacity;
    this.ctx.fillStyle = this.config.color;
  }

  setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.setupContext();
  }

  setConfig(config: Partial<BrushConfig>): void {
    this.config = { ...this.config, ...config };
    this.setupContext();
  }

  startShape(point: Point): void {
    this.startPoint = point;
  }

  drawRectangle(endPoint: Point): void {
    if (!this.startPoint) return;
    
    const width = endPoint.x - this.startPoint.x;
    const height = endPoint.y - this.startPoint.y;
    
    this.ctx.beginPath();
    this.ctx.strokeRect(this.startPoint.x, this.startPoint.y, width, height);
  }

  drawCircle(endPoint: Point): void {
    if (!this.startPoint) return;
    
    const radius = Math.sqrt(
      Math.pow(endPoint.x - this.startPoint.x, 2) +
      Math.pow(endPoint.y - this.startPoint.y, 2)
    );
    
    this.ctx.beginPath();
    this.ctx.arc(this.startPoint.x, this.startPoint.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  drawLine(endPoint: Point): void {
    if (!this.startPoint) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(endPoint.x, endPoint.y);
    this.ctx.stroke();
  }

  clearPreview(): void {
    this.startPoint = null;
  }

  getStartPoint(): Point | null {
    return this.startPoint;
  }
}
