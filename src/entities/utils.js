export function createMinimapSprite(letter) {
	const spriteElement = document.createElement('div');
	spriteElement.style.position = 'absolute';
	spriteElement.style.transform = 'translate(-50%, -50%)';
	spriteElement.innerText = letter;

	return spriteElement;
}
