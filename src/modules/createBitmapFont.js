import utilMergePlaceholderArrayWithDataArray from '../utils/utilMergePlaceholderArrayWithDataArray.js';

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
		// TODO add cache
		const offsetLeft = column * tileWidth * -1;
		const offsetTop = row * tileHeight * -1;

		return {
			offsetLeft: (offsetLeft) - paddingLeft - (spacingX * column),
			offsetTop: (offsetTop) - paddingTop - (spacingY * row),
		};
	}

	function calculateCharacterStyles(column, row) {
		const {
			offsetLeft,
			offsetTop,
		} = calculatePosition({ column, row });

		return {
			'width': `${tileWidth}px`,
			'height': `${tileHeight}px`,
			'background-image': `url(${src})`,
			'background-position': `${offsetLeft}px ${offsetTop}px`,
		};
	}

	return {
		createTextElement(element, text, { paddingCharacter, shouldAlignToRight }) {
			const elements = [];
			text.split('').forEach((letter) => {
				const characterCoordinates = map[letter] ?? map[''];
				const characterStyles = calculateCharacterStyles(characterCoordinates[0], characterCoordinates[1]);

				const characterElement = document.createElement('div');
				characterElement.style.display = 'inline-block';
				characterElement.style.width = characterStyles.width;
				characterElement.style.height = characterStyles.height;
				characterElement.style.backgroundImage = characterStyles['background-image'];
				characterElement.style.backgroundPosition = characterStyles['background-position'];

				elements.push(characterElement);
				element.appendChild(characterElement);
			});

			return {
				alternateToNumber(number) { // TODO cache previous
					const digits = String(number).split('');
					utilMergePlaceholderArrayWithDataArray(elements, digits, shouldAlignToRight, (_, digit, index) => {
						const characterCoordinates = map[digit ?? paddingCharacter] ?? map[''];
						const {
							offsetLeft,
							offsetTop,
						} = calculatePosition({
							column: characterCoordinates[0],
							row: characterCoordinates[1],
						});

						elements[index].style.backgroundPosition = `${offsetLeft}px ${offsetTop}px`;
					});
				},
			};
		},
	};
}
