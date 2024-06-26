export default function createStylesheet(prefix, selectors) {
	const head = document.getElementsByTagName('head')[0];
	const style = document.createElement('style');
	style.setAttribute('type', 'text/css');

	const { aliases, contents } = Object.keys(selectors).reduce((stack, selectorName) => {
		const selectorProperties = selectors[selectorName];
		const namePrefixed = `${prefix}-${selectorName}`;

		stack.aliases[selectorName] = namePrefixed;

		const { selectorPropertiesDump, extraContents } = Object.keys(selectorProperties).reduce((subStack, propertyName) => {
			const isSubProperty = propertyName.startsWith('&');
			if (isSubProperty) {
				const subProperties = Object.keys(selectorProperties[propertyName]).map((subSelectorPropertyKey) => {
					return `${subSelectorPropertyKey}: ${selectorProperties[propertyName][subSelectorPropertyKey]};`;
				});

				const matchGlobal = propertyName.match(/^&:global\(\.([\w-]+)\)$/);
				if (matchGlobal) {
					const subSelector = propertyName.replace('&', namePrefixed).replace(/:global\((.*?)\)/, '$1');
					subStack.extraContents.push(`.${subSelector} { ${subProperties.join(' ')} }`);
				}

				const matchChildren = propertyName.match(/^&\s*>\s*\*\s*$/);
				if (matchChildren) {
					const subSelector = propertyName.replace('&', namePrefixed);
					subStack.extraContents.push(`.${subSelector} { ${subProperties.join(' ')} }`);
				}

				return subStack;
			}

			subStack.selectorPropertiesDump.push(`${propertyName}: ${selectorProperties[propertyName]};`);

			return subStack;
		}, {
			selectorPropertiesDump: [],
			extraAliases: {}, // TODO oprogramować
			extraContents: [],
		});

		stack.contents.push(`.${namePrefixed} { ${selectorPropertiesDump.join(' ')} }`);

		extraContents.forEach((a) => {
			stack.contents.push(a);
		});

		return stack;
	}, {
		aliases: {},
		contents: [],
	});

	style.appendChild(document.createTextNode(contents.join('\n')));
	head.appendChild(style);

	return aliases;
}
