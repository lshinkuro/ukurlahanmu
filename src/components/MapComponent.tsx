import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import { getArea, getLength } from 'ol/sphere';
import { Polygon, LineString, Point } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { defaults as defaultControls } from 'ol/control';
import CustomMapControls from './CustomMapControls';

interface MapComponentProps {
  onAreaChange: (area: number, coordinates: Coordinate[]) => void;
  onClearAreas: () => void;
  drawingMode: string;
  searchLocation?: { lat: number; lon: number; name: string } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onAreaChange, 
  onClearAreas, 
  drawingMode, 
  searchLocation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const markerSourceRef = useRef<VectorSource>(new VectorSource());
  const drawRef = useRef<Draw | null>(null);
  const modifyRef = useRef<Modify | null>(null);
  const snapRef = useRef<Snap | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        fill: new Fill({
          color: 'rgba(59, 130, 246, 0.15)',
        }),
        stroke: new Stroke({
          color: '#3B82F6',
          width: 3,
        }),
      }),
    });

    const markerLayer = new VectorLayer({
      source: markerSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({
            color: '#EF4444',
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 3,
          }),
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
        markerLayer,
      ],
      view: new View({
        center: fromLonLat([106.845599, -6.208763]), // Jakarta coordinates
        zoom: 10,
      }),
    });

    mapInstanceRef.current = map;

    // Add modify interaction
    modifyRef.current = new Modify({ 
      source: vectorSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#3B82F6',
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2,
          }),
        }),
      }),
    });
    map.addInteraction(modifyRef.current);

    // Add snap interaction
    snapRef.current = new Snap({ source: vectorSourceRef.current });
    map.addInteraction(snapRef.current);

    // Listen for feature changes
    vectorSourceRef.current.on('addfeature', handleFeatureAdd);
    vectorSourceRef.current.on('changefeature', handleFeatureChange);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle search location changes
  useEffect(() => {
    if (searchLocation && mapInstanceRef.current) {
      const { lat, lon, name } = searchLocation;
      const coordinate = fromLonLat([lon, lat]);
      
      // Clear existing markers
      markerSourceRef.current.clear();
      
      // Add new marker
      const marker = new Feature({
        geometry: new Point(coordinate),
        name: name,
      });
      markerSourceRef.current.addFeature(marker);
      
      // Animate to location
      const view = mapInstanceRef.current.getView();
      view.animate({
        center: coordinate,
        zoom: 15,
        duration: 1000,
      });
    }
  }, [searchLocation]);

  const handleFeatureAdd = (event: any) => {
    const feature = event.feature;
    calculateMeasurements(feature);
  };

  const handleFeatureChange = (event: any) => {
    const feature = event.feature;
    calculateMeasurements(feature);
  };

  const calculateMeasurements = (feature: Feature) => {
    const geometry = feature.getGeometry();
    
    if (geometry instanceof Polygon) {
      const area = getArea(geometry);
      const coordinates = geometry.getCoordinates()[0].map((coord: Coordinate) => 
        toLonLat(coord)
      );
      onAreaChange(area, coordinates);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing draw interaction
    if (drawRef.current) {
      mapInstanceRef.current.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (drawingMode === 'polygon') {
      drawRef.current = new Draw({
        source: vectorSourceRef.current,
        type: 'Polygon',
        style: new Style({
          fill: new Fill({
            color: 'rgba(59, 130, 246, 0.1)',
          }),
          stroke: new Stroke({
            color: '#3B82F6',
            width: 3,
            lineDash: [10, 10],
          }),
          image: new Circle({
            radius: 6,
            fill: new Fill({
              color: '#3B82F6',
            }),
            stroke: new Stroke({
              color: '#FFFFFF',
              width: 2,
            }),
          }),
        }),
      });
      mapInstanceRef.current.addInteraction(drawRef.current);
    }
  }, [drawingMode]);

  const clearAreas = () => {
    vectorSourceRef.current.clear();
    markerSourceRef.current.clear();
    onClearAreas();
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20" 
      />
      
      {/* Custom Map Controls */}
      <CustomMapControls map={mapInstanceRef.current} />
    </div>
  );
};

export default MapComponent;