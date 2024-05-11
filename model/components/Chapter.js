import { h } from 'preact';

export default function Chapter({
	number,
	children,
}) {
	return (
		h('div', {},
			h('h1', {}, `Chapter ${number}`),
			children,
		)
	);
}
