import { h } from 'preact';
// import classNames from 'clsx';
import { useState, useEffect, useCallback } from 'preact-hooks';
// import utilClamp from '../utils/utilClamp.js';
import createStylesheet from '../modules/createStylesheet.js';

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
	isSelected: {
		'text-decoration': 'underline',
	},
});

export default function PlayNextScreen({ nextLevelNumber, onYes }) {
	useEffect(() => {
		setTimeout(() => {
			onYes();
		}, 1000);
	}, []);

	return (
		h('div', { className: theme.container }, [
			`Next level is ${nextLevelNumber}`,
		])
	);
}
