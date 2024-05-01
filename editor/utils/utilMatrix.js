export function createMatrixWidthHeight(width, height, values, fallbackValue) {
	return Array(height).fill(undefined).map((_, rowIndex) => {
		return Array(width).fill(undefined).map((__, columnIndex) => {
			return values?.[rowIndex]?.[columnIndex] ?? fallbackValue;
		});
	});
}
