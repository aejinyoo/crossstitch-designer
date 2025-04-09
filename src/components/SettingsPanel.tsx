import { useState } from "react";

interface SettingsProps {
  onGenerate: (settings: { widthMm: number; heightMm: number; count: number; maxColors: number }) => void;
}

export default function SettingsPanel({ onGenerate }: SettingsProps) {
  const [widthMm, setWidthMm] = useState(100);
  const [heightMm, setHeightMm] = useState(150);
  const [count, setCount] = useState(14);
  const [maxColors, setMaxColors] = useState(30);

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow max-w-md w-full">
      <h2 className="text-lg font-semibold">도안 설정</h2>

      <label>도안 너비 (mm)</label>
      <input type="number" value={widthMm} onChange={e => setWidthMm(+e.target.value)} className="input input-bordered" />

      <label>도안 높이 (mm)</label>
      <input type="number" value={heightMm} onChange={e => setHeightMm(+e.target.value)} className="input input-bordered" />

      <label>원단 카운트 (예: 14ct)</label>
      <input type="number" value={count} onChange={e => setCount(+e.target.value)} className="input input-bordered" />

      <label>최대 색상 수</label>
      <input type="number" value={maxColors} onChange={e => setMaxColors(+e.target.value)} className="input input-bordered" />

      <button
        className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={() => onGenerate({ widthMm, heightMm, count, maxColors })}
      >
        도안 생성하기
      </button>
    </div>
  );
}
