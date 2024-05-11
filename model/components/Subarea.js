import { h } from 'preact';

export default function Subarea({
	name,
	children,
	resources,
}) {
	return (
		h('div', {},
			h('h2', {}, `Subarea ${name}`),
			h('fieldset', {},
				h('legend', null, 'resources'),
				h('ul', null,
					resources.map((resourceName) => {
						return h('li', null, resourceName);
					}),
				),
			),
			children,
		)
	);
}
