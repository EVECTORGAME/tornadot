import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
} from 'three';

const FOV = 75;
const CAMERA_FRUSTRUM_NEAR_PLANE = 0.1;
const CAMERA_FRUSTRUM_FAR_PLANE = 1000;

export default function createScene() {
	const { innerWidth, innerHeight } = window;
	const aspectRatio = innerWidth / innerHeight;
	const scene = new Scene();
	const camera = new PerspectiveCamera(
		FOV,
		aspectRatio,
		CAMERA_FRUSTRUM_NEAR_PLANE,
		CAMERA_FRUSTRUM_FAR_PLANE,
	);

	const renderer = new WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.y = 2;
	camera.position.z = -5;

	camera.rotation.set(0, Math.PI, 0);

	const entities = [];

	return {
		entities,
		add(entity) {
			entities.push(entity);
			scene.add(entity.model);
			// chronos.add(entity);
		},
		render() {
			renderer.render(scene, camera);
		},
	};
}
