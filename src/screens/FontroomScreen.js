import { h } from 'preact';
import usePersistent from '../hooks/usePersistent.js';
import useKeyHook from '../hooks/useKeyHook.js';
import createStylesheet from '../modules/createStylesheet.js';
import createBitmapText from '../spritesheets/createBitmapText.js';

const theme = createStylesheet('FontroomScreen', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'margin-bottom': '1em',
		'align-items': 'center',
	},
});

export default function FontroomScreen({ onClose }) {
	const [capitalLettersDataUrl] = usePersistent(() => createBitmapText('ABCDEFGHIJKLMNOPQRSTUVWXYZ', { upscale: 2 }));
	const [smallLettersDataUrl] = usePersistent(() => createBitmapText('abcdefghijklmnopqrstuvwxyz', { upscale: 2 }));
	const [digitsDataUrl] = usePersistent(() => createBitmapText('0123456789', { upscale: 2 }));
	const [smallDigitsDataUrl] = usePersistent(() => createBitmapText('0123456789', { upscale: 1 }));

	useKeyHook('Escape', () => {
		onClose();
	}, []);

	return [
		h('img',
			{
				src: capitalLettersDataUrl,
				className: theme.container,
			},
		),
		h('img',
			{
				src: smallLettersDataUrl,
				className: theme.container,
			},
		),
		h('img',
			{
				src: digitsDataUrl,
				className: theme.container,
			},
		),
		h('img',
			{
				src: smallDigitsDataUrl,
				className: theme.container,
			},
		),
	];
}
