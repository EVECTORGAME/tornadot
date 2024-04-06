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
	scene.fog = new Fog(COLOR_DARK_BLUE, 10, 55);

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
	camera.position.y = CAMERA_POSITION_Y;
	camera.position.z = CAMERA_POSITION_Z;

	camera.rotation.set(0, Math.PI, 0);

	const entities = [];

	return {
		destroy() {
			renderer.domElement.parentElement.removeChild(renderer.domElement);
		},
		entities,
		camera,
		findClosestEntityToObject({ forward, right, radius }, excludeEntity) {
			return entities.filter(entity => entity !== excludeEntity).filter(other => other.radius > 0).reduce((stack, otherEntity) => {
				const {
					model: otherModel,
					radius: otherRadius,
				} = otherEntity;
				const otherForward = otherModel.position.x;
				const otherRight = otherModel.position.z;

				// const forwardDifference = Math.abs(forward - otherForward);
				// const rightDifference = Math.abs(right - otherRight);
				const radiusesCombined = otherRadius + radius;

				const distanceFromCenters = Math.abs(
					Math.sqrt(
						Math.pow(forward - otherForward, 2)
						+ Math.pow(right - otherRight, 2)
					),
				);

				const distanceBetween = distanceFromCenters - radiusesCombined;

				if (stack) {
					if (distanceBetween < stack.distanceBetween) {
						return {
							distanceBetween,
							entity: otherEntity,
						};
					}
				} else {
					return {
						distanceBetween,
						entity: otherEntity,
					};
				}

				return stack;
			}, undefined);
		},
		add(entity) {
			entities.push(entity);
			scene.add(entity.model);
		},
		render() {
			renderer.render(scene, camera);
		},
		addPosionToObjectAtIndex(subjectEntity, forwardMovement, rotationOffset) {
			const rotationRadians = subjectEntity.model.rotation.y + rotationOffset;
			const newForward = subjectEntity.model.position.x + forwardMovement * Math.sin(rotationRadians);
			const newRight = subjectEntity.model.position.z + forwardMovement * Math.cos(rotationRadians);

			const closestEntity = this.findClosestEntityToObject({
				forward: newForward,
				right: newRight,
				radius: subjectEntity.radius,
			}, subjectEntity);

			const colidesWith = closestEntity.distanceBetween < 0
				? closestEntity.entity
				: undefined;

			const canGo = colidesWith
				? subjectEntity.collidesWith(colidesWith)
				: true;

			if (canGo) {
				subjectEntity.model.position.set(newForward, 0, newRight);
			}
		},
	};
}
