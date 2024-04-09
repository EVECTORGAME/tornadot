import { h } from 'preact';
import { useEffect } from 'preact-hooks';
import createStylesheet from '../modules/createStylesheet.js';
import HeaderText from '../components/HeaderText.js';

const theme = createStylesheet('PlayNextScreen', {
	container: {
		'position': 'fixed',
		'inset': 0,
		'display': 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'flex-direction': 'column',
	},
});

export default function PlayNextScreen({ nextLevelNumber, onYes }) {
	useEffect(() => {
		setTimeout(() => {
			onYes();
		}, 1000);
	}, []);

	return (
		h('div',
			{ className: theme.container },
			h(HeaderText, { text: `NEXT LEVEL IS ${nextLevelNumber}` }),
		)
	);
}
