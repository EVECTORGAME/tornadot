const RADIANS_FACTOR = Math.PI / 180;

export default function utilDegreesToRadians(degrees) {
	return (degrees % 360) * RADIANS_FACTOR;
}
