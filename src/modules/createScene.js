import {
	Scene,
	WebGLRenderer,
	Fog,
	// AmbientLight,
} from 'three';
import { RENDERING_DISTANCE } from '../config.js';

export default function createScene({ camera, minimapElement }) {
	const scene = new Scene();
	scene.fog = new Fog(0x000000,
		RENDERING_DISTANCE * 0.8,
		RENDERING_DISTANCE * 0.9,
	);

	// const light = new AmbientLight(0xffffff);
	// scene.add(light);

	const renderer = new WebGLRenderer();
	renderer.setClearColor(0x000000, 1);
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
		addEntity(entity) {
			// TODO search for first empty slot
			entities.push(entity);
			scene.add(entity.model);

			if (entity.minimapSprite) {
				minimapElement.appendChild(entity.minimapSprite);
			}
		},
		addThreeObject(object) {
			scene.add(object);
		},
		refreshEntityPositionOnMinimap(entity) {
			const MAP_SIZE = 1000;
			const MAP_CENTER = MAP_SIZE * 0.5;
			if (entity.minimapSprite) {
				entity.minimapSprite.style.left = `${(1 - ((entity.model.position.x + MAP_CENTER) / MAP_SIZE)) * 100}%`;
				entity.minimapSprite.style.top = `${(1 - ((entity.model.position.z + MAP_CENTER) / MAP_SIZE)) * 100}%`;
			}
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

					if (entityToRemove.minimapSprite) {
						minimapElement.removeChild(entityToRemove.minimapSprite);
					}

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
