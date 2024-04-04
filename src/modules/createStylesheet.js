export default function createStylesheet(prefix, classes) {
	const head = document.getElementsByTagName('head')[0];
	const style = document.createElement('style');
	style.setAttribute('type', 'text/css');

	const { contents, aliases } = Object.keys(classes).reduce((stack, selectorName) => {
		const selector = classes[selectorName];
		const namePrefixed = `${prefix}-${selectorName}`;
		const classNamePrefixed = `.${namePrefixed}`;

		const propteriesSerialized = Object.keys(selector).reduce((subStack, propertyName) => {
			subStack.push(`${propertyName}: ${selector[propertyName]};`);

			return subStack;
		}, []).join('\n');

		stack[selectorName] = {};
		stack.aliases[selectorName] = namePrefixed;
		stack.contents.push(`${classNamePrefixed} {
			${propteriesSerialized}
		}`);

		return stack;
	}, {
		contents: [],
		aliases: {},
	});

	style.appendChild(document.createTextNode(contents.join('\n')));

	head.appendChild(style);

	return aliases;
}
