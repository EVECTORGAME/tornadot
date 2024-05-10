import { RESOURCES } from '../config.js';

export default function createBitmapText(text, { upscale, valign }) { // valign: middle, bottom
	const { sprites } = RESOURCES;
	const spritesByLetters = sprites.reduce((stack, sprite) => {
		const { character } = sprite;
		if (character) {
			stack[character] = sprite;
		}

		return stack;
	}, {});

	const letters = text.split('');
	const { calculatedWidth, calculatedHeight, offsets, matrixs, heights } = letters.reduce((stack, letter) => {
		const offset = stack.calculatedWidth;

		const isSpace = letter === ' ';
		if (isSpace) {
			const spaceWidth = 8;
			stack.calculatedWidth += spaceWidth * upscale;

			return stack;
		}

		const letterSprite = spritesByLetters[letter];
		if (!letterSprite) {
			return stack;
		}

		stack.calculatedWidth += letterSprite.widthPixels * upscale;

		const letterHeight = letterSprite.heightPixels * upscale;
		if (letterHeight > stack.calculatedHeight) {
			stack.calculatedHeight = letterHeight;
		}

		stack.offsets.push(offset);
		stack.heights.push(letterHeight);
		stack.matrixs.push(letterSprite.matrix);

		return stack;
	}, {
		calculatedWidth: 0,
		calculatedHeight: 0,
		offsets: [],
		matrixs: [],
		heights: [],
	});

	const canvas = document.createElement('canvas');
	canvas.width = calculatedWidth;
	canvas.height = calculatedHeight;

	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	matrixs.forEach((matrix, index) => {
		const letterHeight = heights[index];
		const letterOffsetX = offsets[index];
		const letterOffsetY
			= valign === 'middle' ? (calculatedHeight - letterHeight) / 2
			: valign === 'bottom' ? calculatedHeight - letterHeight
			: 0;

		matrix.forEach((row, rowIndex) => {
			row.forEach((pixel, columnIndex) => {
				if (pixel) {
					context.fillStyle = pixel; // TODO check if different
					context.fillRect(
						letterOffsetX + (columnIndex * upscale),
						letterOffsetY + (rowIndex * upscale),
						upscale,
						upscale,
					);
				}
			});
		});
	});

	return [canvas.toDataURL()];
}
