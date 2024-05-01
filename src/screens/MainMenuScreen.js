import { h } from 'preact';
import classNames from 'clsx';
import { useState, useEffect, useCallback } from 'preact-hooks';
import utilClamp from '../utils/utilClamp.js';
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
	entry: {
		'pointer-events': 'all',
		'cursor': 'hand',
	},
	isSelected: {
		'text-decoration': 'underline',
	},
});

export default function MainMenu({ title, items }) {
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
		h('div', { className: theme.container }, [
			h(HeaderText, { text: title }),
			items.map(({ label }, index) => {
				const isSelectedItem = index === activeIndex;

				return (
					h('div', {
						key: label,
						className: classNames(theme.entry, { [theme.isSelected]: isSelectedItem }),
						onmouseover: () => setActiveIndex(index),
					}, label)
				);
			}),
		])
	);
}
