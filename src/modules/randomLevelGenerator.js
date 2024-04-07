import utilRandomDegrees0360 from '../utils/utilRandomDegrees0360.js';
import utilRandomValueMinMax from '../utils/utilRandomValueMinMax.js';
import utilRepeatUntilResult from '../utils/utilRepeatUntilResult.js';
import createHugeRock from '../entities/createHugeRock.js';
import createSmallPlant from '../entities/createSmallPlant.js';
import createLevelEnd from '../entities/createLevelEnd.js';

export default function randomLevelGenerator(scene, radius) {
	const totalArea = Math.PI * (radius ** 2);

	let areaTakenUpSoFar = 0;

	do {
		const randomRadius = utilRandomValueMinMax(30, 35);
		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180;
		const randomRange = utilRandomValueMinMax(10, radius);

		const randomPositionForward = randomRange * Math.cos(randomDegreesInRadians);
		const randomPositionRight = randomRange * Math.sin(randomDegreesInRadians);

		const closestEntity = scene.findClosestEntityToObject({
			forward: randomPositionForward,
			right: randomPositionRight,
			radius: randomRadius,
		}, undefined);

		if (closestEntity.distanceBetween < randomRadius * 0.8) {
			/* console.log('>> skip', {
				forward: randomPositionForward,
				right: randomPositionRight,
				radius: randomRadius,
			}, 'collides with', closestEntity); */
		} else {
			const hugeRock = createHugeRock({
				x: randomPositionForward,
				z: randomPositionRight,
				radius: randomRadius,
			});

			const hudeRockArea = Math.PI * (randomRadius ** 2);

			areaTakenUpSoFar += hudeRockArea;

			scene.add(hugeRock);
		}
	} while ((areaTakenUpSoFar / totalArea) < 0.3);

	const levelEnd = utilRepeatUntilResult(() => {
		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180;
		const randomRange = utilRandomValueMinMax(5, radius);

		const randomPositionForward = randomRange * Math.cos(randomDegreesInRadians);
		const randomPositionRight = randomRange * Math.sin(randomDegreesInRadians);

		const closestEntity = scene.findClosestEntityToObject({
			forward: randomPositionForward,
			right: randomPositionRight,
			radius: 10,
		}, undefined);

		if (closestEntity.distanceBetween < 1) {
			//
		} else {
			const entity = createLevelEnd({ x: randomPositionForward, y: 0, z: randomPositionRight });

			scene.add(entity);

			return entity;
		}
	});

	let plantsToPlace = Math.round(totalArea * 0.001); // 100 cover with plants
	do {
		const randomDegrees = utilRandomDegrees0360();
		const randomDegreesInRadians = (randomDegrees * Math.PI) / 180;
		const randomRange = utilRandomValueMinMax(5, radius);

		const randomPositionForward = randomRange * Math.cos(randomDegreesInRadians);
		const randomPositionRight = randomRange * Math.sin(randomDegreesInRadians);

		const closestEntity = scene.findClosestEntityToObject({
			forward: randomPositionForward,
			right: randomPositionRight,
			radius: 1,
		}, undefined);

		if (closestEntity.distanceBetween < 1) {
			//
		} else {
			const plant = createSmallPlant({
				x: randomPositionForward,
				z: randomPositionRight,
			});

			scene.add(plant);

			plantsToPlace -= 1;
		}
	} while (plantsToPlace >= 1);

	return {
		levelEnd,
	};
}
