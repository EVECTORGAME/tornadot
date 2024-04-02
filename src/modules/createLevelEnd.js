import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
} from 'three';

export default function createLevelEnd({  }) {
	const geometry = new SphereGeometry(1);
	const material = new MeshBasicMaterial({ color: 0x0000ff });
	const sphere = new Mesh(geometry, material);

	return {
		model: sphere,
		handleTimeUpdate(timeDeltaTime) {
		},
	};
}
