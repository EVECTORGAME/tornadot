import {
	MeshBasicMaterial,
	Mesh,
	Group,
	CircleGeometry,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
} from 'three';
import utilDegreesToRadians from '../utils/utilDegreesToRadians.js';
import { COLOR_LIGHT_BLUE } from '../config.js';

const MODULO = 6.2; // 6.2 dobrane empirycznie
const OCEAN_FLOOR_RADIUS = 50; // fog range
const OCEAN_FLOOR_SEGMENTS_COUNT = 32;

export default function createPlayer({ playerEntity }) {
	const textureLoader = new TextureLoader();
	const floorTexture = textureLoader.load('./textures/ditrheredBase.png');
	floorTexture.minFilter = NearestFilter;
	floorTexture.magFilter = NearestFilter;
	floorTexture.wrapS = RepeatWrapping;
	floorTexture.wrapT = RepeatWrapping;
	floorTexture.repeat.set(16, 16);

	const floorGeometry = new CircleGeometry(
		OCEAN_FLOOR_RADIUS,
		OCEAN_FLOOR_SEGMENTS_COUNT,
	);
	// const floorMaterial = new MeshBasicMaterial({ color: COLOR_LIGHT_BLUE });
	const floorMaterial = new MeshBasicMaterial({ map: floorTexture, color: COLOR_LIGHT_BLUE });
	const floor = new Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = utilDegreesToRadians(-90);
	floor.position.set(0, 0, 0);

	const group = new Group();
	group.add(floor);

	return {
		type: createPlayer,
		model: group,
		radius: undefined,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			const playerPosition = playerEntity.model.position;

			const positionX = playerPosition.x - (playerPosition.x % MODULO);
			const positionZ = playerPosition.z - (playerPosition.z % MODULO);

			group.position.set(positionX, 0, positionZ);

			return {
				// moveForwardStep: forwardFactor,
				// moveSidesStep: sidestepFactor,
				// rotationStep: rotatingFactor,
			};
		},
	};
}