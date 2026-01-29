import type { DraggedColor } from '../types/palette';

interface DroppedColorProps {
  droppedColor: DraggedColor;
  onRemove: (id: number) => void;
}

export function DroppedColor({ droppedColor, onRemove }: DroppedColorProps) {
  return (
    <div
      key={droppedColor.id}
      className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center group"
      style={{
        backgroundColor: droppedColor.color.hex,
        left: `${droppedColor.x}%`,
        top: `${droppedColor.y}%`,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 0 3px rgba(255,255,255,0.5)'
      }}
      onClick={() => onRemove(droppedColor.id)}
      title={`${droppedColor.color.name} - Click to remove`}
    >
      <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-lg font-bold text-[#2d2420] shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        ×
      </div>
    </div>
  );
}
