import { h } from 'preact';
import usePersistent from '../hooks/usePersistent.js';
import createStylesheet from '../modules/createStylesheet.js';

const theme = createStylesheet('HeaderText', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		'margin-bottom': '1em',
		'align-items': 'center',
	},
});

export default function HeaderText({ text }, { headerFont }) {
	const headerText = usePersistent(() => headerFont.createText(text, {}));

	return h('div',
		{ className: theme.container },
		...headerText.map(elementAttributes => h('div', elementAttributes)),
	);
}
