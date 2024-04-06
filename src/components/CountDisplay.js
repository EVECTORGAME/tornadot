import { h } from 'preact';
import { useRef, useLayoutEffect } from 'preact-hooks';
import classNames from 'clsx';
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

export default ({ charactersCount, paddingCharacter, shouldAlignToRight, className, apiRef }, { headerFont }) => {
	const containerRef = useRef();
	useLayoutEffect(() => {
		const textApi = headerFont.createTextElement(containerRef.current, ' '.repeat(charactersCount), {
			paddingCharacter,
			shouldAlignToRight,
		});

		apiRef.current = {
			alternateToNumber: textApi.alternateToNumber,
		};

		return () => {
			/* while (containerRef.current.firstChild) {
				containerRef.current.removeChild(containerRef.current.lastChild);
			} */
		};
	}, []);

	return h('div', {
		className: classNames(theme.container, className),
		ref: containerRef,
	});
};
