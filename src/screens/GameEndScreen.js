import { h } from 'preact';
import { useEffect } from 'preact-hooks';
import createStylesheet from '../modules/createStylesheet.js';
import HeaderText from '../components/HeaderText.js';

const theme = createStylesheet('MainMenu', {
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
			h(HeaderText, { text: 'THANKS FOR _PLAYING' }),
		])
	);
}
