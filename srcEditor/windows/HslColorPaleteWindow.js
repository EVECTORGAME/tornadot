import { h } from 'preact';
import { useCallback, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';

const theme = createStylesheet('HslColorPaleteWindow', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'align-items': 'center',
		'flex-direction': 'column',
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
	},
});

export default function HslColorPaleteWindow({
	persistentId,
	colorsCount,
	saturationPercent: baseSaturationPercent,
	lightnessPercent,
	lightnessOffsetPercent,
	// output
	onSetHslColor,
}) {
	const selectedRef = useRef();

	const handleSetColor = useCallback((hslBaseColor, selectedSaturationPercent, selectedLightness) => {
		const selectedHls = hslBaseColor === undefined
			? undefined
			: `hsl(${hslBaseColor}, ${selectedSaturationPercent}%, ${selectedLightness}%)`;

		selectedRef.current.style.backgroundColor = selectedHls ?? 'transparent';
		selectedRef.current.innerText = selectedHls ? 'selected color' : 'no color selected';
		selectedRef.current.style.color = selectedHls ? 'white' : 'black';

		onSetHslColor(selectedHls);
	}, [], [undefined]);

	const colorStep = 360 / colorsCount;

	return (
		h('div', {},
			h(Window,
				{
					persistentId,
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
					}, 'no initial color'),
					h('button', {
						className: theme.clear,
						onclick: () => handleSetColor(undefined),
					}, 'clear'),
					h('div',
						{ className: theme.rows },
						Array(colorsCount).fill(baseSaturationPercent).map((saturationPercent, colorOffset) => {
							const hslBaseColor = colorOffset * colorStep;
							const lighterColor = lightnessPercent - lightnessOffsetPercent;
							const darkerColor = lightnessPercent + lightnessOffsetPercent;

							return h('div',
								{ className: theme.row },
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
							);
						}),
						[lightnessOffsetPercent, 50, 100 - lightnessOffsetPercent].map((lightness) => {
							const lighterColor = lightness - lightnessOffsetPercent;
							const darkerColor = lightness + lightnessOffsetPercent;
							const useBlackColor = lightness > 75;
							const color = useBlackColor ? 'black' : 'white';

							return h('div',
								{ className: theme.row },
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(0, 0, lighterColor),
									style: {
										color,
										'background-color': `hsl(0, 0%, ${lighterColor}%)`,
									},
								}, `-${lightnessOffsetPercent}`),
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(0, 0, lightness),
									style: {
										color,
										'background-color': `hsl(0, 0%, ${lightness}%)`,
									},
								}, `${lightness}`),
								h('button', {
									className: theme.color,
									onclick: () => handleSetColor(0, 0, darkerColor),
									style: {
										color,
										'background-color': `hsl(0, 0%, ${darkerColor}%)`,
									},
								}, `+${lightnessOffsetPercent}`),
							);
						}),
					),
				),
			),
		)
	);
}
