import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
} from 'three';

// TODO timeToLive

export default function createRocket({ x, z, rotation, shooterEntity }) {
	const group = new Group();
	const geometry = new SphereGeometry(0.2);
	const material = new MeshPhongMaterial({ color: '#ff0000', shininess: 0 });
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 0.5, 0);

	group.add(sphere);

	group.position.set(x, 0, z);
	group.rotation.y = rotation;

	let timeToLiveSeconds = 3;

	return {
		type: createRocket,
		model: group,
		radius: 1,
		shooterEntity,
		collidesWith(other) { // eslint-disable-line no-unused-vars
			return true;
		},
		handleTimeUpdate(deltaTimeSeconds) {
			timeToLiveSeconds -= deltaTimeSeconds;

			return {
				shouldDestroy: timeToLiveSeconds <= 0,
				moveForwardStep: deltaTimeSeconds * 9,
			};
		},
	};
}
