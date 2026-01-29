import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera, CameraOff } from 'lucide-react';
import type { Color, DraggedColor } from '../types/palette';
import { color_palettes } from '../data/color_palettes';

export default function ColorAnalysisApp() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [droppedColors, setDroppedColors] = useState<DraggedColor[]>([]);
  const [nextColorId, setNextColorId] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
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
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, color_palettes.length - 1)));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const endX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < color_palettes.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    }
  };

  const handleColorDragStart = (e: React.DragEvent<HTMLDivElement>, color: Color) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('color', JSON.stringify(color));
  };

  const handleColorDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!videoContainerRef.current) return;
    
    const rect = videoContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const colorData = e.dataTransfer.getData('color');
    if (colorData) {
      const color: Color = JSON.parse(colorData);
      const newColor: DraggedColor = {
        color,
        x,
        y,
        id: nextColorId
      };
      setDroppedColors([...droppedColors, newColor]);
      setNextColorId(nextColorId + 1);
    }
  };

  const handleColorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const removeDroppedColor = (id: number) => {
    setDroppedColors(droppedColors.filter(c => c.id !== id));
  };

  const clearAllColors = () => {
    setDroppedColors([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Philosopher:wght@400;700&display=swap');
        
        body {
          font-family: 'Cormorant Garamond', serif;
        }
        
        .font-display {
          font-family: 'Philosopher', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 px-8 py-10 pb-6 text-center border-b border-[#e8e3dc] bg-gradient-to-b from-[#faf8f5] to-[#faf8f5]/95 backdrop-blur-md">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-wide mb-2 bg-gradient-to-br from-[#2d2420] to-[#c17850] bg-clip-text text-transparent">
          Virtual Color Analysis
        </h1>
        <p className="text-lg text-[#6b5d54] font-light italic">
          Discover your perfect palette
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 max-w-[1600px] mx-auto w-full">
        {/* Camera Section */}
        <div className="relative mb-8 flex justify-center gap-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-6 items-center max-w-[1400px] w-full">
            {/* Left Color Border */}
            <div className="hidden md:flex flex-col gap-4 min-w-[140px]">
              <div className="font-display text-sm font-bold text-center text-[#2d2420] mb-2 uppercase tracking-widest">
                {color_palettes[currentIndex].name}
              </div>
              {color_palettes[currentIndex].colors.slice(0, 4).map((color, index) => (
                <div 
                  key={index}
                  className="group w-full aspect-square rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110 relative"
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                  draggable
                  onDragStart={(e) => handleColorDragStart(e, color)}
                >
                  <span className="absolute top-1/2 right-[110%] -translate-y-1/2 text-xs text-[#6b5d54] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-md z-10 pointer-events-none">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Camera Container */}
            <div 
              ref={videoContainerRef}
              className="relative w-full max-w-[800px] rounded-3xl overflow-hidden shadow-2xl bg-black flex-shrink-0 border border-[#e8e3dc]"
              onDrop={handleColorDrop}
              onDragOver={handleColorDragOver}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
            >
              <video 
                ref={videoRef}
                className="w-full h-auto block scale-x-[-1]"
                autoPlay 
                playsInline 
                muted
              />
              
              {/* Color Overlay */}
              <div className={`absolute inset-0 pointer-events-none transition-opacity duration-400 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}>
                <div 
                  className="absolute inset-0 mix-blend-multiply transition-colors duration-600"
                  style={{ backgroundColor: color_palettes[currentIndex].dominantColor }}
                />
              </div>
              
              {/* Dropped Colors */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {droppedColors.map((droppedColor) => (
                  <div
                    key={droppedColor.id}
                    className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center group"
                    style={{
                      backgroundColor: droppedColor.color.hex,
                      left: `${droppedColor.x}%`,
                      top: `${droppedColor.y}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 3px rgba(255, 255, 255, 0.5)'
                    }}
                    onClick={() => removeDroppedColor(droppedColor.id)}
                    title={`${droppedColor.color.name} - Click to remove`}
                  >
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-lg font-bold text-[#2d2420] shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      ×
                    </div>
                  </div>
                ))}
              </div>

              {/* Drop Zone Hint */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-8 py-4 rounded-xl font-display text-base text-[#6b5d54] pointer-events-none shadow-lg transition-opacity duration-300 ${isDragOver ? 'opacity-100' : 'opacity-0'}`}>
                Drag colors here to compare
              </div>
            </div>

            {/* Right Color Border */}
            <div className="hidden md:flex flex-col gap-4 min-w-[140px]">
              <div className="font-display text-sm font-bold text-center text-[#2d2420] mb-2 uppercase tracking-widest">
                {color_palettes[currentIndex].description.split('—')[0]}
              </div>
              {color_palettes[currentIndex].colors.slice(4, 8).map((color, index) => (
                <div 
                  key={index}
                  className="group w-full aspect-square rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110 relative"
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                  draggable
                  onDragStart={(e) => handleColorDragStart(e, color)}
                >
                  <span className="absolute top-1/2 left-[110%] -translate-y-1/2 text-xs text-[#6b5d54] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-md z-10 pointer-events-none">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center mt-6 flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            className="font-display bg-[#c17850] text-white border-none px-10 py-4 text-base font-bold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#a8654a] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 inline-flex items-center gap-3"
            onClick={toggleCamera}
          >
            {cameraActive ? (
              <>
                <CameraOff size={20} />
                Stop Camera
              </>
            ) : (
              <>
                <Camera size={20} />
                Start Camera
              </>
            )}
          </button>
          <button 
            className="font-display bg-transparent text-[#c17850] border-2 border-[#c17850] px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-[#c17850] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={clearAllColors}
            disabled={droppedColors.length === 0}
          >
            Clear Colors
          </button>
        </div>

        {/* Palettes Section */}
        <div className="mt-12 animate-fade-in-up-delay">
          <h2 className="font-display text-3xl text-center mb-8 text-[#2d2420]">
            Explore Your Seasonal Palettes
          </h2>
          <div className="relative max-w-[900px] mx-auto overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#e8e3dc]">
            <div 
              ref={trackRef}
              className={`flex transition-transform duration-500 ease-out touch-pan-y ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
            >
              {color_palettes.map((palette, index) => (
                <div key={index} className="min-w-full px-6 md:px-10 py-10 bg-white">
                  <div className="text-center mb-8 pb-6 border-b border-[#e8e3dc]">
                    <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                      {palette.name}
                    </h3>
                    <p className="text-base md:text-lg text-[#6b5d54] italic">
                      {palette.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
                    {palette.colors.map((color, colorIndex) => (
                      <div 
                        key={colorIndex}
                        className="group aspect-square rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-105 relative"
                        style={{ 
                          backgroundColor: color.hex,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                        }}
                        draggable
                        onDragStart={(e) => handleColorDragStart(e, color)}
                      >
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#6b5d54] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex justify-between items-center px-6 md:px-10 py-4 md:py-6 border-t border-[#e8e3dc]">
              <button 
                className="font-display bg-transparent text-[#c17850] border-2 border-[#c17850] px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-[#c17850] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed inline-flex items-center gap-2"
                onClick={() => goToSlide(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={16} />
                <span className="hidden md:inline">Previous</span>
              </button>
              <div className="flex gap-2">
                {color_palettes.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded cursor-pointer transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-6 bg-[#c17850]' 
                        : 'w-2 bg-[#e8e3dc]'
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              <button 
                className="font-display bg-transparent text-[#c17850] border-2 border-[#c17850] px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-[#c17850] hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed inline-flex items-center gap-2"
                onClick={() => goToSlide(currentIndex + 1)}
                disabled={currentIndex === color_palettes.length - 1}
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}