export default function utilRandomValueMInMax(min, max) {
	const difference = max - min;

	return min + (Math.random() * difference);
}
