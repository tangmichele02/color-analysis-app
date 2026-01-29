import React, { useState, useRef, useEffect } from 'react';
import { CameraSection } from '../components/CameraSection';
import { CameraControls } from '../components/CameraControls';
import { PaletteCarousel } from '../components/PaletteCarousel';
import type { Color, DraggedColor } from '../types/palette';
import { color_palettes } from '../data/color_palettes';

export default function ColorAnalysisPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [droppedColors, setDroppedColors] = useState<DraggedColor[]>([]);
  const [nextColorId, setNextColorId] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const startCamera = async () => { /* ...same as before */ };
  const stopCamera = () => { /* ...same as before */ };
  const toggleCamera = () => cameraActive ? stopCamera() : startCamera();
  const goToSlide = (index: number) => setCurrentIndex(Math.max(0, Math.min(index, color_palettes.length - 1)));

  const handleColorDragStart = (e: React.DragEvent<HTMLDivElement>, color: Color) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('color', JSON.stringify(color));
  };

  const removeDroppedColor = (id: number) => setDroppedColors(droppedColors.filter(c => c.id !== id));
  const clearAllColors = () => setDroppedColors([]);
  
  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 px-8 py-10 pb-6 text-center border-b border-[#e8e3dc] bg-gradient-to-b from-[#faf8f5] to-[#faf8f5]/95 backdrop-blur-md">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-wide mb-2 bg-gradient-to-br from-[#2d2420] to-[#c17850] bg-clip-text text-transparent">
          Virtual Color Analysis
        </h1>
        <p className="text-lg text-[#6b5d54] font-light italic">Discover your perfect palette</p>
      </header>

      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 max-w-[1600px] mx-auto w-full">
        {/* Camera Section */}
        <CameraSection
          cameraActive={cameraActive}
          droppedColors={droppedColors}
          onDropColor={(color, x, y) => {
            setDroppedColors([...droppedColors, { color, x, y, id: nextColorId }]);
            setNextColorId(nextColorId + 1);
          }}
          removeDroppedColor={removeDroppedColor}
          videoRef={videoRef}
          videoContainerRef={videoContainerRef}
          dominantColor={color_palettes[currentIndex].dominantColor}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          handleColorDragOver={(e) => e.preventDefault()}
        />

        <CameraControls
          cameraActive={cameraActive}
          toggleCamera={toggleCamera}
          clearColors={clearAllColors}
          hasDroppedColors={droppedColors.length > 0}
        />

        <PaletteCarousel
          palettes={color_palettes}
          currentIndex={currentIndex}
          goToSlide={goToSlide}
          handleColorDragStart={handleColorDragStart}
        />
      </main>
    </div>
  );
}
