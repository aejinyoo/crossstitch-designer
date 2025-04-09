import { useRef, useState } from "react";
import SettingsPanel from "./components/SettingsPanel";
import PatternCanvas from "./components/PatternCanvas";
import LegendPanel from "./components/LegendPanel";
import { generatePatternFromImage } from "./lib/patternGenerator";

export default function App() {
  const [pattern, setPattern] = useState<any[][] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async ({
    widthMm,
    heightMm,
    count,
    maxColors,
  }: {
    widthMm: number;
    heightMm: number;
    count: number;
    maxColors: number;
  }) => {
    if (!imageRef.current) return;

    const widthStitches = Math.round((widthMm / 25.4) * count);
    const heightStitches = Math.round((heightMm / 25.4) * count);

    const pat = await generatePatternFromImage(
      imageRef.current,
      widthStitches,
      heightStitches
    );
    setPattern(pat);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-4 p-4">
      <h1 className="text-3xl font-bold text-center">🧵 CrossStitch Designer</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full max-w-xs" />

      {imageUrl && <img src={imageUrl} ref={(el) => (imageRef.current = el)} className="max-w-xs border shadow" style={{ display: "none" }} />}

      <SettingsPanel onGenerate={handleGenerate} />

      {pattern && (
        <>
          <PatternCanvas pattern={pattern} />
          <LegendPanel pattern={pattern} />

          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              const link = document.createElement("a");
              link.download = "pattern.jpg";
              link.href = canvas.toDataURL("image/jpeg");
              link.click();
            }}
          >
            JPG로 저장
          </button>
        </>
      )}
    </div>
  );
}
