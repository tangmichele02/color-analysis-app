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
  const streamRef = useRef<MediaStream | null>(null);

  // --- Camera functions ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const toggleCamera = () => {
    cameraActive ? stopCamera() : startCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- Drag & Drop ---
  const handleColorDragStart = (e: React.DragEvent<HTMLDivElement>, color: Color) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('color', JSON.stringify(color));
  };

  const removeDroppedColor = (id: number) => {
    setDroppedColors(droppedColors.filter(c => c.id !== id));
  };

  const clearAllColors = () => setDroppedColors([]);

  // --- Carousel ---
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, color_palettes.length - 1)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 px-8 py-10 pb-6 text-center border-b border-[#e8e3dc] bg-gradient-to-b from-[#faf8f5] to-[#faf8f5]/95 backdrop-blur-md">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-wide mb-2 bg-gradient-to-br from-[#2d2420] to-[#c17850] bg-clip-text text-transparent">
          Virtual Color Analysis
        </h1>
        <p className="text-lg text-[#6b5d54] font-light italic">Discover your perfect palette</p>
      </header>

      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 max-w-[1600px] mx-auto w-full space-y-8">
        {/* Camera Section */}
        <CameraSection
          droppedColors={droppedColors}
          onDropColor={(color, x, y) => {
            setDroppedColors([...droppedColors, { color, x, y, id: nextColorId }]);
            setNextColorId(nextColorId + 1);
          }}
          removeDroppedColor={removeDroppedColor}
          videoRef={videoRef}
          videoContainerRef={videoContainerRef}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          handleColorDragOver={(e) => e.preventDefault()}
        />

        {/* Camera Controls */}
        <CameraControls
          cameraActive={cameraActive}
          toggleCamera={toggleCamera}
          clearColors={clearAllColors}
          hasDroppedColors={droppedColors.length > 0}
        />

        {/* Palette Carousel */}
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
