import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('Topmenu', {
	container: {
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0,
		'display': 'flex',
		'flex-direction': 'row',
		'background-color': 'silver',
		// 'gap': '3px',
		// 'flex-wrap': 'nowrap',
		// // 'margin-bottom': '1em',
		// 'align-items': 'center',
	},
});

// TODO transparent background base64

export default function CommandWindow({
	children,
}) {
	/* const handleClick = useCallback((event) => {
		event.target.style.backgroundColor = selectedHsl;
		// console.log(event);
	}, [selectedHsl]); */

	/* const handleMouseOver = useCallback((event) => {
	//	console.log(event);
}, []); */

	return (
		h('div',
			{
				className: theme.container,
			},
			children,
		)
	);
}
