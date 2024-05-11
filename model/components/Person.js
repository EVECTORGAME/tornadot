import { h } from 'preact';

export default function Person({
	name,
}) {
	return (
		h('div', null,
			h('h3', null, `Person ${name}`),
		)
	);
}
