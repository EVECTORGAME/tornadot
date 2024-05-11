import {
	CapsuleGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	DoubleSide,
} from 'three';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import { createTextureFromResource } from '../modules/createResource.js';
import { COLOR_GREEN } from '../config.js';

export default function createBaseOfMilki({ x, z }) {
	// const textureLoader = new TextureLoader();
	// const count = utilRandomValueMinMax(1, 3);

	const group = new Group();

	const metalTexture = createTextureFromResource({ codename: 'bars' });
	console.log('>> metalTexture', metalTexture);
	// textureLoader.load('./spritesheets/ditrheredBase.png');
	// metalTexture.minFilter = NearestFilter;
	// metalTexture.magFilter = NearestFilter;
	metalTexture.wrapS = RepeatWrapping;
	metalTexture.wrapT = RepeatWrapping;
	metalTexture.repeat.set(10, 10);

	const geometry = new CapsuleGeometry(2);
	const material = new MeshPhongMaterial({
		map: metalTexture,
		color: COLOR_GREEN,
		transparent: true,
		side: DoubleSide,
		shininess: 0,
	});
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 1, 0);
	group.add(sphere);

	/* for (let i = 1; i <= count; i++) {
		const subGroup = new Group();

		const plantSprite = createQuad({ codenameStartsWith: 'small-plant-', shouldMakeLessAffectedByLight: 2, upscale: 2 });
		plantSprite.position.set(0, 1.4, 0);
		subGroup.add(plantSprite);

		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180; // TODO util
		const range = (i - 1) * 0.5;
		const positionForward = range * Math.cos(randomDegreesInRadians);
		const positionRight = range * Math.sin(randomDegreesInRadians);

		sphere.position.set(0, 0, 0);

		subGroup.position.set(positionForward, 0, positionRight);
		subGroup.add(sphere);

		group.add(subGroup);
	} */

	group.position.set(x, 0, z);

	return {
		type: createBaseOfMilki,
		model: group,
		radius: 1,
		handleTimeUpdate(deltaTimeSeconds) { // eslint-disable-line no-unused-vars
			//

			return {};
		},
	};
}
