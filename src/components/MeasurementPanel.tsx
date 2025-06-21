import React from 'react';
import { MapPin, Ruler, Copy, MessageCircle, Check, TrendingUp } from 'lucide-react';
import { Coordinate } from 'ol/coordinate';

interface MeasurementPanelProps {
  area: number;
  coordinates: Coordinate[];
  onDrawingModeChange: (mode: string) => void;
  drawingMode: string;
}

const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  area,
  coordinates,
  onDrawingModeChange,
  drawingMode,
}) => {
  const [copied, setCopied] = React.useState(false);

  const formatArea = (area: number) => {
    if (area > 10000) {
      return `${(area / 10000).toFixed(2)} ha`;
    }
    return `${area.toFixed(2)} m²`;
  };

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  const generateShareText = () => {
    if (area === 0) return '';

    const areaText = formatArea(area);
    const areaInBothUnits = area > 10000 
      ? `${areaText} (${area.toFixed(2)} m²)`
      : `${areaText} (${(area / 10000).toFixed(4)} ha)`;

    const coordinatesText = coordinates
      .map((coord, index) => 
        `${index + 1}. ${formatCoordinate(coord[1])}°, ${formatCoordinate(coord[0])}°`
      )
      .join('\n');

    return `📍 *Hasil Pengukuran Area*

📏 *Luas Area:* ${areaInBothUnits}

📌 *Koordinat Titik:*
${coordinatesText}

_Diukur menggunakan MapMeasure - Interactive Area Measurement Tool_`;
  };

  const copyToClipboard = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 space-y-6">
      <div className="border-b border-gray-200/50 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white" size={16} />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Measurement Results
          </h2>
        </div>
        <p className="text-gray-600 text-sm">View area measurements and coordinate data</p>
      </div>

      {/* Measurements */}
      {area > 0 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <Ruler className="text-white" size={14} />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Area Measurement</h3>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              {formatArea(area)}
            </div>
            <div className="text-sm text-blue-600">
              {area > 10000 ? `${area.toFixed(2)} square meters` : `${(area / 10000).toFixed(4)} hectares`}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <MapPin className="text-white" size={14} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Coordinates</h3>
            </div>
            <div className="max-h-40 overflow-y-auto bg-gray-50/80 rounded-xl p-3 border border-gray-200/50">
              {coordinates.map((coord, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200/50 last:border-b-0">
                  <span className="text-sm font-medium text-gray-600">Point {index + 1}</span>
                  <span className="text-sm text-gray-800 font-mono bg-white px-2 py-1 rounded-lg">
                    {formatCoordinate(coord[1])}°, {formatCoordinate(coord[0])}°
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-500" />
              Share Results
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  copied
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied!' : 'Copy Data'}</span>
              </button>
              
              <button
                onClick={shareToWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <MessageCircle size={18} />
                <span>Share to WA</span>
              </button>
            </div>
            
            <div className="bg-gray-50/80 rounded-xl p-3 text-xs text-gray-600 border border-gray-200/50">
              <p className="font-medium mb-2 text-gray-700">Preview:</p>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed bg-white p-2 rounded-lg border">
                {generateShareText()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {area === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ruler size={32} className="opacity-50" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">No measurements yet</p>
          <p className="text-sm text-gray-500">Use the drawing tools to start measuring areas</p>
        </div>
      )}
    </div>
  );
};

export default MeasurementPanel;