import utilPickRandomArrayElement from '../utils/utilPickRandomArrayElement.js';
import { RESOURCES } from '../config.js';

// RULE: 1meter has density of 32 pizels

/* TODO
	- lot of memoization
	- add dithering magFilter
	- add upscalling (with hole filling and without)
	- add random holes to plantSprite
	- add random fruits to plants
	- add merginng sprites
	- niech to zwraca już gotowego spritea - tak, żeby ustawiało też rozmiar spritea
*/

export default function createSprite({ codename, codenameStartsWith }) {
	const { sprites } = RESOURCES;
	const candidates
		= codename ? [sprites.find(x => x.codename === codename)]
		: codenameStartsWith ? sprites.filter(x => x.codename.startsWith(codenameStartsWith))
		: undefined;

	if (!candidates) {
		// ??
	}

	const sprite = utilPickRandomArrayElement(candidates);

	const {
		widthPixels,
		heightPixels,
		matrix,
	} = sprite;

	const canvas = document.createElement('canvas');
	canvas.width = widthPixels;
	canvas.height = heightPixels;

	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	matrix.forEach((row, rowIndex) => {
		row.forEach((pixel, columnIndex) => {
			if (pixel) {
				context.fillStyle = pixel;
				context.fillRect(columnIndex, rowIndex, 1, 1);
			}
		});
	});

	return {
		getCanvas() {
			return canvas;
		},
	};
}
