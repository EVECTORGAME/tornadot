import {
	Scene,
	WebGLRenderer,
	Fog,
} from 'three';
import {
	COLOR_DARK_BLUE,
} from '../config.js';

export default function createScene({ camera }) {
	const scene = new Scene();
	scene.fog = new Fog(COLOR_DARK_BLUE, 10, 55);

	const renderer = new WebGLRenderer();
	renderer.setClearColor(COLOR_DARK_BLUE, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const entities = [];

	return {
		destroy() {
			renderer.domElement.parentElement.removeChild(renderer.domElement);
		},
		entities,
		findClosestEntityToObject({ forward, right, radius }, excludeEntity) {
			return entities.filter((entity) => {
				const isEmptySlot = !entity;
				if (isEmptySlot) {
					return false;
				}

				const isNotItself = entity !== excludeEntity;
				const isNotShootedBySubject = excludeEntity ? entity.shooterEntity !== excludeEntity : true;

				return isNotItself && isNotShootedBySubject;
			}).filter(other => other.radius > 0).reduce((stack, otherEntity) => {
				const {
					model: otherModel,
					radius: otherRadius,
				} = otherEntity;
				const otherForward = otherModel.position.x;
				const otherRight = otherModel.position.z;

				// const forwardDifference = Math.abs(forward - otherForward);
				// const rightDifference = Math.abs(right - otherRight);
				const radiusesCombined = otherRadius + radius;

				const distanceForward = forward - otherForward;
				const distanceRight = right - otherRight;
				const distanceFromCenters = Math.abs(
					Math.sqrt(distanceForward ** 2 + distanceRight ** 2),
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
			// TODO search for forst empty slot
			entities.push(entity);
			scene.add(entity.model);
		},
		removeEntityAdnItsReferencesentity(entityToRemove) {
			for (let i = 0; i < entities.length; i += 1) {
				const entity = entities[i];
				if (entity) {
					if (entity.shooterEntity === entityToRemove) {
						entity.shooterEntity = undefined;
					}
				}

				if (entity === entityToRemove) {
					scene.remove(entityToRemove.model);

					entities[i] = undefined;
				}
			}
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
