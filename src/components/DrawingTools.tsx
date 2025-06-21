import React from 'react';
import { Square, Trash2, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface DrawingToolsProps {
  drawingMode: string;
  onDrawingModeChange: (mode: string) => void;
  onClearAreas: () => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  drawingMode,
  onDrawingModeChange,
  onClearAreas,
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-30">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-3">
        <div className="flex flex-col gap-2">
          {/* Drawing Mode Toggle */}
          <button
            onClick={() => onDrawingModeChange(drawingMode === 'polygon' ? '' : 'polygon')}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
              drawingMode === 'polygon'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
            }`}
            title="Draw Area"
          >
            <Square size={20} />
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {drawingMode === 'polygon' ? 'Stop Drawing' : 'Draw Area'}
            </div>
          </button>

          {/* Clear Areas */}
          <button
            onClick={onClearAreas}
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-105 transition-all duration-300"
            title="Clear All"
          >
            <Trash2 size={20} />
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Clear All
            </div>
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 my-1"></div>

          {/* Pan Tool */}
          <button
            onClick={() => onDrawingModeChange('')}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
              drawingMode === ''
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
            }`}
            title="Pan Mode"
          >
            <Move size={20} />
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Pan Mode
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingTools;