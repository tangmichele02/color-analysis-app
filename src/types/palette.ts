export interface Color {
  hex: string;
  name: string;
}

export interface Palette {
  name: string;
  description: string;
  dominantColor: string;
  colors: Color[];
}

export interface DraggedColor {
  color: Color;
  x: number;
  y: number;
  id: number;
}
