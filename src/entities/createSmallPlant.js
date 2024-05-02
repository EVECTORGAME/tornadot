import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	SpriteMaterial,
	Sprite,
	CanvasTexture,
} from 'three';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import createSprite from '../textures/createSprite.js';
import { COLOR_GREEN } from '../config.js';

export default function createSmallPlant({ x, z }) {
	const textureLoader = new TextureLoader();
	const count = utilRandomValueMinMax(1, 3);

	const group = new Group();
	for (let i = 1; i <= count; i++) {
		const subGroup = new Group();

		const metalTexture = textureLoader.load('./textures/ditrheredBase.png');
		metalTexture.minFilter = NearestFilter;
		metalTexture.magFilter = NearestFilter;
		metalTexture.wrapS = RepeatWrapping;
		metalTexture.wrapT = RepeatWrapping;
		metalTexture.repeat.set(0.5, 0.5);

		const sprite = createSprite({ codenameStartsWith: 'small-plant-' });
		const plantTexture = new CanvasTexture(sprite.getCanvas());
		plantTexture.minFilter = NearestFilter;
		plantTexture.magFilter = NearestFilter;
		const plantMaterial = new SpriteMaterial({ map: plantTexture });
		const plantSprite = new Sprite(plantMaterial);
		plantSprite.scale.set(1, 1, 0);
		plantSprite.position.set(0, 1.4, 0);
		subGroup.add(plantSprite);

		const geometry = new SphereGeometry(1);
		const material = new MeshBasicMaterial({ map: metalTexture, color: COLOR_GREEN });
		const sphere = new Mesh(geometry, material);

		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180; // TODO util
		const range = (i - 1) * 0.5;
		const positionForward = range * Math.cos(randomDegreesInRadians);
		const positionRight = range * Math.sin(randomDegreesInRadians);

		sphere.position.set(0, 0, 0);

		subGroup.position.set(positionForward, 0, positionRight);
		subGroup.add(sphere);

		group.add(subGroup);
	}

	group.position.set(x, 0, z);

	return {
		type: createSmallPlant,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
