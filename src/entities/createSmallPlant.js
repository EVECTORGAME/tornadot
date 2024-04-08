import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
} from 'three';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import {
	COLOR_ACCENT,
} from '../config.js';

export default function createSmallPlant({ x, z }) {
	const count = utilRandomValueMinMax(1, 3);

	const group = new Group();
	for (let i = 1; i <= count; i++) {
		const geometry = new SphereGeometry(1);
		const material = new MeshBasicMaterial({ color: '#00ff00' });
		const sphere = new Mesh(geometry, material);

		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180;
		const range = (i - 1) * 0.5;
		const positionForward = range * Math.cos(randomDegreesInRadians);
		const positionRight = range * Math.sin(randomDegreesInRadians);

		sphere.position.set(positionForward, 0, positionRight);

		group.add(sphere);
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
