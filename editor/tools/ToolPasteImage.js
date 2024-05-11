import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import utilsRgbToHsl from '../utils/utilsRgbToHsl.js';

export default function ToolPasteImage({ pixelartGridRef }) {
	const handlePasteImage = useCallback(async () => {
		try {
			const clipboardItems = await navigator.clipboard.read();
			console.log('>> clipboardItems', clipboardItems);
			for (const clipboardItem of clipboardItems) {
				const imageBlob = await clipboardItem.getType('image/png').catch(() => clipboardItem.getType('image/jpeg'));
				if (!imageBlob) {
					continue;
				}

				const img = new Image();
				const reader = new FileReader();
				reader.onload = () => {
					img.src = reader.result;
				};

				reader.readAsDataURL(imageBlob);

				await new Promise((resolve) => {
					img.onload = resolve;
				});

				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const pixelData = imageData.data;
				for (let i = 0; i < pixelData.length; i += 4) {
					const red = pixelData[i + 0];
					const green = pixelData[i + 1];
					const blue = pixelData[i + 2];
					const alpha = pixelData[i + 3];

					const pixelIndex = i / 4;
					const pixelX = pixelIndex % img.width;
					const pixelY = Math.floor(pixelIndex / img.width);

					const [hue, saturation, lightness] = utilsRgbToHsl(red, green, blue);
					console.log(`Pixel ${pixelIndex}: r=${hue}, g=${saturation}, b=${lightness}, a=${alpha}`);

					const isTransparent = alpha === 0;
					const isOpaque = alpha === 1;
					const colorToSet
						= isTransparent ? 'transparent'
						: isOpaque ? `hsl(${hue}, ${saturation}%, ${lightness}%)`
						: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

					pixelartGridRef.current.setPixel(pixelY, pixelX, colorToSet);
				}

				break;
			}
		} catch (err) {
			console.error(err.name, err.message);
		}
	}, []);

	return (
		h('button',
			{
				onclick: handlePasteImage,
			},
			'paste image',
		)
	);
}
