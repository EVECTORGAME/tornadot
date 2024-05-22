import {
	NearestFilter,
	SpriteMaterial,
	Sprite,
	MeshPhongMaterial,
	MeshStandardMaterial,
	Mesh,
	PlaneGeometry,
	CanvasTexture,
	DoubleSide,
	TextureLoader,
} from 'three';
import utilPickRandomArrayElement from '../utils/utilPickRandomArrayElement.js';
import { RESOURCES } from '../config.js';

// RULE: 1meter has density of 32 pizels
const PIXELS_PER_METER = 64;

const textureLoader = new TextureLoader();

/* TODO
	- lot of memoization
	- add dithering magFilter
	- add upscalling (with hole filling and without)
	- add random holes to plantSprite
	- add random fruits to plants
	- add merginng sprites
	- niech to zwraca już gotowego spritea - tak, żeby ustawiało też rozmiar spritea
*/

function createCanvasFromResource({ codename, codenameStartsWith }) {
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

	return canvas;
}

function createTextureFromCanvas(canvas) {
	const plantTexture = new CanvasTexture(canvas);
	plantTexture.minFilter = NearestFilter;
	plantTexture.magFilter = NearestFilter;

	const widthMeters = canvas.width / PIXELS_PER_METER;
	const heightMeters = canvas.height / PIXELS_PER_METER;

	return [plantTexture, {
		widthMeters,
		heightMeters,
	}];
}

export function createTextureFromResource({ src, codename, codenameStartsWith }) {
	if (src) {
		const [, widthMeters, heightMeters] = src.match(/-(\d+)x(\d+)\.\w+$/);
		const texture = new TextureLoader().load(src);

		return [texture, {
			widthMeters,
			heightMeters,
		}];
	}

	const canvas = createCanvasFromResource({ codename, codenameStartsWith });
	const [texture, {
		widthMeters,
		heightMeters,
	}] = createTextureFromCanvas(canvas);

	return [texture, {
		widthMeters,
		heightMeters,
	}];
}

export default function createSprite({ src, codename, codenameStartsWith }) {
	const [texture, {
		widthMeters,
		heightMeters,
	}] = createTextureFromResource({ src, codename, codenameStartsWith });

	const material = new SpriteMaterial({ map: texture });
	const sprite = new Sprite(material);
	sprite.scale.set(widthMeters, heightMeters, 0);
	sprite.position.set(0, 0, 0);

	return sprite;
}

export function createQuad({ src, codename, codenameStartsWith, shouldMakeLessAffectedByLight, upscale }) {
	const [texture, {
		widthMeters,
		heightMeters,
	}] = createTextureFromResource({ src, codename, codenameStartsWith });

	const geometry = new PlaneGeometry(widthMeters * upscale, heightMeters * upscale);

	const MaterialToUse = shouldMakeLessAffectedByLight ? MeshStandardMaterial : MeshPhongMaterial;
	const isPhongMaterial = MaterialToUse === MeshPhongMaterial;
	const isStandardgMaterial = MaterialToUse === MeshStandardMaterial;

	const extraArgs
		= isPhongMaterial ? { shininess: 0 }
		: isStandardgMaterial ? {}
		: {};

	const material = new MaterialToUse({
		map: texture,
		transparent: true,
		side: DoubleSide,
		...extraArgs,
		color: shouldMakeLessAffectedByLight
			? 0x808080
			: undefined,
	});
	const plantSprite = new Mesh(geometry, material);

	plantSprite.position.set(0, 0, 0);

	return plantSprite;
}
