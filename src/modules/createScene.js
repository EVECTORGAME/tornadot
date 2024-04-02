import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Fog,
} from 'three';
import {
	COLOR_DARK_BLUE,
	CAMERA_POSITION_Y,
	CAMERA_POSITION_Z,
} from '../config.js';

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
	renderer.setClearColor(COLOR_DARK_BLUE, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	scene.fog = new Fog(COLOR_DARK_BLUE, 10, 55);
	camera.position.y = CAMERA_POSITION_Y;
	camera.position.z = CAMERA_POSITION_Z;

	camera.rotation.set(0, Math.PI, 0);

	const entities = [];

	return {
		entities,
		camera,
		add(entity) {
			entities.push(entity);
			scene.add(entity.model);
		},
		render() {
			renderer.render(scene, camera);
		},
		addPosionToObjectAtIndex(subjectEntity, forwardMovement) {
			const rotationRadians = subjectEntity.model.rotation.y;
			const newForward = subjectEntity.model.position.x + forwardMovement * Math.sin(rotationRadians);
			const newRight = subjectEntity.model.position.z + forwardMovement * Math.cos(rotationRadians);

			const colidesWith = entities.filter(entity => entity !== subjectEntity).filter(other => other.radius > 0).find(({
				model: otherModel,
				radius: otherRadius,
			}) => {
				const otherForward = otherModel.position.x;
				const otherRight = otherModel.position.z;

				const forwardDifference = Math.abs(newForward - otherForward);
				const rightDifference = Math.abs(newRight - otherRight);
				const radiusesCombined = otherRadius + subjectEntity.radius;
				const isSeemsClose = forwardDifference < radiusesCombined && rightDifference < radiusesCombined;

				return isSeemsClose;
			});

			const canGo = colidesWith
				? subjectEntity.collidesWith(colidesWith)
				: true;

			if (canGo) {
				subjectEntity.model.position.set(newForward, 0, newRight);
			}
		},
	};
}
