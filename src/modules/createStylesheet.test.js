import { jest, describe, expect, it } from '@jest/globals';
import createStylesheet from './createStylesheet.js';

describe('./createStylesheet.js', () => {
	it('basic case', () => {
		const createTextNodeSpy = jest.fn(global.document.createTextNode);
		Object.defineProperty(global.document, 'createTextNode', { value: createTextNodeSpy });

		const theme = createStylesheet('ExampleComponent', {
			container: {
				padding: '20px',
			},
			frame: {
				'border': '1px solid silver',
				'&:global(.capital-letter)': {
					'font-size': '20px',
				},
				'& > *': {
					margin: '10px',
				},
			},
		});

		expect(theme).toEqual({
			container: 'ExampleComponent-container',
			frame: 'ExampleComponent-frame',
		});

		expect(createTextNodeSpy).toHaveBeenCalledWith([
			'.ExampleComponent-container { padding: 20px; }',
			'.ExampleComponent-frame { border: 1px solid silver; }',
			'.ExampleComponent-frame.capital-letter { font-size: 20px; }',
			'.ExampleComponent-frame > * { margin: 10px; }',
		].join('\n'));
	});
});
