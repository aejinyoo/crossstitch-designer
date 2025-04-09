interface PatternCanvasProps {
  pattern: { code: string; r: number; g: number; b: number }[][];
}

export default function PatternCanvas({ pattern }: PatternCanvasProps) {
  const cellSize = 20;

  return (
    <div className="overflow-auto border shadow max-w-full bg-white p-2 rounded">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${pattern[0]?.length ?? 0}, ${cellSize}px)`,
        }}
      >
        {pattern.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="border flex items-center justify-center text-xs font-mono"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: `rgb(${cell.r}, ${cell.g}, ${cell.b})`,
                color: "black",
              }}
            >
              {cell.code}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
