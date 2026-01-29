import { Camera, CameraOff } from 'lucide-react';

interface CameraControlsProps {
  cameraActive: boolean;
  toggleCamera: () => void;
  clearColors: () => void;
  hasDroppedColors: boolean;
}

export function CameraControls({ cameraActive, toggleCamera, clearColors, hasDroppedColors }: CameraControlsProps) {
  return (
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
        onClick={clearColors}
        disabled={!hasDroppedColors}
      >
        Clear Colors
      </button>
    </div>
  );
}
