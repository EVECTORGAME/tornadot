import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
} from 'three';

export default function createScene() {
	const scene = new Scene();
	const camera = new PerspectiveCamera(
		75, // fov
		window.innerWidth / window.innerHeight, // aspectRatio
		0.1, // camera frustum near plane.
		1000, // camera frustum near plane.
	);

	const renderer = new WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.z = 5;

	function animate() {
		window.requestAnimationFrame(animate);

		renderer.render(scene, camera);
	}

	animate();

	return [scene, {}];
}
