import type { Color } from '../types/palette';

interface ColorSwatchProps {
  color: Color;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ColorSwatch({ color, onDragStart }: ColorSwatchProps) {
  return (
    <div
      className="group w-full aspect-square rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110 relative"
      style={{ backgroundColor: color.hex }}
      draggable
      onDragStart={onDragStart}
    >
      <span className="absolute top-1/2 right-[110%] -translate-y-1/2 text-xs text-[#6b5d54] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-md z-10 pointer-events-none">
        {color.name}
      </span>
    </div>
  );
}
