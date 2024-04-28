import { h } from 'preact';
import { useCallback, useRef } from 'preact-hooks';
import classNames from 'clsx';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('HslColorPaleteWindow', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		// 'margin-bottom': '1em',
		'align-items': 'center',
		'flex-direction': 'column',
		// 'padding': '1em',
		// 'background-color': 'silver',
	},
	rows: {
		'display': 'flex',
		'flex-direction': 'column',
		'flex-wrap': 'no-wrap',
		'gap': '0.3em',
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
		'gap': '0.2em',
	},
	selected: {
		'width': '100%',
		'color': 'white',
		'text-align': 'center',
		'padding': '10px',
	},
	clear: {
		width: '100%',
	},
	color: {
		'display': 'flex',
		'align-items': 'center',
		'justify-content': 'center',
		'width': '20px',
		'height': '20px',
		'color': 'white',
		// 'user-selection': 'none',
		// 'pointer-events': 'none',
	},
});

export default function HslColorPaleteWindow({
	width,
	height,
	colorsCount,
	saturationPercent,
	lightnessPercent,
	lightnessOffsetPercent,
	// output
	onSetHslColor,
}) {
	const selectedRef = useRef();

	const handleMouseOver = useCallback((event) => {
		// console.log(event);
	}, []);

	const handleSetColor = useCallback((hslBaseColor, selectedSaturationPercent, selectedLightness) => {
		const selectedHls = hslBaseColor
			? `hsl(${hslBaseColor}, ${selectedSaturationPercent}%, ${selectedLightness}%)`
			: undefined;

		selectedRef.current.style.backgroundColor = selectedHls ?? 'transparent';

		onSetHslColor(selectedHls);
	}, []);

	const colorStep = 360 / colorsCount;

	// TODO historia wybranych kolorów

	return (
		h('div', {},
			h(Window,
				{
					title: 'HSL color picker',
					childrenTitleBarButtons: [
						h(TitleBarButtonClose),
						h(TitleBarButtonMinimize),
						h(TitleBarButtonMaximize),
						h(TitleBarButtonHelp),
					],
				},
				h('div',
					{ className: theme.container },
					h('div', {
						ref: selectedRef,
						className: theme.selected,
					}, 'selected'),
					h('button', {
						className: theme.clear,
						onclick: () => handleSetColor(undefined),
					}, 'clear'),
					h('div',
						{ className: theme.rows },
						Array(colorsCount).fill(undefined).map((_, colorOffset) => {
							const hslBaseColor = colorOffset * colorStep;
							const lighterColor = lightnessPercent - lightnessOffsetPercent;
							const darkerColor = lightnessPercent + lightnessOffsetPercent;

							return h('div',
								{ className: theme.row },
								// Array(width).fill(undefined).map((__, columnIndex) => {
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(hslBaseColor, saturationPercent, lighterColor),
									style: {
										'background-color': `hsl(${hslBaseColor}, ${saturationPercent}%, ${lighterColor}%)`,
									},
								}, `-${lightnessOffsetPercent}`),
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(hslBaseColor, saturationPercent, lightnessPercent),
									style: {
										'background-color': `hsl(${hslBaseColor}, ${saturationPercent}%, ${lightnessPercent}%)`,
									},
								}, `${hslBaseColor}`),
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(hslBaseColor, saturationPercent, darkerColor),
									style: {
										'background-color': `hsl(${hslBaseColor}, ${saturationPercent}%, ${darkerColor}%)`,
									},
								}, `+${lightnessOffsetPercent}`),
								// }),
							);
						}),
					),
					/* h('div',
						{ className: theme.controls },
						h('input', { type: 'text' }),
					), */
				)
			),
		)
	);
}
