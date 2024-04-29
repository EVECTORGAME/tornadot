import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';
import ToolGridTransparency from '../tools/ToolGridTransparency.js';
import ToolGridUnderlay from '../tools/ToolGridUnderlay.js';
import ToolTransparentUnderlay from '../tools/ToolTransparentUnderlay.js';

// TINPAEYALF

const theme = createStylesheet('CommandWindow', {
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

// TODO transparent background base64

export default function CommandWindow({
	persistentId,
	// width,
	// height,
	selectedHsl,
	pixelartGridRef,
}) {
	const handleClick = useCallback((event) => {
		event.target.style.backgroundColor = selectedHsl;
		// console.log(event);
	}, [selectedHsl]);

	const handleMouseOver = useCallback((event) => {
	//	console.log(event);
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
			h(ToolGridUnderlay, { pixelartGridRef }),
			h(ToolTransparentUnderlay, { pixelartGridRef }),
			h(ToolGridTransparency, { pixelartGridRef }),
		)
	);
}
