import {
	// SphereGeometry,
	MeshPhongMaterial,
	// Mesh,
	Group,
	// TextureLoader,
	RepeatWrapping,
	// NearestFilter,
	CylinderGeometry,
	DoubleSide,
	Vector3,
	Mesh,
} from 'three';
// import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
// import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import { createQuad, createTextureFromResource } from '../modules/createResource.js';
// import { COLOR_GREEN } from '../config.js';
import { createMinimapSprite } from './utils.js';

export default function createBaseOfWitch({ x, z }) {
	// const textureLoader = new TextureLoader();
	// const count = utilRandomValueMinMax(1, 3);
	// const billboards = [];

	// const metalTexture = textureLoader.load('./spritesheets/ditrheredBase.png');
	// metalTexture.minFilter = NearestFilter;
	// metalTexture.magFilter = NearestFilter;
	// metalTexture.wrapS = RepeatWrapping;
	// metalTexture.wrapT = RepeatWrapping;
	// metalTexture.repeat.set(0.5, 0.5);

	const plantSprite = createQuad({ src: 'entities/with/witch-2x2.png', shouldMakeLessAffectedByLight: 2, upscale: 2 });
	plantSprite.position.set(0, 2, 0);
	// billboards.push(plantSprite);const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );

	const [metalTexture] = createTextureFromResource({ codename: 'bars' });
	metalTexture.wrapS = RepeatWrapping;
	metalTexture.wrapT = RepeatWrapping;
	metalTexture.repeat.set(100, 1);
	const geometry = new CylinderGeometry(
		20.1, // radiusTop
		20, // radiusBottom
		0.8, // height
		32, // radialSegments
		1, // heightSegments
		true, // openEnded,
	);
	const material = new MeshPhongMaterial({
		map: metalTexture,
		transparent: true,
		side: DoubleSide,
		shininess: 0,
	});
	const cylinder = new Mesh(geometry, material);
	cylinder.position.set(0, 1, 0);

	const group = new Group();
	group.add(plantSprite);
	group.add(cylinder);

	// const geometry = new SphereGeometry(1);
	// const material = new MeshPhongMaterial({ map: metalTexture, color: COLOR_GREEN, shininess: 0 });
	// const sphere = new Mesh(geometry, material);

	// const randomDegrees = utilRandomDegrees0360();
	// const randomDegreesInRadians = (randomDegrees * Math.PI) / 180; // TODO util
	// const range = (i - 1) * 0.5;
	// const positionForward = range * Math.cos(randomDegreesInRadians);
	// const positionRight = range * Math.sin(randomDegreesInRadians);
	//
	// sphere.position.set(0, 0, 0);
	//
	// subGroup.position.set(positionForward, 0, positionRight);
	// subGroup.add(sphere);
	//
	// group.add(subGroup);

	group.position.set(x, 0, z);

	return {
		type: createBaseOfWitch,
		model: group,
		radius: 20,
		minimapSprite: createMinimapSprite('[W]'),
		handleTimeUpdate(deltaTimeSeconds, _, cameraPosition) { // eslint-disable-line no-unused-vars
			const direction = new Vector3();
			direction.subVectors(group.position, cameraPosition).normalize();
			const angle = Math.atan2(direction.x, direction.z);
			// for (let i = 0; i < billboards.length; i += 1) {
			plantSprite.rotation.y = angle;
			// }

			return {};
		},
	};
}
