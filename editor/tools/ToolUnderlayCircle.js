import { h } from 'preact';
import { useRef, useCallback } from 'preact-hooks';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('ToolUnderlayCircle', {
	container: {
		'padding-top': '10px',
		'padding-bottom': '10px',
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'nowrap',
		'justify-content': 'space-between',
	},
	label: {
		'display': 'flex',
		'align-items': 'center',
		'justify-content': 'center',
		'padding': '0 10px',
	},
});

export default function ToolUnderlayCircle({ pixelartGridRef }) {
	const stylesRef = useRef({
		borderWidthPixels: 1,
		widthPixels: 0,
		heightPixels: 0,
	});

	const refresh = useCallback(() => {
		pixelartGridRef.current.setUnderlayCircleSet({
			styles: {
				'border-style': 'solid',
				'border-width': `${stylesRef.current.borderWidthPixels}px`,
				'border-color': 'red',
				'border-radius': '999px',
				'width': `${stylesRef.current.widthPixels}px`,
				'height': `${stylesRef.current.heightPixels}px`,
			},
		});
	}, []);

	const handleChangeSize = useCallback((pixelsToAdd) => {
		stylesRef.current.widthPixels += pixelsToAdd;
		stylesRef.current.heightPixels = stylesRef.current.widthPixels;
		refresh();
	}, []);

	const handleChangeWidth = useCallback((pixelsToAdd) => {
		stylesRef.current.borderWidthPixels += pixelsToAdd;
		refresh();
	}, []);

	return (
		h('div', { className: theme.container },
			h('fieldset', null,
				h('legend', null, 'underlay circle'),
				h('div', { className: theme.row },
					h('button', { onclick: () => handleChangeSize(-10) }, '-10'),
					h('span', { className: theme.label }, 'radius'),
					h('button', { onclick: () => handleChangeSize(+10) }, '+10'),
				),
				h('div', { className: theme.row },
					h('button', { onclick: () => handleChangeSize(-50) }, '-50'),
					h('span', { className: theme.label }, 'radius'),
					h('button', { onclick: () => handleChangeSize(+50) }, '+50'),
				),
				h('div', { className: theme.row },
					h('button', { onclick: () => handleChangeWidth(-1) }, '-1'),
					h('span', { className: theme.label }, 'stroke'),
					h('button', { onclick: () => handleChangeWidth(+1) }, '+1'),
				),
			),
		)
	);
}
