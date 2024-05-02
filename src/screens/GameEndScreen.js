import { h } from 'preact';
import { useEffect } from 'preact-hooks';
import createStylesheet from '../modules/createStylesheet.js';
import BitmapText from '../components/BitmapText.js';

const theme = createStylesheet('GameEndScreen', {
	container: {
		'position': 'fixed',
		'inset': 0,
		'display': 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'flex-direction': 'column',
		// 'background-color': COLOR_DARK_BLUE,
	},
});

export default function GameEndScreen({ onWatched }) {
	useEffect(() => {
		setTimeout(() => {
			onWatched();
		}, 2000);
	}, []);

	return (
		h('div', { className: theme.container }, [
			h(BitmapText, { text: 'THANKS FOR _PLAYING', upscale: 2 }),
		])
	);
}
