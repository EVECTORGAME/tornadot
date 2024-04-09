import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
} from 'three';
import {
	COLOR_ACCENT,
} from '../config.js';

export default function createLevelEnd({ x, z }) {
	const geometry = new SphereGeometry(1);
	const material = new MeshBasicMaterial({ color: COLOR_ACCENT });
	const sphere = new Mesh(geometry, material);

	sphere.position.set(x, 0, z);

	return {
		type: createLevelEnd,
		model: sphere,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
