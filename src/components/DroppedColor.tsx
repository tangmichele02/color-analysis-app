import type { DraggedColor } from '../types/palette';

interface DroppedColorProps {
  droppedColor: DraggedColor;
  onRemove: (id: number) => void;
}

export function DroppedColor({ droppedColor, onRemove }: DroppedColorProps) {
  const { color, x, y, id } = droppedColor;

  return (
    <div
      className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center z-10"
      style={{
        backgroundColor: color.hex,
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 0 3px rgba(255,255,255,0.5)',
      }}
    >
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="absolute -top-2.5 -right-2.5 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold text-[#2d2420] shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 pointer-events-auto"
        aria-label={`Remove ${color.name}`}
      >
        ×
      </button>

      {/* Optional: color name tooltip */}
      <span className="absolute bottom-full mb-1 text-xs text-[#6b5d54] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {color.name}
      </span>
    </div>
  );
}
