import {
	PerspectiveCamera,
	Group,
	Vector3,
	Quaternion,
} from 'three';

const FOV = 75; // TODO config.js
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = 1000;

export default function createCamera({ playerEntity }) { // TODO rename following camera
	const { innerWidth, innerHeight } = window;
	const aspectRatio = innerWidth / innerHeight;

	const camera = new PerspectiveCamera(
		FOV,
		aspectRatio,
		CAMERA_FRUSTRUM_NEAR_PLANE,
		CAMERA_FRUSTRUM_FAR_PLANE,
	);

	document.addEventListener('click', () => { // TO raczej do gry
		document.body.requestPointerLock();
	});

	const cameraHolder = new Group();
	cameraHolder.add(camera);

	const group = new Group();
	group.add(cameraHolder);

	const tempTargetPosition = new Vector3();
	const tempTargetRotation = new Quaternion();

	return {
		type: createCamera,
		model: cameraHolder,
		camera,
		radius: 0,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			playerEntity.refEyes.getWorldPosition(tempTargetPosition);
			playerEntity.refEyes.getWorldQuaternion(tempTargetRotation);

			cameraHolder.position.copy(tempTargetPosition);
			cameraHolder.quaternion.copy(tempTargetRotation);

			/* Smooth position
				const currentRotation = group.rotation.y;
				const rotationDiff = Math.abs(group.rotation.y - playerEntity.model.rotation.y);
				if (rotationDiff > 0.001) {
					group.rotation.y = MathUtils.lerp(currentRotation, playerEntity.model.rotation.y, 0.05);
				} else {
					group.rotation.y = playerEntity.model.rotation.y;
				}
			*/

			group.rotation.y = playerEntity.model.rotation.y + Math.PI;
			// camera.position.z = CAMERA_POSITION_Z;
			// cameraHolder.position.y = CAMERA_POSITION_Y;

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
