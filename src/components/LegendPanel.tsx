interface LegendPanelProps {
  pattern: { code: string; r: number; g: number; b: number }[][];
}

export default function LegendPanel({ pattern }: LegendPanelProps) {
  const uniqueColors = new Map<string, { r: number; g: number; b: number }>();

  pattern.flat().forEach(({ code, r, g, b }) => {
    if (!uniqueColors.has(code)) {
      uniqueColors.set(code, { r, g, b });
    }
  });

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md">
      <h2 className="font-semibold mb-2">색상 전설 (Legend)</h2>
      <ul className="space-y-1">
        {[...uniqueColors.entries()].map(([code, color]) => (
          <li key={code} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `rgb(${color.r},${color.g},${color.b})` }}
            ></div>
            <span className="text-sm font-mono">{code}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
