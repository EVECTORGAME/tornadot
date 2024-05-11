import {
	Group,
	TextureLoader,
	SpriteMaterial,
	Sprite,
} from 'three';
import createResource from '../modules/createResource.js';
import createSpritesheet from '../spritesheets/createSprite2.js';

export default function createAndromalius({ x, z }) {
	const [src] = createSpritesheet();

	const group = new Group();

	const map = new TextureLoader().load(src);
	map.repeat.x = 1 / 8;
	map.repeat.y = 1 / 3;
	const material = new SpriteMaterial({ map });

	const sprite = new Sprite(material);

	const plantSprite = createResource({ codenameStartsWith: 'small-plant-' });
	plantSprite.position.set(0, 1.4, 0);
	group.add(plantSprite);
	group.position.set(x, 2, z);
	group.scale.set(3, 3, 0);

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
