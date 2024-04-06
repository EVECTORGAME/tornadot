import { describe, expect, it } from '@jest/globals';
import createBitmapFont from './createBitmapFont.js';

describe('./createBitmapFont.js', () => {
	it('basic case 256x256 image with 16x16 images of 16x16 pixels each', () => {
		const WIDTH_PIXELS = 16;
		const creator = createBitmapFont('example/image.png', {
			tileSize: WIDTH_PIXELS,
			scaleingFactor: 1,
			charactersInRow: 16,
		});

		const [first] = creator.createLetter(0, 0);
		expect(first).toEqual({
			style: {
				'background-image': 'url(example/image.png)',
				'background-position': '0px 0px',
				'display': 'inline-block',
				'height': '16px',
				'width': '16px',
			},
		});

		const [fifth] = creator.createLetter(5, 0);
		expect(fifth).toEqual({
			style: {
				'background-image': 'url(example/image.png)',
				'background-position': '-80px 0px',
				'display': 'inline-block',
				'height': '16px',
				'width': '16px',
			},
		});

		const [other] = creator.createLetter(2, 3);
		expect(other).toEqual({
			style: {
				'background-image': 'url(example/image.png)',
				'background-position': '-32px -48px',
				'display': 'inline-block',
				'height': '16px',
				'width': '16px',
			},
		});
	});

	it('compicated case', () => {
		const creator = createBitmapFont('example/image.png', {
			tileWidth: 10,
			tileHeight: 13,
			paddingTop: 2,
			paddingLeft: 2,
			scaleingFactor: 1,
			spacingX: 1,
			spacingY: 3,
			charactersInRow: 9,
		});

		const [first] = creator.createLetter(0, 0);
		expect(first).toEqual({
			style: {
				'background-image': 'url(example/image.png)',
				'background-position': '-2px -2px',
				'display': 'inline-block',
				'height': '13px',
				'width': '10px',
			},
		});

		const [other] = creator.createLetter(2, 3);
		expect(other).toEqual({
			style: {
				'background-image': 'url(example/image.png)',
				'background-position': '-24px -50px',
				'display': 'inline-block',
				'height': '13px',
				'width': '10px',
			},
		});
	});
});
