import {
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	ConeGeometry,
} from 'three';
import {
	COLOR_ACCENT,
} from '../config.js';
import createLevelEnd from './createLevelEnd.js';

export default function createPlayer({ onLevelEnded }) {
	const geometry = new BoxGeometry(1, 1, 1);
	const material = new MeshBasicMaterial({ color: COLOR_ACCENT });
	const cube = new Mesh(geometry, material);

	const engineGeometry = new BoxGeometry(0.5, 0.5, 0.5);
	const engineMaterial = new MeshBasicMaterial({ color: 0xff00000 });
	const engineMesh = new Mesh(engineGeometry, engineMaterial);
	engineMesh.position.set(0, 0, -0.5);

	const antenaGeometry = new ConeGeometry(0.1, 2, 3);
	const antenaMaterial = new MeshBasicMaterial({ color: 0x000000 });
	const cone = new Mesh(antenaGeometry, antenaMaterial);
	cone.position.set(0, 1, 0);

	const group = new Group();
	group.add(cube);
	group.add(engineMesh);
	group.add(cone);

	return {
		type: createPlayer,
		model: group,
		radius: 0.5,
		collidesWith(other) {
			if (other.type === createLevelEnd) {
				onLevelEnded();
				console.log('>> levelend', other);
			} else {
				console.log('>> collidesWith', other);
			}
		},
	};
}
