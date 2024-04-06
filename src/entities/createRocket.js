import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
} from 'three';

// TODO timeToLive

export default function createRocket({ x, z, rotation, shooterEntity }) {
	const group = new Group();
	const geometry = new SphereGeometry(0.2);
	const material = new MeshBasicMaterial({ color: '#ff0000' });
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 0.5, 0);

	group.add(sphere);

	group.position.set(x, 0, z);
	group.rotation.y = rotation;

	return {
		type: createRocket,
		model: group,
		radius: 1,
		shooterEntity,
		collidesWith(other) { // should explode
			return true;
		},
		handleTimeUpdate(timeDeltaTime) {
			//

			return {
				moveForward: timeDeltaTime * 0.01,
			};
		},
	};
}
