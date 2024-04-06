export default function utilMergePlaceholderArrayWithDataArray(placeholders, digits, shouldAlignToRight, merger) {
	const countOfPaddingCharacters = placeholders.length - digits.length;

	return placeholders.map((_, index) => {
		if (shouldAlignToRight) {
			const result = index < countOfPaddingCharacters
				? merger(placeholders[index], undefined, index)
				: merger(placeholders[index], digits[index - countOfPaddingCharacters], index);

			return result;
		}

		const result = index > digits.length
			? merger(placeholders[index], undefined, index)
			: merger(placeholders[index], digits[index], index);

		return result;
	});
}
