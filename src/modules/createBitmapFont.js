export default function createBitmapFont(src, props) {
	const {
		tileSize,
		spacing = 0,
		paddingTop = 0,
		paddingLeft = 0,
		map,
	} = props;

	const tileWidth = props.tileWidth ?? tileSize;
	const tileHeight = props.tileHeight ?? tileSize;
	const spacingX = props.spacingX ?? spacing;
	const spacingY = props.spacingY ?? spacing;

	function calculatePosition({ column, row }) {
		const offsetLeft = column * tileWidth * -1;
		const offsetTop = row * tileHeight * -1;

		return {
			offsetLeft: (offsetLeft) - paddingLeft - (spacingX * column),
			offsetTop: (offsetTop) - paddingTop - (spacingY * row),
		};
	}

	function createLetter(column, row) {
		const {
			offsetLeft,
			offsetTop,
		} = calculatePosition({ column, row });

		return [
			{
				style: {
					'display': 'inline-block',
					'width': `${tileWidth}px`,
					'height': `${tileHeight}px`,
					'background-image': `url(${src})`,
					'background-position': `${offsetLeft}px ${offsetTop}px`,
				},
			},
		];
	}

	return {
		createLetter,
		createText(text) {
			const elements = text.split('').map((letter) => {
				const cetterCoorgainates = map[letter];
				if (cetterCoorgainates) {
					const [elementAttributes] = createLetter(cetterCoorgainates[0], cetterCoorgainates[1]);

					return elementAttributes;
				}

				return {
					display: 'inline-block',
					width: `${tileWidth}px`,
					height: `${tileHeight}px`,
				};
			});

			return elements;
		},
	};
}
