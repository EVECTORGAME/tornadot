import {
	PerspectiveCamera,
	Group,
	Vector3,
	Quaternion,
} from 'three';
import { RENDERING_DISTANCE } from '../config.js';

const FOV = 75; // TODO config.js
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = RENDERING_DISTANCE;

export default function createCamera({ aimerEntity, playerEntity }) { // TODO rename following camera
	const { innerWidth, innerHeight } = window;
	const aspectRatio = innerWidth / innerHeight;

	const camera = new PerspectiveCamera(
		FOV,
		aspectRatio,
		CAMERA_FRUSTRUM_NEAR_PLANE,
		CAMERA_FRUSTRUM_FAR_PLANE,
	);

	document.addEventListener('click', () => { // TO raczej do gry?
		document.body.requestPointerLock();
	});

	const cameraHolder = new Group();
	cameraHolder.add(camera);

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

			{ // set aimer position
				const forwardVector = new Vector3(0, 0, -1); // new Vector3(0, 0, -1); // Assuming initial forward direction is along negative z-axis
				forwardVector.applyQuaternion(cameraHolder.quaternion); // Rotate the vector according to the object's rotation
				const distanceToY0Plane = cameraHolder.position.y / forwardVector.y; // Step 2: Calculate the distance from the object's current position to the Y=0 plane along the forward direction
				const intersectionPoint = cameraHolder.position.clone().add(forwardVector.clone().multiplyScalar(-distanceToY0Plane)); // Step 3: Calculate the intersection point
				aimerEntity.model.position.x = intersectionPoint.x;
				aimerEntity.model.position.y = intersectionPoint.y;
				aimerEntity.model.position.z = intersectionPoint.z;
			}

			return {};
		},
	};
}
