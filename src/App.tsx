import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import MeasurementPanel from './components/MeasurementPanel';
import SearchComponent from './components/SearchComponent';
import DrawingTools from './components/DrawingTools';
import { Coordinate } from 'ol/coordinate';

function App() {
  const [area, setArea] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [drawingMode, setDrawingMode] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);

  const handleAreaChange = (newArea: number, newCoordinates: Coordinate[]) => {
    setArea(newArea);
    setCoordinates(newCoordinates);
  };

  const [clearTrigger, setClearTrigger] = useState(0);

  const handleClearAreas = () => {
    // Clear state dulu
    setArea(0);
    setCoordinates([]);
    
    // Trigger map clear
    setClearTrigger(prev => prev + 1);
    
    console.log('All areas cleared - State reset and map cleared');
  };

  const handleDrawingModeChange = (mode: string) => {
    setDrawingMode(mode);
  };

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setSearchLocation({ lat, lon, name });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  MapMeasure
                </h1>
                <p className="text-sm text-gray-600">Interactive Area Measurement Tool</p>
              </div>
            </div>
            
            {/* Search Component */}
            <div className="flex-1 max-w-md mx-8">
              <SearchComponent onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Measurement Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <MeasurementPanel
              area={area}
              coordinates={coordinates}
              onDrawingModeChange={handleDrawingModeChange}
              drawingMode={drawingMode}
            />
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3 order-1 lg:order-2 min-h-[400px] lg:min-h-0 relative">
            <MapComponent
              onAreaChange={handleAreaChange}
              onClearAreas={handleClearAreas}
              drawingMode={drawingMode}
              searchLocation={searchLocation}
              clearTrigger={clearTrigger} 
            />
            
            {/* Drawing Tools - Bottom Left */}
            <DrawingTools
              drawingMode={drawingMode}
              onDrawingModeChange={handleDrawingModeChange}
              onClearAreas={handleClearAreas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;