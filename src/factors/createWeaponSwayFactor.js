import {
	Vector3,
	Quaternion,
} from 'three';

export default function createWeaponSwayFactor({
	multiplier,
	smooth,
	// factorOfContring,
}) {
	let accumulatedFactorX = 0;
	let accumulatedFactorY = 0;

	const targetRotation = new Quaternion();

	return {
		accumulateFactorXY(factorOfMovementX, factorOfMovementY) {
			accumulatedFactorX += factorOfMovementX;
			accumulatedFactorY += factorOfMovementY;
		},
		update(weaponSwayer) {
			const rotationX = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), (accumulatedFactorY * multiplier));
			const rotationY = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -(accumulatedFactorX * multiplier));

			targetRotation.multiplyQuaternions(rotationX, rotationY);

			weaponSwayer.quaternion.slerp(targetRotation, smooth);

			accumulatedFactorX = 0;
			accumulatedFactorY = 0;
		},
	};
}
