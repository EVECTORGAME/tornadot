import { h } from 'preact';
import classNames from 'clsx';
import usePersistent from '../hooks/usePersistent.js';
import createStylesheet from '../modules/createStylesheet.js';
import createBitmapText from '../spritesheets/createBitmapText.js';

const theme = createStylesheet('BitmapText', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'align-items': 'center',
	},
});

export default function BitmapText({ text, upscale = 1, valign, className, onmouseover }) {
	const [imageDataUrl] = usePersistent(() => createBitmapText(text, { upscale, valign }));

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
