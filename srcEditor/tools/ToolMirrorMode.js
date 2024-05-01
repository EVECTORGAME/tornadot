import { h } from 'preact';
import { useCallback, useLayoutEffect, useState } from 'preact-hooks';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('ToolGridTransparency', {
	container: {
		'padding-top': '10px',
		'padding-bottom': '10px',
	},
});

export default function ToolMirrorMode({ apiRef }) {
	const [isChecked, setIsChecked] = useState(false);

	useLayoutEffect(() => {
		apiRef.current = {
			getMirrorPixels(rowIndex, columnIndex, canvasWidth) {
				if (isChecked) {
					const half = canvasWidth / 2;
					const offsetFromHelf = half - columnIndex - 1;
					const mirrorx = half + offsetFromHelf;

					return [rowIndex, mirrorx];
					// console.log('>> getMirrorPixels, ', rowIndex, columnIndex);
				}
			},
		};
	}, [isChecked]);

	const handleToggle = useCallback(() => {
		setIsChecked(prev => !prev);
	}, []);

	return (
		h('div',
			{
				className: theme.container,
				onclick: handleToggle,
			},
			// 'toggle transparent underlay',
			h('input', { type: 'checkbox', id: 'mirror-mode-checkbox', checked: isChecked }),
			h('label', { fXor: 'mirror-mode-checkbox' }, 'Mirror mode'),
		)
	);
}
