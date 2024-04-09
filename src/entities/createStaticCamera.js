import {
	PerspectiveCamera,
	Group,
} from 'three';
import {
	CAMERA_POSITION_Y,
	CAMERA_POSITION_Z,
} from '../config.js';

const FOV = 75;
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = 1000;

export default function createStaticCamera() {
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
		type: createStaticCamera,
		model: group,
		camera,
		radius: 0,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			group.rotation.y += deltaTimeSeconds;
			//
		},
	};
}
