import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
} from 'three';
import {
	COLOR_ACCENT,
} from '../config.js';

export default function createHugeRock({ x, z, radius }) {
	const geometry = new SphereGeometry(radius);
	const material = new MeshBasicMaterial({ color: '#606060' });
	const sphere = new Mesh(geometry, material);

	sphere.position.set(x, 0, z);

	return {
		type: createHugeRock,
		model: sphere,
		radius,
		handleTimeUpdate(timeDeltaTime) {
			//
		},
	};
}
