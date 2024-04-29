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
	scrollable: {
		'max-height': '60vh',
	},
	rows: {

	},
	headerRow: {
		'font-weight': 'bold',
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
	th: {
		position: 'sticky',
		top: 0,
		// display: 'table',
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

	const handleRemoveDraft = useCallback(() => {
		const isConfirmed = window.confirm('czy na pewno usunąć?');
		if (isConfirmed) {
			// TODO remove draft
		}
	}, [selectedRowIndex]);

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
			h('div', { className: classNames(theme.scrollable, 'sunken-panel') }, // style: { height: 120px; width: 240px;">
				h('table', { className: 'interactive' },
					h('thead', null,
						h('tr', {},
							h('th', null, 'id'),
							h('th', null, 'codename'),
							h('th', null, 'type'),
							h('th', null, 'size'),
						),
					),
					h('tbody', { className: theme.tbody },
						sprites.map((spriteOrText, rowIndex) => {
							if (typeof spriteOrText === 'string') {
								return (
									h('tr',
										{
											className: classNames(
												theme.headerRow,
											),
											// onclick: () => handleRowClick(rowIndex),
										},
										h('td', { colspan: 5 }, `${spriteOrText.replace(/[#\s]/g, '')}:`),
									)
								);
							}

							const { id, type, codename, widthUnits, heightUnits } = spriteOrText;

							return (
								h('tr',
									{
										className: classNames(
											theme.tr,
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
			h('button', { onclick: handleRemoveDraft }, 'remove draft'), // wypluwa bitmape i użyte ustawienia
		)
	);
}
