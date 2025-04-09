export async function generatePatternFromImage(
  image: HTMLImageElement,
  widthStitches: number,
  heightStitches: number
): Promise<any[][]> {
  // 임시 도안 데이터 (랜덤 색상 코드 + rgb)
  const pattern = Array.from({ length: heightStitches }, () =>
    Array.from({ length: widthStitches }, () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const code = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return { code, r, g, b };
    })
  );

  return pattern;
}
