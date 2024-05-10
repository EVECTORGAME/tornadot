import {
	BoxGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
	ConeGeometry,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	PointLight,
} from 'three';
import {
	COLOR_BLACK,
} from '../config.js';
import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import createFactorPlusMinus from '../factors/createFactorPlusMinus.js';
import { createQuad } from '../textures/createSprite.js';
import createRocket from './createRocket.js';
import createLevelEnd from './createLevelEnd.js';

export default function createPlayer({ onLevelEnded }) {
	const textureLoader = new TextureLoader();

	const metalTexture = textureLoader.load('./textures/ditrheredBase.png');
	metalTexture.minFilter = NearestFilter;
	metalTexture.magFilter = NearestFilter;
	metalTexture.wrapS = RepeatWrapping;
	metalTexture.wrapT = RepeatWrapping;
	metalTexture.repeat.set(0.5, 0.5);

	const engineGeometry = new BoxGeometry(0.7, 0.3, 1.5);
	const engineMaterial = new MeshPhongMaterial({ color: COLOR_BLACK });
	const engineMesh = new Mesh(engineGeometry, engineMaterial);
	engineMesh.position.set(0, 0.4, 0);

	const antenaGeometry = new ConeGeometry(0.1, 2, 3);
	const antenaMaterial = new MeshPhongMaterial({ color: 0x000000 });
	const cone = new Mesh(antenaGeometry, antenaMaterial);
	cone.rotation.x = utilDegreesToRadians(-30);
	cone.position.set(0, 1, -0.5);

	const propelerSprite = createQuad({ codename: 'propeler-1-off' });
	propelerSprite.rotation.x = utilDegreesToRadians(180);
	propelerSprite.position.set(0, 0.2, -0.8);

	const sidePropelerSprite = createQuad({ codename: 'propeler-1-off' });
	sidePropelerSprite.rotation.y = utilDegreesToRadians(90);
	sidePropelerSprite.position.set(0, 1.2, 0);

	const tailPropelerSprite = createQuad({ codename: 'propeler-1-off' });
	tailPropelerSprite.rotation.y = utilDegreesToRadians(90);
	tailPropelerSprite.position.set(0, 0.2, -1);

	const light = new PointLight(0xffffff, 10, 100);
	light.position.set(1, 1, -2);

	const group = new Group();
	// group.add(cube);
	group.add(engineMesh);
	group.add(cone);
	group.add(propelerSprite);
	group.add(sidePropelerSprite);
	group.add(tailPropelerSprite);
	group.add(light);

	const factorForwardBackward = createFactorPlusMinus({
		factorOfIncreasing: 1,
		factorOfDecreasing: 0.5,
		factorOfContring: 3,
	});

	const factorSidestepLeftRight = createFactorPlusMinus({
		factorOfIncreasing: 0.5,
		factorOfDecreasing: 0.5,
		factorOfContring: 3,
	});

	const factorRotatingLeftRight = createFactorPlusMinus({
		factorOfIncreasing: 1,
		factorOfDecreasing: 1,
		factorOfContring: 3,
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
			isLeftHolded,
			isRightHolded,
			isForwardHolded,
			isBackwardHolded,
			isStepLeftHolded,
			isStepRightHolded,
			isActionPressed,
		}) {
			if (isForwardHolded) {
				propelerSprite.rotation.z -= deltaTimeSeconds * 30;
			} else if (isBackwardHolded) {
				propelerSprite.rotation.z += deltaTimeSeconds * 30;
			}

			if (isStepRightHolded) {
				sidePropelerSprite.rotation.z -= deltaTimeSeconds * 30;
			} else if (isStepLeftHolded) {
				sidePropelerSprite.rotation.z += deltaTimeSeconds * 30;
			}

			if (isRightHolded) {
				tailPropelerSprite.rotation.z -= deltaTimeSeconds * 30;
			} else if (isLeftHolded) {
				tailPropelerSprite.rotation.z += deltaTimeSeconds * 30;
			}

			const forwardFactor = factorForwardBackward.update(deltaTimeSeconds, {
				shouldGoToMinus: isBackwardHolded,
				shouldGoToPlus: isForwardHolded,
			}) * 0.5;

			const sidestepFactor = factorSidestepLeftRight.update(deltaTimeSeconds, {
				shouldGoToMinus: isStepRightHolded,
				shouldGoToPlus: isStepLeftHolded,
			}) * 0.5;

			const rotatingFactor = factorRotatingLeftRight.update(deltaTimeSeconds, {
				shouldGoToMinus: isRightHolded,
				shouldGoToPlus: isLeftHolded,
			}) * 0.2;

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
				rotationStep: rotatingFactor,
				entitiesToAddToScene,
			};
		},
	};
}
