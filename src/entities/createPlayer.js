import {
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	ConeGeometry,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
} from 'three';
import {
	COLOR_ACCENT,
	COLOR_RED,
} from '../config.js';
import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import createFactorPlusMinus from '../factors/createFactorPlusMinus.js';
import { createQuad } from '../textures/createSprite.js';
import createRocket from './createRocket.js';
import createLevelEnd from './createLevelEnd.js';

export default function createPlayer({ onLevelEnded }) {
	const textureLoader = new TextureLoader();

	const geometry = new BoxGeometry(1, 1, 1);
	const metaLTexture = textureLoader.load('./textures/ditrheredBase.png');
	metaLTexture.minFilter = NearestFilter;
	metaLTexture.magFilter = NearestFilter;
	metaLTexture.wrapS = RepeatWrapping;
	metaLTexture.wrapT = RepeatWrapping;
	metaLTexture.repeat.set(0.5, 0.5);
	const material = new MeshBasicMaterial({ map: metaLTexture, color: COLOR_ACCENT });
	const cube = new Mesh(geometry, material);
	cube.position.set(0, 0.5, 0);

	const engineGeometry = new BoxGeometry(0.5, 0.5, 0.5);
	const engineMaterial = new MeshBasicMaterial({ color: COLOR_RED });
	const engineMesh = new Mesh(engineGeometry, engineMaterial);
	engineMesh.position.set(0, 0.5, -0.5);

	const antenaGeometry = new ConeGeometry(0.1, 2, 3);
	const antenaMaterial = new MeshBasicMaterial({ color: 0x000000 });
	const cone = new Mesh(antenaGeometry, antenaMaterial);
	cone.rotation.x = utilDegreesToRadians(-30);
	cone.position.set(0, 1, -0.5);

	const propelerSprite = createQuad({ codename: 'propeler-1-off' });
	propelerSprite.rotation.x = utilDegreesToRadians(180);
	propelerSprite.position.set(0, 0.5, -0.8);

	const group = new Group();
	group.add(cube);
	group.add(engineMesh);
	group.add(cone);
	group.add(propelerSprite);

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
