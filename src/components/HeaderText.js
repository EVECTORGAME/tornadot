import { h } from 'preact';
import { useRef, useLayoutEffect } from 'preact-hooks';
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
	const containerRef = useRef();
	useLayoutEffect(() => {
		headerFont.createTextElement(containerRef.current, text, {});

		return () => {
			/* while (containerRef.current.firstChild) {
				containerRef.current.removeChild(containerRef.current.lastChild);
			} */
		};
	}, []);

	return h('div', {
		className: theme.container,
		ref: containerRef,
	});
}
