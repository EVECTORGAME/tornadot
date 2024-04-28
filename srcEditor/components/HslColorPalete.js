import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import classNames from 'clsx';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../windows/Window.js';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('HslColorPalete', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		// 'margin-bottom': '1em',
		'align-items': 'center',
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
	color: {
		'display': 'flex',
		'align-items': 'center',
		'justify-content': 'center',
		'font-size': '0.5em',
		'width': '20px',
		'height': '20px',
		// 'user-selection': 'none',
		// 'pointer-events': 'none',
	},
});

export default function HslColorPalete({
	width,
	height,
	colorsCount,
	saturationPercent,
	lightnessPercent,
	lightnessOffsetPercent,
	// output
	onSetHslColor,
}) {
	const handleMouseOver = useCallback((event) => {
		// console.log(event);
	}, []);

	const handleSetColor = useCallback((hslBaseColor, selectedSaturationPercent, selectedLightness) => {
		const selectedHls = `hsl(${hslBaseColor}, ${selectedSaturationPercent}%, ${selectedLightness}%)`;

		onSetHslColor(selectedHls);
	}, []);

	const colorStep = 360 / colorsCount;

	// <div class="window" style="width: 300px">
	//   <div class="title-bar">
	//     <div class="title-bar-text">A Window With Stuff In It</div>
	//     <div class="title-bar-controls">
	//       <button aria-label="Minimize"></button>
	//       <button aria-label="Maximize"></button>
	//       <button aria-label="Close"></button>
	//     </div>
	//   </div>
	//   <div class="window-body">
	//     <p>There's so much room for activities!</p>
	//   </div>
	// </div>

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
					h('div',
						{ className: theme.rows },
						Array(colorsCount).fill(undefined).map((_, colorOffset) => {
							const hslBaseColor = colorOffset * colorStep;
							const lighterColor = lightnessPercent - lightnessOffsetPercent;
							const darkerColor = lightnessPercent + lightnessOffsetPercent;

							return h('div',
								{ className: theme.row },
								// Array(width).fill(undefined).map((__, columnIndex) => {
								h('div', {
									className: theme.color,
									onclick: () => handleSetColor(hslBaseColor, saturationPercent, lighterColor),
									style: {
										'background-color': `hsl(${hslBaseColor}, ${saturationPercent}%, ${lighterColor}%)`,
									},
								}, `-${lightnessOffsetPercent}`),
								h('div', {
									className: theme.color,
									onclick: () => handleSetColor(hslBaseColor, saturationPercent, lightnessPercent),
									style: {
										'background-color': `hsl(${hslBaseColor}, ${saturationPercent}%, ${lightnessPercent}%)`,
									},
								}, `${hslBaseColor}`),
								h('div', {
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
