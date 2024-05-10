import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
} from 'three';
import { COLOR_ROCKS } from '../config.js';

export default function createHugeRock({ x, z, radius }) {
	const textureLoader = new TextureLoader();
	const metaLTexture = textureLoader.load('./textures/ditrheredBase.png');
	metaLTexture.minFilter = NearestFilter;
	metaLTexture.magFilter = NearestFilter;
	metaLTexture.wrapS = RepeatWrapping;
	metaLTexture.wrapT = RepeatWrapping;
	metaLTexture.repeat.set(10, 10);

	const geometry = new SphereGeometry(radius);
	const material = new MeshPhongMaterial({ map: metaLTexture, color: COLOR_ROCKS });
	const sphere = new Mesh(geometry, material);

	sphere.position.set(x, 0, z);

	return {
		type: createHugeRock,
		model: sphere,
		radius,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
