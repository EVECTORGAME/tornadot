import {
	CircleGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
} from 'three';
import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import { COLOR_GREEN } from '../config.js';

export default function createDemoHolder({ x, z }) {
	const textureLoader = new TextureLoader();
	const texture = textureLoader.load('./textures/ditrheredBase.png');
	texture.minFilter = NearestFilter;
	texture.magFilter = NearestFilter;
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(10, 10);

	const geometry = new CircleGeometry(
		3, // radius
		32, // segments
	);

	const material = new MeshBasicMaterial({ map: texture, color: COLOR_GREEN });
	const sphere = new Mesh(geometry, material);

	sphere.position.set(x, 0.01, z);
	sphere.rotation.x = utilDegreesToRadians(-90);

	const group = new Group();
	group.add(sphere);

	group.position.set(x, 0, z);

	return {
		type: createDemoHolder,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
		replaceElement(entity) {
			group.add(entity);
		},
	};
}
