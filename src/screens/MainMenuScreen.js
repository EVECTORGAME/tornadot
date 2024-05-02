import { h } from 'preact';
import classNames from 'clsx';
import { useState, useEffect, useCallback } from 'preact-hooks';
import utilClamp from '../utils/utilClamp.js';
import createStylesheet from '../modules/createStylesheet.js';
import BitmapText from '../components/BitmapText.js';

const theme = createStylesheet('MainMenu', {
	container: {
		'position': 'fixed',
		'inset': 0,
		'display': 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'flex-direction': 'column',
		'gap': '0.5em',
		// 'background-color': COLOR_DARK_BLUE,
	},
	showAsOverlay: {
		'background-color': 'rgba(0, 0, 0, 0.7)',
	},
	entry: {
		'pointer-events': 'all',
		'cursor': 'hand',
		'border-style': 'solid',
		'border-width': '0 0 5px 0',
		'border-color': 'transparent',
		'padding': '0.2em',
		'opacity': 0.5,
	},
	isSelected: {
		'text-decoration': 'underline',
		'border-color': 'rgb(60, 60, 60)',
		'opacity': 1,
	},
});

export default function MainMenu({ title, items, showAsOverlay }) {
	const [activeIndex, setActiveIndex] = useState(0);

	const addOffsetToValue = useCallback((offset) => {
		const newActiveIndex = utilClamp(activeIndex + offset, 0, items.length - 1);

		setActiveIndex(newActiveIndex);
	}, [activeIndex]);

	useEffect(() => {
		function handleKey({ key }) {
			if (key === 'ArrowUp') {
				addOffsetToValue(-1);
			} else if (key === 'ArrowDown') {
				addOffsetToValue(+1);
			} else if (key === 'Enter') {
				items[activeIndex].onSelected();
			}
		}

		document.body.addEventListener('keyup', handleKey);

		return () => {
			document.body.removeEventListener('keyup', handleKey);
		};
	}, [addOffsetToValue]);

	return (
		h('div', { className: classNames(theme.container, showAsOverlay && theme.showAsOverlay) }, [
			h(BitmapText, { text: title, upscale: 2 }),
			items.map(({ label }, index) => {
				const isSelectedItem = index === activeIndex;

				return (
					h(BitmapText, {
						key: label,
						text: label,
						valign: 'bottom',
						className: classNames(theme.entry, { [theme.isSelected]: isSelectedItem }),
						onmouseover: () => setActiveIndex(index),
					})
				);
			}),
		])
	);
}
