import { describe, expect, test } from '@jest/globals';
import utilMergePlaceholderArrayWithDataArray from './utilMergePlaceholderArrayWithDataArray.js';

describe('utils/utilMergePlaceholderArrayWithDataArray.js', () => {
	test.each([
		{
			placeholders: ['a', 'b', 'c', 'd', 'e', 'f'],
			digits: [1, 2, 3],
			joiner: (placeholder, digit) => {
				return digit ?? placeholder;
			},
			shouldAlignToRight: true,
			expected: ['a', 'b', 'c', 1, 2, 3],
		},
		{
			placeholders: ['a', 'b', 'c'],
			digits: [1, 2, 3, 4],
			joiner: (placeholder, digit) => {
				return digit ?? placeholder;
			},
			shouldAlignToRight: true,
			expected: [2, 3, 4],
		},
		{
			placeholders: ['a', 'b', 'c', 'd', 'e', 'f'],
			digits: [1, 2, 3],
			joiner: (placeholder, digit) => {
				return digit ?? placeholder;
			},
			shouldAlignToRight: false,
			expected: [1, 2, 3, 'd', 'e', 'f'],
		},
	])('utilMergePlaceholderArrayWithDataArray($placeholders, $digits, $shouldAlignToRight) => $expected', ({
		placeholders,
		digits,
		joiner,
		shouldAlignToRight,
		expected,
	}) => {
		const result = utilMergePlaceholderArrayWithDataArray(placeholders, digits, shouldAlignToRight, joiner);
		expect(result).toEqual(expected);
	});
});
