import { h } from 'preact';
import classNames from 'clsx';
import usePersistent from '../hooks/usePersistent.js';
import createStylesheet from '../modules/createStylesheet.js';
import createBitmapText from '../textures/createBitmapText.js';

const theme = createStylesheet('BitmapText', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'margin-bottom': '1em',
		'align-items': 'center',
	},
});

export default function BitmapText({ text, upscale = 1, className, onmouseover }) {
	const [imageDataUrl] = usePersistent(() => createBitmapText(text, { upscale }));

	return [
		h('img',
			{
				src: imageDataUrl,
				className: classNames(theme.container, className),
				onmouseover,
			},
		),
	];
}
