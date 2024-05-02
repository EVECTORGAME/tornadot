import { RESOURCES } from '../config.js';

export default function createBitmapText(text, { upscale }) {
	const { unitSize, sprites } = RESOURCES;
	const spritesMatrixesByLetters = sprites.reduce((stack, sprite) => {
		const { character } = sprite;
		if (character) {
			stack[character] = sprite.matrix;
		}

		return stack;
	}, {});

	const letters = text.split('');
	const width = unitSize * letters.length * upscale;
	const height = unitSize * upscale;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	letters.forEach((letter, index) => {
		const isSpace = letter === ' ';
		if (isSpace) {
			return;
		}

		const letterSpriteMatrix = spritesMatrixesByLetters[letter];
		if (!letterSpriteMatrix) {
			return;
		}

		const letterOffsetX = index * unitSize * upscale;
		letterSpriteMatrix.forEach((row, rowIndex) => {
			row.forEach((pixel, columnIndex) => {
				if (pixel) {
					context.fillStyle = pixel; // TODO check if different
					context.fillRect(letterOffsetX + (columnIndex * upscale), (rowIndex * upscale), upscale, upscale);
				}
			});
		});
	});
	// context.putImageData(imageData, dx, dy);

	return [canvas.toDataURL()];
}
