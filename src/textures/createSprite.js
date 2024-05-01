import utilPickRandomArrayElement from '../utils/utilPickRandomArrayElement.js';
import { RESOURCES } from '../config.js';

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
	const { unitSize, sprites } = RESOURCES;
	const candidates
		= codename ? [sprites.find(x => x.codename === codename)]
		: codenameStartsWith ? sprites.filter(x => x.codename.startsWith(codenameStartsWith))
		: undefined;

	if (!candidates) {
		// ??
	}

	const sprite = utilPickRandomArrayElement(candidates);

	const {
		widthUnits,
		heightUnits,
		matrix,
	} = sprite;

	const canvas = document.createElement('canvas');
	canvas.width = widthUnits * unitSize; // const;
	canvas.height = heightUnits * unitSize; // const;

	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	// context.putImageData(imageData, dx, dy);
	matrix.forEach((row, rowIndex) => {
		row.split(';').forEach((pixel, columnIndex) => {
			context.fillStyle = pixel; // TODO check if different
			context.fillRect(columnIndex, rowIndex, 1, 1);
		});
	});

	return {
		getCanvas() {
			return canvas;
		},
	};
}
