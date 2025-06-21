import React, { useEffect, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Map as MapIcon,
  Layers,
} from 'lucide-react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

interface CustomMapControlsProps {
  map: Map | null;
}

const CustomMapControls: React.FC<CustomMapControlsProps> = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(10);
  const [mapType, setMapType] = useState<'transport' | 'satellite'>('transport');

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
      view.animate({ zoom: zoom + 1, duration: 300 });
    }
  };

  const zoomOut = () => {
    if (!map) return;
    const view = map.getView();
    const zoom = view.getZoom();
    if (zoom !== undefined) {
      view.animate({ zoom: zoom - 1, duration: 300 });
    }
  };

  const resetRotation = () => {
    if (!map) return;
    const view = map.getView();
    view.animate({ rotation: 0, duration: 500 });
  };

  const fitToExtent = () => {
    if (!map) return;
    const view = map.getView();
    view.animate({
      center: [11877637.8, -695674.8], // Jakarta
      zoom: 10,
      duration: 1000,
    });
  };

  const toggleMapType = () => {
    if (!map) return;

    const layers = map.getLayers().getArray();
    const baseLayer = layers.find(layer => layer instanceof TileLayer) as TileLayer;

    if (mapType === 'transport') {
      // Ganti ke Satellite (pakai layer dari Esri misalnya)
      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri'
        })
      });

      map.getLayers().setAt(0, satelliteLayer);
      setMapType('satellite');
    } else {
      // Ganti ke Transport (OpenStreetMap default)
      const transportLayer = new TileLayer({
        source: new OSM()
      });

      map.getLayers().setAt(0, transportLayer);
      setMapType('transport');
    }
  };

  if (!map) return null;

  return (
    <>
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2">
          <div className="flex flex-col gap-1">
            <button onClick={zoomIn} title="Zoom In" className="map-button">
              <ZoomIn size={18} />
            </button>

            <div className="px-2 py-1 text-xs font-mono text-gray-600 text-center">
              {currentZoom}
            </div>

            <button onClick={zoomOut} title="Zoom Out" className="map-button">
              <ZoomOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Other Controls */}
      <div className="absolute top-32 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2">
          <div className="flex flex-col gap-1">
            <button onClick={resetRotation} title="Reset Rotation" className="map-button hover:bg-green-100 hover:text-green-600">
              <RotateCcw size={18} />
            </button>

            <button onClick={fitToExtent} title="Fit to View" className="map-button hover:bg-purple-100 hover:text-purple-600">
              <Maximize size={18} />
            </button>

            <button onClick={toggleMapType} title="Toggle Map Type" className="map-button hover:bg-yellow-100 hover:text-yellow-600">
              <Layers size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 border border-white/20">
          {mapType === 'satellite'
            ? '© Esri Satellite Imagery'
            : '© OpenStreetMap contributors'}
        </div>
      </div>

      {/* Styling helper */}
      <style>
        {`
          .map-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 0.75rem;
            background-color: #f3f4f6;
            color: #4b5563;
            transition: all 0.3s;
          }
          .map-button:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </>
  );
};

export default CustomMapControls;
