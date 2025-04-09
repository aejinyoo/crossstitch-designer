import React from 'react';

type LegendProps = {
  legendMap: Map<string, string>;
  selectedSymbol: string | null;
  onSelectSymbol: (symbol: string) => void;
};

const Legend: React.FC<LegendProps> = ({
  legendMap,
  selectedSymbol,
  onSelectSymbol,
}) => {
  const symbols = Array.from(new Set(Array.from(legendMap.values()))).sort();

  return (
    <div>
      <h3>색상 전설 (Legend)</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {symbols.map((symbol) => (
          <li
            key={symbol}
            onClick={() => onSelectSymbol(symbol)}
            style={{
              cursor: 'pointer',
              display: 'inline-block',
              marginRight: '8px',
              padding: '4px',
              border: selectedSymbol === symbol ? '2px solid yellow' : '1px solid lightgray',
              fontWeight: selectedSymbol === symbol ? 'bold' : 'normal',
              backgroundColor: selectedSymbol === symbol ? '#fffacd' : 'transparent',
              borderRadius: '4px',
            }}
          >
            {symbol}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
