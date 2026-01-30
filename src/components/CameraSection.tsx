import React from 'react';
import type { DraggedColor, Color } from '../types/palette';
import { DroppedColor } from './DroppedColor';

interface CameraSectionProps {
  droppedColors: DraggedColor[];
  onDropColor: (color: Color, x: number, y: number) => void;
  removeDroppedColor: (id: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoContainerRef: React.RefObject<HTMLDivElement | null>;
  isDragOver: boolean;
  setIsDragOver: (value: boolean) => void;
  handleColorDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function CameraSection({
  droppedColors,
  onDropColor,
  removeDroppedColor,
  videoRef,
  videoContainerRef,
  isDragOver,
  setIsDragOver,
  handleColorDragOver
}: CameraSectionProps) {

  // Single drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!videoContainerRef.current) return;

    const rect = videoContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const colorData = e.dataTransfer.getData('color');
    if (colorData) {
      const color: Color = JSON.parse(colorData);
      onDropColor(color, x, y);
    }
  };

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full max-w-[800px] rounded-3xl overflow-hidden shadow-2xl bg-black flex-shrink-0 border border-[#e8e3dc]"
      onDrop={handleDrop}
      onDragOver={handleColorDragOver}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
    >
      {/* Camera video */}
      <video
        ref={videoRef}
        className="w-full h-auto block scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />

      {/* Dropped colors */}
      <div className="absolute inset-0 z-10">
        {droppedColors.map(dc => (
          <DroppedColor
            key={dc.id}
            droppedColor={dc}
            onRemove={removeDroppedColor}
          />
        ))}
      </div>

      {/* Drop zone hint */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-8 py-4 rounded-xl font-display text-base text-[#6b5d54] shadow-lg transition-opacity duration-300 pointer-events-none ${isDragOver ? 'opacity-100' : 'opacity-0'}`}
      >
        Drag colors here to compare
      </div>
    </div>
  );
}
