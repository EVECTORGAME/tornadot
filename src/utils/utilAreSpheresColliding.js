export default function utilAreSpheresColliding(pointA, pointB, radiusA, radiusB) {
	const distanceX = Math.abs(pointA.x - pointB.x);
	const distanceY = Math.abs(pointA.y - pointB.y);
	const distanceZ = Math.abs(pointA.z - pointB.z);

	const distance = Math.sqrt(
		distanceX ** 2
		+ distanceY ** 2
		+ distanceZ ** 2,
	);

	const areColliding = distance < radiusA - radiusB;

	return areColliding;
}
