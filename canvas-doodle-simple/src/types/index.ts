export interface Point {
  x: number;
  y: number;
}

export interface BrushConfig {
  color: string;
  size: number;
  opacity: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
}

export interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface DrawAction {
  type: 'brush' | 'eraser' | 'shape';
  layerId: string;
  data: unknown;
}

export interface HistoryState {
  layers: Layer[];
  currentLayerId: string;
}

export type ToolType = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';

export interface DoodleConfig {
  width: number;
  height: number;
  backgroundColor: string;
}
