import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Palette, Color } from '../types/palette';
import { ColorSwatch } from '../components/ColorSwatch';

interface PaletteCarouselProps {
  palettes: Palette[];
  currentIndex: number;
  goToSlide: (index: number) => void;
  handleColorDragStart: (e: React.DragEvent<HTMLDivElement>, color: Color) => void;
}

export function PaletteCarousel({ palettes, currentIndex, goToSlide, handleColorDragStart }: PaletteCarouselProps) {
  return (
    <div className="relative max-w-[900px] mx-auto overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#e8e3dc]">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {palettes.map((palette, index) => (
          <div key={index} className="min-w-full px-6 md:px-10 py-10 bg-white">
            <div className="text-center mb-8 pb-6 border-b border-[#e8e3dc]">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">{palette.name}</h3>
              <p className="text-base md:text-lg text-[#6b5d54] italic">{palette.description}</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
              {palette.colors.map((color, idx) => (
                <ColorSwatch key={idx} color={color} onDragStart={(e) => handleColorDragStart(e, color)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-6 md:px-10 py-4 md:py-6 border-t border-[#e8e3dc]">
        <button onClick={() => goToSlide(currentIndex - 1)} disabled={currentIndex === 0} className="btn-carousel">
          <ChevronLeft size={16} /> <span className="hidden md:inline">Previous</span>
        </button>
        <div className="flex gap-2">
          {palettes.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded cursor-pointer transition-all duration-300 ${i === currentIndex ? 'w-6 bg-[#c17850]' : 'w-2 bg-[#e8e3dc]'}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
        <button onClick={() => goToSlide(currentIndex + 1)} disabled={currentIndex === palettes.length - 1} className="btn-carousel">
          <span className="hidden md:inline">Next</span> <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
