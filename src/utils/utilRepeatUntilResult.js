export default function utilRepeatUntilResult(callback) {
	let result;
	do {
		result = callback();
	} while (!result);

	return result;
}
