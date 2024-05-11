import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	Vector3,
} from 'three';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import { createQuad } from '../modules/createResource.js';
import { COLOR_GREEN } from '../config.js';

export default function createSmallPlant({ x, z }) {
	const textureLoader = new TextureLoader();
	const count = utilRandomValueMinMax(1, 3);
	const billboards = [];

	const group = new Group();
	for (let i = 1; i <= count; i++) {
		const subGroup = new Group();

		const metalTexture = textureLoader.load('./spritesheets/ditrheredBase.png');
		metalTexture.minFilter = NearestFilter;
		metalTexture.magFilter = NearestFilter;
		metalTexture.wrapS = RepeatWrapping;
		metalTexture.wrapT = RepeatWrapping;
		metalTexture.repeat.set(0.5, 0.5);

		const plantSprite = createQuad({ codenameStartsWith: 'small-plant-', shouldMakeLessAffectedByLight: 2, upscale: 2 });
		plantSprite.position.set(0, 1.4, 0);
		billboards.push(plantSprite);
		subGroup.add(plantSprite);

		const geometry = new SphereGeometry(1);
		const material = new MeshPhongMaterial({ map: metalTexture, color: COLOR_GREEN, shininess: 0 });
		const sphere = new Mesh(geometry, material);

		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180; // TODO util
		const range = (i - 1) * 0.5;
		const positionForward = range * Math.cos(randomDegreesInRadians);
		const positionRight = range * Math.sin(randomDegreesInRadians);

		sphere.position.set(0, 0, 0);

		subGroup.position.set(positionForward, 0, positionRight);
		subGroup.add(sphere);

		group.add(subGroup);
	}

	group.position.set(x, 0, z);

	return {
		type: createSmallPlant,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds, _, cameraPosition) { // eslint-disable-line no-unused-vars
			const direction = new Vector3();
			direction.subVectors(group.position, cameraPosition).normalize();
			const angle = Math.atan2(direction.x, direction.z);
			for (let i = 0; i < billboards.length; i += 1) {
				billboards[i].rotation.y = angle;
			}

			return {};
		},
	};
}
