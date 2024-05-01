import { h } from 'preact';
import usePersistent from '../hooks/usePersistent.js';
import createStylesheet from '../modules/createStylesheet.js';
import createBitmapText from '../textures/createBitmapText.js';

const theme = createStylesheet('HeaderText', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'margin-bottom': '1em',
		'align-items': 'center',
	},
});

export default function HeaderText({ text }) {
	const imageDataUrl = usePersistent(() => createBitmapText('ABOPa9' ?? text, { upscale: 2 }));

	return (
		h('img',
			{
				src: imageDataUrl,
				className: theme.container,
			},
		)
	);
}
