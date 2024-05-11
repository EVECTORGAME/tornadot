import {
	PerspectiveCamera,
	Group,
} from 'three';

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
	camera.position.y = 2;
	camera.position.z = -2;

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
