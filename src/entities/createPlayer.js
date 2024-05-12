import {
	Group,
	PointLight,
	Vector3,
} from 'three';
import {
	MOUSE_X_SPEED_FACTOR,
	MOUSE_Y_SPEED_FACTOR,
} from '../config.js';
import createFactorPlusMinus from '../factors/createFactorPlusMinus.js';
import createWeaponSwayFactor from '../factors/createWeaponSwayFactor.js';
import createBobingFactor from '../factors/createBobingFactor.js';
import { createQuad } from '../modules/createResource.js';
import utilClamp from '../utils/utilClamp.js';
import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import createRocket from './createRocket.js';
import createLevelEnd from './createLevelEnd.js';

const PI_HALF = Math.PI * 0.5;
const minPolarAngle = Math.PI * 0.25; // radians // uproscic
const maxPolarAngle = Math.PI * 0.75; // radians

export default function createPlayer({ onLevelEnded }) {
	const light = new PointLight(0xffffff, 5, 30, 0);
	light.position.set(0, 2, 1);

	const spear = createQuad({ codename: 'spear', upscale: 1 });
	spear.rotation.x = utilDegreesToRadians(-70); // make point forward
	spear.rotation.y = utilDegreesToRadians(-45); // pochyl w kierunku gracza
	spear.rotation.z = utilDegreesToRadians(10); // make point a little bit to the center of the screen in horizontal axis
	spear.position.set(0.6, -0.5, -1); // move right, move down, move forward
	spear.material.depthTest = false;
	spear.material.depthWrite = false;

	const weaponSwayer = new Group();
	weaponSwayer.add(spear);

	const weaponBobing = new Group();
	weaponBobing.add(weaponSwayer);

	const refEyes = new Group();

	const head = new Group();
	head.add(refEyes);

	const neck = new Group();
	neck.position.set(0, 1.8, 0);
	neck.add(head);
	neck.add(weaponBobing);

	const body = new Group();
	body.rotation.y = utilDegreesToRadians(180);
	body.add(light);
	body.add(neck);

	const shoes = new Group();
	shoes.add(body);

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

	const bobingFactor = createBobingFactor({
		amplitude: 0.1,
		frequency: 30,
		resetingPositionSpeed: 10,
	});
	const weaponSwayFactor = createWeaponSwayFactor({
		multiplier: 6,
		smooth: 0.1,
	});
	document.body.addEventListener('mousemove', ({ movementX, movementY }) => { // TODO add destroy
		const factorOfMovementX = movementX / window.innerWidth;
		const factorOfMovementY = movementY / window.innerHeight;

		weaponSwayFactor.accumulateFactorXY(factorOfMovementX, factorOfMovementY);

		shoes.rotation.y -= movementX * MOUSE_X_SPEED_FACTOR;

		const newRotationX = neck.rotation.x - movementY * MOUSE_Y_SPEED_FACTOR * -1;
		const newRotationClampedX = utilClamp(newRotationX, PI_HALF - maxPolarAngle, PI_HALF - minPolarAngle);

		neck.rotation.x = newRotationClampedX;
	}, false);

	return {
		type: createPlayer,
		model: shoes,
		radius: 0.5,
		refEyes,
		collidesWith(other) {
			if (other.type === createLevelEnd) {
				onLevelEnded();
			} else {
				factorForwardBackward.clear();
				factorSidestepLeftRight.clear();
			}
		},
		handleTimeUpdate(deltaTimeSeconds, {
			isForwardHolded,
			isBackwardHolded,
			isStepLeftHolded,
			isStepRightHolded,
			isActionPressed,
		}) {
			weaponSwayFactor.update(weaponSwayer);

			const forwardFactor = factorForwardBackward.update(deltaTimeSeconds, {
				shouldGoToMinus: isBackwardHolded,
				shouldGoToPlus: isForwardHolded,
			}) * (isForwardHolded ? 0.3 : 0.1);

			const shouldBob = isForwardHolded || isStepRightHolded || isStepLeftHolded;
			bobingFactor.update(head, shouldBob, deltaTimeSeconds);

			const sidestepFactor = factorSidestepLeftRight.update(deltaTimeSeconds, {
				shouldGoToMinus: isStepRightHolded,
				shouldGoToPlus: isStepLeftHolded,
			}) * 0.3;

			let entitiesToAddToScene;
			if (isActionPressed) {
				entitiesToAddToScene = [
					createRocket({
						x: body.position.x,
						z: body.position.z,
						rotation: body.rotation.y, // TODO reds to degreesm degrees to radds
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
