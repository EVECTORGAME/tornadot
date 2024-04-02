export default function createFavicon({ width, height }) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = 'bold 20px sans-serif';
	ctx.fillText(
		'*',
		4,
		18,
	);

	const link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = canvas.toDataURL('image/x-icon');
	document.getElementsByTagName('head')[0].appendChild(link);

	return {};
}
