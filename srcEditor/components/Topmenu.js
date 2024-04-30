import { h } from 'preact';
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
	},
});

export default function CommandWindow({
	children,
}) {
	return (
		h('div',
			{
				className: theme.container,
			},
			children,
		)
	);
}
