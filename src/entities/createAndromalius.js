import {
	SphereGeometry,
	MeshPhongMaterial ,
	Mesh,
	Group,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	SpriteMaterial,
	Sprite,
} from 'three';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import createSprite from '../textures/createSprite.js';
import createSpritesheet from '../modules/createSprite.js';
import { COLOR_GREEN } from '../config.js';

export default function createAndromalius({ x, z }) {
	// const textureLoader = new TextureLoader();
	// const count = utilRandomValueMinMax(1, 3);

	const [src, {
		canvasWidth,
		canvasHeight,
		tileWidth,
		tileHeight,
	}] = createSpritesheet();

	const group = new Group();

	const map = new TextureLoader().load( src);
	map.repeat.x = 1 / 8;
	map.repeat.y = 1 / 3;
	const material = new SpriteMaterial( { map: map } );

	const sprite = new Sprite(material);
	// scene.add( sprite );

	const plantSprite = createSprite({ codenameStartsWith: 'small-plant-' });
	plantSprite.position.set(0, 1.4, 0);
	group.add(plantSprite);
	group.position.set(x, 2, z);
	group.scale.set(3, 3, 0);

	// const geometry = new SphereGeometry(1);
	// const material = new MeshPhongMaterial({ color: COLOR_GREEN });
	// const sphere = new Mesh(geometry, material);
	// group.add(sphere);
	group.add(sprite);
	return {
		type: createAndromalius,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
