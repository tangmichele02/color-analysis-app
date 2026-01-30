export interface Color {
  hex: string;
  name: string;
}

export interface Palette {
  name: string;
  description: string;
  colors: Color[];
}

export interface DraggedColor {
  color: Color;
  x: number;
  y: number;
  id: number;
}
