import {
	Group,
	PointLight,
} from 'three';
import {
	MOUSE_X_SPEED_FACTOR,
} from '../config.js';
// import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import createFactorPlusMinus from '../factors/createFactorPlusMinus.js';
// import { createQuad } from '../modules/createResource.js';
import createRocket from './createRocket.js';
import createLevelEnd from './createLevelEnd.js';

export default function createPlayer({ onLevelEnded }) {
	const light = new PointLight(0xffffff, 10, 30);
	light.position.set(0, 2, 1);

	const group = new Group();
	group.add(light);

	const factorForwardBackward = createFactorPlusMinus({
		factorOfIncreasing: 8,
		factorOfDecreasing: 8,
		factorOfContring: 16,
	});

	const factorSidestepLeftRight = createFactorPlusMinus({
		factorOfIncreasing: 8,
		factorOfDecreasing: 8,
		factorOfContring: 16,
	});

	document.body.addEventListener('mousemove', ({ movementX }) => {
		group.rotation.y -= movementX * MOUSE_X_SPEED_FACTOR;
	});

	return {
		type: createPlayer,
		model: group,
		radius: 0.5,
		collidesWith(other) {
			if (other.type === createLevelEnd) {
				onLevelEnded();
			} else {
				factorForwardBackward.reverseAndMultiply(0.5);
				factorSidestepLeftRight.reverseAndMultiply(0.5);
			}
		},
		handleTimeUpdate(deltaTimeSeconds, {
			isForwardHolded,
			isBackwardHolded,
			isStepLeftHolded,
			isStepRightHolded,
			isActionPressed,
		}) {
			const forwardFactor = factorForwardBackward.update(deltaTimeSeconds, {
				shouldGoToMinus: isBackwardHolded,
				shouldGoToPlus: isForwardHolded,
			}) * (isForwardHolded ? 0.3 : 0.1);

			const sidestepFactor = factorSidestepLeftRight.update(deltaTimeSeconds, {
				shouldGoToMinus: isStepRightHolded,
				shouldGoToPlus: isStepLeftHolded,
			}) * 0.3;

			let entitiesToAddToScene;
			if (isActionPressed) {
				entitiesToAddToScene = [
					createRocket({
						x: group.position.x,
						z: group.position.z,
						rotation: group.rotation.y, // TODO reds to degreesm degrees to radds
						shooterEntity: this,
					}),
				];
			}

			return {
				moveForwardStep: forwardFactor,
				moveSidesStep: sidestepFactor,
				entitiesToAddToScene,
			};
		},
	};
}
