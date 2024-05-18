import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
} from 'three';

// TODO timeToLive

export default function createAimer({ shooterEntity }) {
	const group = new Group();
	const geometry = new SphereGeometry(0.2);
	const material = new MeshPhongMaterial({ color: '#00ff00', shininess: 0 });
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 0, 0);

	group.add(sphere);

	// group.position.set(x, 0, z);
	// group.rotation.y = rotation;

	let timeToLiveSeconds = 3;

	return {
		type: createAimer,
		model: group,
		radius: undefined,
		// shooterEntity,
		XcollidesWith(other) { // eslint-disable-line no-unused-vars
			return true;
		},
		XhandleTimeUpdate(deltaTimeSeconds) {
			timeToLiveSeconds -= deltaTimeSeconds;

			return {
				shouldDestroy: timeToLiveSeconds <= 0,
				moveForwardStep: deltaTimeSeconds * 9,
			};
		},
	};
}
