import { h } from 'preact';
import { useCallback, useLayoutEffect, useState } from 'preact-hooks';
import classNames from 'clsx';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';

const theme = createStylesheet('ResourcesWindow', {
	container: {
		'display': 'flex',
		'flex-direction': 'column',
		// 'gap': '3px',
		// 'flex-wrap': 'nowrap',
		// // 'margin-bottom': '1em',
		// 'align-items': 'center',
	},
	rows: {

	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
		'border': '1px solid red',
	},
	pixel: {
		'border': '1px solid blue',
		'font-size': '0.5em',
		'width': '20px',
		'height': '20px',
	},
});

export default function ResourcesWindow({
	persistentId,
	// apiRef,
	sprites,
	onSelectedSprite,
}) {
	useLayoutEffect(() => {
		// apiRef.current = {
			// setSelectedHslColor(selectedHsl) {
			// 	selectedHslRef.current = selectedHsl;
			// },
			// checkIsGridShowed() {
			// 	return showGrid;
			// },
			// setShouldShowGrid(should) {
			// 	setShowGrid(should);
			// },
			// setShowTransparentUnderlay(should) {
			// 	setShouldTransparentUnderlay((prev) => {
			// 		return should === undefined ? !prev : should;
			// 	});
			// },
			// setLetterUnderlay(text, styles) {
			// 	underlayLetterRef.current.innerText = text;
			// 	underlayLetterRef.current.style.cssText = styles;
			// 	// setLetterUnderlay([text, styles]);
			// },
		// };
	}, []);

	const [selectedRowIndex, setSelectedRowIndex] = useState();
	const handleRowClick = useCallback((rowIndex) => {
		setSelectedRowIndex(rowIndex);

		const { type, data, metadata } = sprites[rowIndex];
		onSelectedSprite({
			type,
			data,
			metadata,
		});
	}, []);

	return (
		h(Window,
			{
				persistentId,
				title: 'Toolbox',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
				childrenClassName: theme.container,
			},
			h('div', { className: 'sunken-panel' }, // style: { height: 120px; width: 240px;">
				h('table', { className: 'interactive' },
					h('thead', null,
						h('tr', {},
							h('th', null, 'id'),
							h('th', null, 'codename'),
							h('th', null, 'type'),
							h('th', null, 'size'),
						),
					),
					h('tbody', null,
						sprites.map(({ id, codename, type, widthUnits, heightUnits }, rowIndex) => {
							return (
								h('tr',
									{
										className: classNames(
											selectedRowIndex === rowIndex && 'highlighted',
										),
										onclick: () => handleRowClick(rowIndex),
									},
									h('td', null, id),
									h('td', null, codename),
									h('td', null, type),
									h('td', null, `${widthUnits}x${heightUnits}`),
								)
							);
						}),
					),
				),
			),
			h('button', {}, 'dump data'), // wypluwa bitmape i użyte ustawienia
		)
	);
}
