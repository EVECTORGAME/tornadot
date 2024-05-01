import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import classNames from 'clsx';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('ToolGridTransparency', {
	container: {
		'padding-top': '10px',
		'padding-bottom': '10px',
	},
});

export default function ToolGridTransparency({ pixelartGridRef }) {
	const handleChange = useCallback((event) => {
		const opacity = event.target.value / 100;
		pixelartGridRef.current.setGridOpacity(opacity);
	}, []);

	return (
		h('div', { className: classNames('field-row', theme.container) },
			h('label', { for: 'range25' }, 'Opacity'),
			h('label', { for: 'range26' }, '1'),
			h('input', { id: 'range26', type: 'range', min: 1, max: 100, value: 50, oninput: handleChange }),
			h('label', { for: 'range27' }, '100'),
		)
	);
}
