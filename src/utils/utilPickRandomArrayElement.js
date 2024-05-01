export default function utilPickRandomArrayElement(array) {
	const randomIndex = Math.floor(Math.random() * array.length);

	return array[randomIndex];
}
