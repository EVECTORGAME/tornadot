import {
	PerspectiveCamera,
	Group,
	MathUtils,
} from 'three';
import {
	CAMERA_POSITION_Y,
	CAMERA_POSITION_Z,
} from '../config.js';

const FOV = 75;
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = 1000;

export default function createCamera({ playerEntity }) {
	const { innerWidth, innerHeight } = window;
	const aspectRatio = innerWidth / innerHeight;

	const camera = new PerspectiveCamera(
		FOV,
		aspectRatio,
		CAMERA_FRUSTRUM_NEAR_PLANE,
		CAMERA_FRUSTRUM_FAR_PLANE,
	);
	camera.position.y = CAMERA_POSITION_Y;
	camera.position.z = CAMERA_POSITION_Z;

	camera.rotation.set(0, Math.PI, 0);

	const group = new Group();
	group.add(camera);

	return {
		type: createCamera,
		model: group,
		camera,
		radius: 0,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			group.position.set(
				playerEntity.model.position.x,
				playerEntity.model.position.y,
				playerEntity.model.position.z,
			);
			// Oblicz wektor kierunku między obiektami

			// const direction = new Vector3().subVectors(playerEntity.model.position, group.position).normalize();
			//
			// const constantVelocity = 7;
			//
			// let distanceToMove = deltaTimeSeconds * constantVelocity;
			//
			// const distanceToTarget = group.position.distanceTo(playerEntity.model.position);
			// if (distanceToMove > distanceToTarget) {
			// 	distanceToMove = distanceToTarget;
			// }
			//
			// group.position.lerp(group.position.clone().add(direction.multiplyScalar(distanceToMove)), 1);

			const currentRotation = group.rotation.y;
			const rotationDiff = Math.abs(group.rotation.y - playerEntity.model.rotation.y);
			if (rotationDiff > 0.001) {
				group.rotation.y = MathUtils.lerp(currentRotation, playerEntity.model.rotation.y, 0.05);
			} else {
				group.rotation.y = playerEntity.model.rotation.y;
			}

			return {};
		},
		/* collidesWith(other) {
			if (other.type === createLevelEnd) {
				onLevelEnded();
				console.log('>> levelend', other);
			} else {
				console.log('>> collidesWith', other);
			}
		}, */
	};
}
