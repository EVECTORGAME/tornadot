export default function utilClamp(value, minValue, maxValue) {
	if (value > maxValue) {
		return maxValue;
	} else if (value < minValue) {
		return minValue;
	}

	return value;
}

export function utilClamp01(value) {
	return utilClamp(value, 0, 1);
}

export function utilClamp11(value) {
	return utilClamp(value, -1, 1);
}
