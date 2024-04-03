export default function utilClamp(value, minValue, maxValue) {
	if (value > maxValue) {
		return maxValue;
	} else if (value < minValue) {
		return minValue;
	}

	return value;
}
