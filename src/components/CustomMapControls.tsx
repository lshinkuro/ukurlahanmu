import React, { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Layers, MapPin } from 'lucide-react';
import Map from 'ol/Map';

interface CustomMapControlsProps {
  map: Map | null;
}

const CustomMapControls: React.FC<CustomMapControlsProps> = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(10);

  useEffect(() => {
    if (!map) return;

    const view = map.getView();
    const updateZoom = () => {
      setCurrentZoom(Math.round(view.getZoom() || 10));
    };

    view.on('change:resolution', updateZoom);
    updateZoom();

    return () => {
      view.un('change:resolution', updateZoom);
    };
  }, [map]);

  const zoomIn = () => {
    if (!map) return;
    const view = map.getView();
    const zoom = view.getZoom();
    if (zoom !== undefined) {
      view.animate({
        zoom: zoom + 1,
        duration: 300,
      });
    }
  };

  const zoomOut = () => {
    if (!map) return;
    const view = map.getView();
    const zoom = view.getZoom();
    if (zoom !== undefined) {
      view.animate({
        zoom: zoom - 1,
        duration: 300,
      });
    }
  };

  const resetRotation = () => {
    if (!map) return;
    const view = map.getView();
    view.animate({
      rotation: 0,
      duration: 500,
    });
  };

  const fitToExtent = () => {
    if (!map) return;
    const view = map.getView();
    view.animate({
      center: [11877637.8, -695674.8], // Jakarta in Web Mercator
      zoom: 10,
      duration: 1000,
    });
  };

  if (!map) return null;

  return (
    <>
      {/* Zoom Controls - Top Right */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={zoomIn}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-105 transition-all duration-300"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            
            <div className="px-2 py-1 text-xs font-mono text-gray-600 text-center">
              {currentZoom}
            </div>
            
            <button
              onClick={zoomOut}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-105 transition-all duration-300"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Controls - Top Right (below zoom) */}
      <div className="absolute top-32 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={resetRotation}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:scale-105 transition-all duration-300"
              title="Reset Rotation"
            >
              <RotateCcw size={18} />
            </button>
            
            <button
              onClick={fitToExtent}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 hover:scale-105 transition-all duration-300"
              title="Fit to View"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Attribution - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 border border-white/20">
          © OpenStreetMap contributors
        </div>
      </div>
    </>
  );
};

export default CustomMapControls;