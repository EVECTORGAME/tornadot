export default function utilRandomValueMinMax(min, max) {
	const difference = max - min;

	return min + (Math.random() * difference);
}
