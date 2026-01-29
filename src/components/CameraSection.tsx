import React from 'react';
import type { DraggedColor, Color } from '../types/palette';
import { DroppedColor } from './DroppedColor';

interface CameraSectionProps {
  cameraActive: boolean;
  droppedColors: DraggedColor[];
  onDropColor: (color: Color, x: number, y: number) => void;
  removeDroppedColor: (id: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoContainerRef: React.RefObject<HTMLDivElement | null>;
  dominantColor: string;
  isDragOver: boolean;
  setIsDragOver: (v: boolean) => void;
  handleColorDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function CameraSection({
  cameraActive,
  droppedColors,
  onDropColor,
  removeDroppedColor,
  videoRef,
  videoContainerRef,
  dominantColor,
  isDragOver,
  setIsDragOver,
  handleColorDragOver
}: CameraSectionProps) {
  return (
    <div 
      ref={videoContainerRef}
      className="relative w-full max-w-[800px] rounded-3xl overflow-hidden shadow-2xl bg-black flex-shrink-0 border border-[#e8e3dc]"
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const data = e.dataTransfer.getData('color');
        if (data) {
          const color: Color = JSON.parse(data);
          const rect = videoContainerRef.current!.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onDropColor(color, x, y);
        }
      }}
      onDragOver={handleColorDragOver}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
    >
      <video ref={videoRef} className="w-full h-auto block scale-x-[-1]" autoPlay playsInline muted />

      {/* Overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-400 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 mix-blend-multiply transition-colors duration-600" style={{ backgroundColor: dominantColor }} />
      </div>

      {/* Dropped Colors */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {droppedColors.map(dc => <DroppedColor key={dc.id} droppedColor={dc} onRemove={removeDroppedColor} />)}
      </div>

      {/* Drop hint */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-8 py-4 rounded-xl font-display text-base text-[#6b5d54] pointer-events-none shadow-lg transition-opacity duration-300 ${isDragOver ? 'opacity-100' : 'opacity-0'}`}>
        Drag colors here to compare
      </div>
    </div>
  );
}
