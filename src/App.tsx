import React, { useState } from 'react';
import CrossStitchCanvas from './components/CrossStitchCanvas';
import Legend from './Legend';
import generatePattern from './utils/generatePattern';
import extractImageData from './utils/extractImageData';

const App: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [patternWidth, setPatternWidth] = useState(100);
  const [patternHeight, setPatternHeight] = useState(150);
  const [legendMap, setLegendMap] = useState<Map<string, string>>(new Map());
  const [countPerInch, setCountPerInch] = useState(14);
  const [maxColors, setMaxColors] = useState(30);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
      const extracted = extractImageData(image, patternWidth, patternHeight);
      const { data, legend } = generatePattern(extracted, maxColors);
      setImageData(data);
      setLegendMap(legend);
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🧵 CrossStitch Designer</h1>

      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <h2>도안 설정</h2>
      <div>
        <label>
          도안 너비 (mm):
          <input
            type="number"
            value={patternWidth}
            onChange={(e) => setPatternWidth(Number(e.target.value))}
          />
        </label>
        <label>
          도안 높이 (mm):
          <input
            type="number"
            value={patternHeight}
            onChange={(e) => setPatternHeight(Number(e.target.value))}
          />
        </label>
        <label>
          원단 카운트 (예: 14ct):
          <input
            type="number"
            value={countPerInch}
            onChange={(e) => setCountPerInch(Number(e.target.value))}
          />
        </label>
        <label>
          최대 색상 수:
          <input
            type="number"
            value={maxColors}
            onChange={(e) => setMaxColors(Number(e.target.value))}
          />
        </label>
      </div>

      <button
        onClick={() => {
          if (!imageData) return;
          const { data, legend } = generatePattern(imageData, maxColors);
          setImageData(data);
          setLegendMap(legend);
        }}
      >
        도안 생성하기
      </button>

      {imageData && (
        <>
          <CrossStitchCanvas
            imageData={imageData}
            patternWidth={patternWidth}
            patternHeight={patternHeight}
            legendMap={legendMap}
            selectedSymbol={selectedSymbol}
          />
          <Legend
            legendMap={legendMap}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
        </>
      )}
    </div>
  );
};

export default App;
