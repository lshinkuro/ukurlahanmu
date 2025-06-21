import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import MeasurementPanel from './components/MeasurementPanel';
import SearchComponent from './components/SearchComponent';
import DrawingTools from './components/DrawingTools';
import Navbar from './components/Navbar';
import { Coordinate } from 'ol/coordinate';

function App() {
  const [area, setArea] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [drawingMode, setDrawingMode] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleAreaChange = (newArea: number, newCoordinates: Coordinate[]) => {
    setArea(newArea);
    setCoordinates(newCoordinates);
  };

  const handleClearAreas = () => {
    setArea(0);
    setCoordinates([]);
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
      <Navbar />

      {/* Search Component - visible outside navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SearchComponent onLocationSelect={handleLocationSelect} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <MeasurementPanel
              area={area}
              coordinates={coordinates}
              onDrawingModeChange={handleDrawingModeChange}
              drawingMode={drawingMode}
            />
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2 min-h-[400px] lg:min-h-0 relative">
            <MapComponent
              onAreaChange={handleAreaChange}
              onClearAreas={handleClearAreas}
              drawingMode={drawingMode}
              searchLocation={searchLocation}
              clearTrigger={clearTrigger}
            />
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
