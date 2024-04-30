import { h } from 'preact';
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
	pixelartGridRef,
}) {
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
