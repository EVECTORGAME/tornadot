import { h } from 'preact';
import classNames from 'clsx';
import { useState, useEffect, useCallback } from 'preact-hooks';
import utilClamp from '../utils/utilClamp.js';
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
});

export default function GameEndScreen({ onWatched }) {
	useEffect(() => {
		setTimeout(() => {
			onWatched();
		}, 1000);
	}, []);

	return (
		h('div', { className: theme.container }, [
			h('div', {}, [
				'thanks for playing',
			]),
		])
	);
}
