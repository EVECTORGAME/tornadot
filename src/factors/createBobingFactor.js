import { Vector3 } from 'three';

export default function createBobingFactor({
	amplitude, // 0.15
	frequency, // 10
	resetingPositionSpeed,
}) {
	let timeSeconds = 0;

	const VectorZero = new Vector3(0, 0, 0);

	return {
		update(bober, isActive, timeDetaSeconds) {
			timeSeconds += timeDetaSeconds;

			if (isActive) {
				bober.position.x = Math.cos(timeSeconds * frequency * 0.5) * amplitude * 2;
				bober.position.y = Math.sin(timeSeconds * frequency) * amplitude;
			} else {
				bober.position.lerp(VectorZero, timeDetaSeconds * resetingPositionSpeed);
			}
		},
		reset() {

		},
	};
}
