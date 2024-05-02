export function createMatrixWidthHeight(width, height, values, fallbackValue) {
	return Array(height).fill(undefined).map((_, rowIndex) => {
		return Array(width).fill(undefined).map((__, columnIndex) => {
			return values?.[rowIndex]?.[columnIndex] ?? fallbackValue;
		});
	});
}

export function utilUnpackPixel(pixel) {
	if (pixel === 'transparent') {
		return;
	}

	const match = pixel.match(/^(\d+)\+(\d+)%(\d+)%$/);
	if (match) {
		return `hsl(${match[1]}, ${match[2]}%, ${match[3]}%)`;
	}
}
