// src/components/CrossStitchCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';

interface CrossStitchCanvasProps {
  imageData: ImageData | null;
  gridSize: number;
  width: number;
  height: number;
  legendMap?: Map<string, string>;
  symbolFontSize?: number;
  symbolFontFamily?: string;
  imageUrl?: string;
  onLoadPattern?: (data: {
    imageData: ImageData;
    legendMap: Map<string, string>;
  } | null) => void;
}

const CrossStitchCanvas: React.FC<CrossStitchCanvasProps> = ({
  imageData,
  gridSize,
  width,
  height,
  legendMap,
  symbolFontSize,
  symbolFontFamily,
  imageUrl,
  onLoadPattern,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.reset?.();
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(scale, scale);

    ctx.putImageData(imageData, 0, 0);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Thick grid every 10
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += gridSize * 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize * 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.lineWidth = 1;

    if (legendMap) {
      const data = imageData.data;
      const fontSize = symbolFontSize ?? gridSize * 0.6;
      const fontFamily = symbolFontFamily ?? 'Arial';

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
          const px = (y * width + x) * 4;
          const r = data[px];
          const g = data[px + 1];
          const b = data[px + 2];
          const color = `#${r.toString(16).padStart(2, '0')}${g
            .toString(16)
            .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
          const symbol = legendMap.get(color);
          if (symbol) {
            if (selectedSymbol === symbol) {
              ctx.strokeStyle = 'yellow';
              ctx.lineWidth = 2;
              ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
              ctx.lineWidth = 1;
            }
            ctx.fillText(symbol, x + gridSize / 2, y + gridSize / 2);
          }
        }
      }
    }

    ctx.restore();
  }, [imageData, gridSize, width, height, legendMap, symbolFontSize, symbolFontFamily, selectedSymbol, scale]);

  const handleDownloadCanvas = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'crossstitch-pattern.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadOriginal = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = 'original-image.png';
    link.href = imageUrl;
    link.click();
  };

  const handleSavePattern = () => {
    if (!imageData || !legendMap) return;
    const data = {
      imageData: {
        width: imageData.width,
        height: imageData.height,
        data: Array.from(imageData.data),
      },
      legendMap: Object.fromEntries(legendMap),
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pattern.json';
    link.click();
  };

  const handleLoadPattern = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result as string);
        const imageData = new ImageData(
          Uint8ClampedArray.from(result.imageData.data),
          result.imageData.width,
          result.imageData.height
        );
        const legendMap = new Map<string, string>(Object.entries(result.legendMap));
        onLoadPattern?.({ imageData, legendMap });
      } catch (e) {
        alert('불러오기에 실패했습니다. 올바른 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetPattern = () => {
    onLoadPattern?.(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleResetPattern}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          도안 초기화
        </button>
        <button
          onClick={() => setScale(prev => prev * 1.2)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          확대
        </button>
        <button
          onClick={() => setScale(prev => prev / 1.2)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          축소
        </button>
        <button
          onClick={() => setScale(1)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          100%
        </button>
      </div>
      <canvas ref={canvasRef} width={width} height={height} className="border shadow" />
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleDownloadCanvas}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          도안 이미지 다운로드
        </button>
        {imageUrl && (
          <button
            onClick={handleDownloadOriginal}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            원본 이미지 다운로드
          </button>
        )}
        <button
          onClick={handleSavePattern}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          도안 저장하기
        </button>
        <label className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer">
          도안 불러오기
          <input
            type="file"
            accept="application/json"
            onChange={handleLoadPattern}
            className="hidden"
          />
        </label>
      </div>
      {legendMap && (
        <div className="max-w-md border p-2 rounded shadow bg-white">
          <h3 className="font-semibold mb-2">전설 (Legend)</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1">색상</th>
                <th className="text-left p-1">기호</th>
              </tr>
            </thead>
            <tbody>
              {[...legendMap.entries()].map(([color, symbol]) => (
                <tr
                  key={color}
                  className="border-t cursor-pointer hover:bg-yellow-100"
                  onClick={() =>
                    setSelectedSymbol(prev => (prev === symbol ? null : symbol))
                  }
                >
                  <td className="p-1">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color }}
                    ></div>
                  </td>
                  <td className="p-1 font-mono text-lg">{symbol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CrossStitchCanvas;
