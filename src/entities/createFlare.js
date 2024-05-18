import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
	Group,
	PointLight,
	Vector3,
} from 'three';

// TODO timeToLive

export default function createRocket({
	initialPosition: startPosition,
	destinationPosition: endPosition,
	shooterEntity,
}) {
	const geometry = new SphereGeometry(0.2);
	const material = new MeshPhongMaterial({ color: 0xffffff, shininess: 0 });
	const sphere = new Mesh(geometry, material);

	const light = new PointLight(0xffffff, 5, 30, 0);
	light.position.set(0, 1, 0);
	/* light.position.set(
		initialPostion.x,
		initialPostion.y,
		initialPostion.z,
	); */

	const holder = new Group();
	holder.add(sphere);
	holder.add(light);
	holder.position.copy(startPosition);

	// const group = new Group();
	// group.add(holder);
	// group.add(light);

	// group.position.set(x, 0, z);
	// group.rotation.y = rotation;

	// let timeToLiveSeconds = 3;
	// let isMoving = true;
	// ####################################################################################################################

	const gravity = new Vector3(0, -9.81, 0); // Gravity vector

	// Calculate distances
	const deltaX = endPosition.x - startPosition.x;
	const deltaY = endPosition.y - startPosition.y;
	const deltaZ = endPosition.z - startPosition.z;

	const distance = endPosition.distanceTo(startPosition) * 0.02;

	// Estimate throw time based on vertical motion under gravity
	const g = Math.abs(gravity.y);
	const timeToPeak = Math.sqrt(2 * Math.abs(deltaY) / g);
	const totalTime = distance; // timeToPeak; // Time to go up and come back down
	console.log('>>', timeToPeak, distance);

	// Calculate initial velocities
	const velocityX = deltaX / totalTime;
	const velocityZ = deltaZ / totalTime;
	const velocityY = (deltaY + 0.5 * g * totalTime * totalTime) / totalTime;

	const initialVelocity = new Vector3(velocityX, velocityY, velocityZ);

	console.log('>> initialVelocity', initialVelocity);

	let elapsedTime = 0;
	let isMoving = true;

	return {
		type: createRocket,
		model: holder,
		radius: undefined,
		shooterEntity,
		collidesWith(other) { // eslint-disable-line no-unused-vars
			// isMoving = false;

			// return true;
		},
		handleTimeUpdate(deltaTimeSeconds) {
			// timeToLiveSeconds -= deltaTimeSeconds;
			elapsedTime += deltaTimeSeconds; // = (currentTime - startTime) / 1000; // Convert to seconds

			if (isMoving) {
				// Calculate the new position using kinematic equations
				const newPosition = new Vector3();
				newPosition.copy(startPosition)
					.addScaledVector(initialVelocity, elapsedTime)
					.addScaledVector(gravity, 0.5 * elapsedTime * elapsedTime);

				holder.position.copy(newPosition);

				if (newPosition.y < 0.1) {
					newPosition.y = 0.1;
					isMoving = false;
				}
			}

			return {
				shouldDestroy: elapsedTime >= 3,
			};

			// Stop the animation if the object reaches the destination point
			/* if (elapsedTime >= totalTime) {
				sphere.position.copy(endPosition); // Snap to exact destinatio

				return; // Stop updating
			} */

			/* if (isMoving) {
				return {
					shouldDestroy: timeToLiveSeconds <= 0,
					moveForwardStep: deltaTimeSeconds * 50,
				};
			} */
		},
	};
}

/* import {
	Group,
	Vector3,
	SphereGeometry,
	MeshPhongMaterial,
	Mesh,
} from 'three';
import { createMinimapSprite } from './utils.js';

export default function createFlare({ initialPostion, destinationPosition }) {
	debugger;
	const geometry = new SphereGeometry(0.2);
	const material = new MeshPhongMaterial({ color: '#ff0000', shininess: 0 });
	const sphere = new Mesh(geometry, material);
	sphere.position.set(0, 0.5, 0);

	const light = new PointLight(0xffffff, 5, 30, 0);
	light.position.set(
		initialPostion.x,
		initialPostion.y,
		initialPostion.z,
	);

	const body = new Group();
	body.add(light);
	body.add(sphere);

	// initial calculations

	const gravity = new Vector3(0, -9.81, 0); // Gravity vector

	// Set the initial position of the sphere
	// sphere.position.copy(startPosition);

	// Calculate distances
	const distance = initialPostion.distanceTo(destinationPosition);

	const deltaX = destinationPosition.x - initialPostion.x;
	const deltaY = distance * 0.1; // destinationPosition.y - initialPostion.y;
	const deltaZ = destinationPosition.z - initialPostion.z;

	// Estimate throw time based on vertical motion under gravity
	const g = Math.abs(gravity.y);
	const timeToPeak = Math.sqrt(2 * Math.abs(deltaY) / g);
	const totalTime = 2 * timeToPeak; // Time to go up and come back down

	// Calculate initial velocities
	const velocityX = deltaX / totalTime;
	const velocityZ = deltaZ / totalTime;
	const velocityY = (deltaY + 0.5 * g * totalTime * totalTime) / totalTime;

	const initialVelocity = new Vector3(velocityX, velocityY, velocityZ);

	// Time variables
	// let startTime = Date.now();
	let elapsedTime = 0;

	let shouldFly = true;

	return {
		type: createFlare,
		model: body,
		radius: 0.5,
		minimapSprite: createMinimapSprite('*'),
		collidesWith(other) {
			shouldFly = false;
			/* if (other.type === createLevelEnd) {
				onLevelEnded();
			} else {
				factorForwardBackward.clear();
				factorSidestepLeftRight.clear();
			} * /

			return false;
		},
		handleTimeUpdate(deltaTimeSeconds, {
			isForwardHolded,
			isBackwardHolded,
			isStepLeftHolded,
			isStepRightHolded,
			isActionPressed,
		}) {
			if (shouldFly) {
				// const currentTime = Date.now();
				// elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
				elapsedTime += deltaTimeSeconds;

				// Calculate the new position using kinematic equations
				const newPosition = new Vector3();
				newPosition.copy(initialPostion)
					.addScaledVector(initialVelocity, elapsedTime)
					.addScaledVector(gravity, 0.5 * elapsedTime * elapsedTime);

				// Update the sphere's position
				// body.position.copy(newPosition);

				// console.log('>> ...', body.position.y);

				if (body.position.y < 0) {
					shouldFly = false;
				}

				return {

				};

				// Stop the animation if the object reaches the destination point
				/* if (elapsedTime >= totalTime) {
					body.position.copy(destinationPosition); // Snap to exact destination

					// return; // Stop updating
				} * /
			}
		},
	};
} */
