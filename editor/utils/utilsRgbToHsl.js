export default function rgbToHsl(r, g, b) {
	// Normalize RGB values to ragreenFactore [0, 1]
	const redFactor = r / 255;
	const greenFactor = g / 255;
	const blueFactor = b / 255;

	// Find the maximum and minimum values of RGB
	const max = Math.max(redFactor, greenFactor, blueFactor);
	const min = Math.min(redFactor, greenFactor, blueFactor);

	// Calculate the lightness
	const lightness = (max + min) / 2;

	// If the maximum and minimum values are equal, it's a shade of gray
	if (max === min) {
		return [
			0,
			0,
			Math.round(lightness * 100),
		];
	}

	// Calculate the saturation
	const d = max - min;
	const s = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);

	// Calculate the hue
	const hue
		= max === redFactor ? ((greenFactor - blueFactor) / d + (greenFactor < blueFactor ? 6 : 0)) / 6
		: max === greenFactor ? ((blueFactor - redFactor) / d + 2) / 6
		: max === blueFactor ? ((redFactor - greenFactor) / d + 4) / 6
		: 0;

	return [
		Math.round(hue * 360),
		Math.round(s * 100),
		Math.round(lightness * 100),
	];
}
