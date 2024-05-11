import {
	CapsuleGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
	RepeatWrapping,
	DoubleSide,
} from 'three';
import { createTextureFromResource } from '../modules/createResource.js';
import { COLOR_GREEN } from '../config.js';

export default function createBaseOfMilki({ x, z }) {
	// const textureLoader = new TextureLoader();
	// const count = utilRandomValueMinMax(1, 3);

	const group = new Group();

	const metalTexture = createTextureFromResource({ codename: 'bars' });
	metalTexture.wrapS = RepeatWrapping;
	metalTexture.wrapT = RepeatWrapping;
	metalTexture.repeat.set(10, 10);

	const geometry = new CapsuleGeometry(2);
	const material = new MeshPhongMaterial({
		map: metalTexture,
		color: COLOR_GREEN,
		transparent: true,
		side: DoubleSide,
		shininess: 0,
	});
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 1, 0);
	group.add(sphere);

	group.position.set(x, 0, z);

	return {
		type: createBaseOfMilki,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
