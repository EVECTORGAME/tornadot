import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
} from 'three';
import { COLOR_ROCKS } from '../config.js';
import { createMinimapSprite } from './utils.js';

export default function createHugeRock({ x, z, radius }) {
	const textureLoader = new TextureLoader();
	const texture = textureLoader.load('./spritesheets/ditrheredBase.png');
	texture.minFilter = NearestFilter;
	texture.magFilter = NearestFilter;
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(10, 10);

	const geometry = new SphereGeometry(radius);
	const material = new MeshPhongMaterial({ map: texture, color: COLOR_ROCKS, shininess: 0 });
	const sphere = new Mesh(geometry, material);

	sphere.position.set(x, 0, z);

	return {
		type: createHugeRock,
		model: sphere,
		radius,
		minimapSprite: createMinimapSprite('A'),
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
