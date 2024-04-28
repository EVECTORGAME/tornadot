import { h } from 'preact';
import { useCallback, useLayoutEffect, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../windows/Window.js';

// TINPAEYALF

const theme = createStylesheet('PixelartGrid', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		// 'margin-bottom': '1em',
		'align-items': 'center',
	},
	rows: {
		//
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

// TODO transparent background base64

export default function PixelartGrid({
	width,
	height,
	initialPosition,
	apiRef,
}) {
	const selectedHslRef = useRef();

	const handleClick = useCallback((event) => {
		event.target.style.backgroundColor = selectedHslRef.current;
		// console.log(event);
	}, []);

	const handleMouseOver = useCallback((event) => {
	//	console.log(event);
	}, []);

	useLayoutEffect(() => {
		apiRef.current = {
			setSelectedHslColor(selectedHsl) {
				selectedHslRef.current = selectedHsl;
			},
			toggleGrid(shouldShowGrid) {
			},
		};
	}, []);

	return (
		h(Window,
			{
				title: 'Picel Grid',
				initialPosition,
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
			},
			h('div',
				{ className: theme.container },
				// TODO dodać div na obrazek i literke
				h('div',
					{ className: theme.rows },
					Array(height).fill(undefined).map((_, rowIndex) => {
						return h('div',
							{ className: theme.row },
							Array(width).fill(undefined).map((__, columnIndex) => {
								return h('div', {
									className: theme.pixel,
									onmouseover: handleMouseOver,
									onclick: handleClick,
								}, `${columnIndex}:${rowIndex}`);
							}),
						);
					}),
				),
			),
		)
	);
}
