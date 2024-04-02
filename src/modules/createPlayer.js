import {
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
} from 'three';

export default function createPlayer() {
	const geometry = new BoxGeometry(1, 1, 1);
	const material = new MeshBasicMaterial({ color: 0x0000ff });
	const cube = new Mesh(geometry, material);

	return [cube, {}];
}
