import {
	PerspectiveCamera,
	Group,
} from 'three';
// import { PointerLockControls } from 'threePointerLockControls';
import utilClamp from '../utils/utilClamp.js';
import {
	CAMERA_POSITION_Y,
	CAMERA_POSITION_Z,
	MOUSE_Y_SPEED_FACTOR,
} from '../config.js';

const FOV = 75; // TODO config.js
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = 1000;
const PI_HALF = Math.PI * 0.5;
const minPolarAngle = Math.PI * 0.25; // radians
const maxPolarAngle = Math.PI * 0.75; // radians

export default function createCamera({ playerEntity }) { // TODO rename following camera
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

	document.addEventListener('click', () => {
		document.body.requestPointerLock();
	});

	document.body.addEventListener('mousemove', ({ movementY }) => { // TODO add destroy
		const newRotationX = camera.rotation.x - movementY * MOUSE_Y_SPEED_FACTOR * -1;
		const newRotationClampedX = utilClamp(newRotationX, PI_HALF - maxPolarAngle, PI_HALF - minPolarAngle);

		camera.rotation.x = newRotationClampedX;
	});

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

			/* Smooth position
				const currentRotation = group.rotation.y;
				const rotationDiff = Math.abs(group.rotation.y - playerEntity.model.rotation.y);
				if (rotationDiff > 0.001) {
					group.rotation.y = MathUtils.lerp(currentRotation, playerEntity.model.rotation.y, 0.05);
				} else {
					group.rotation.y = playerEntity.model.rotation.y;
				}
			*/

			group.rotation.y = playerEntity.model.rotation.y;

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
