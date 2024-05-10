import { h } from 'preact';
import { useCallback, useState } from 'preact-hooks';
import classNames from 'clsx';
import createStylesheet from 'createStylesheet';
import useRefresh from '../hooks/useRefresh.js';
import { utilUnpackPixel } from '../utils/utilMatrix.js';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';

const theme = createStylesheet('ResourcesWindow', {
	container: {
		'display': 'flex',
		'flex-direction': 'column',
	},
	scrollable: {
		'max-height': '60vh',
	},
	rows: {

	},
	headerRow: {
		'font-weight': 'bold',
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
		'border': '1px solid red',
	},
	pixel: {
		'border': '1px solid blue',
		'font-size': '0.5em',
		'width': '20px',
		'height': '20px',
	},
	th: {
		position: 'sticky',
		top: 0,
	},
});

export default function ResourcesWindow({
	persistentId,
	resources,
	draftApi,
	pixelartGridRef,
	onSelectedSprite,
}) {
	const { sprites } = resources;

	const [refresh] = useRefresh();
	const [selectedRowIndex, setSelectedRowIndex] = useState();
	const selectedSpriteCodename = selectedRowIndex >= 0 ? resources.sprites[selectedRowIndex].codename : undefined;
	const handleRowClick = useCallback((rowIndex) => {
		const {
			codename,
			type,
			matrix: matrixFlatten,
			metadata,
			widthPixels,
			heightPixels,
		} = sprites[rowIndex];
		const matrixMinimized = draftApi.utilUnflattenMatrix(matrixFlatten);
		const matrix = matrixMinimized.map((matrixPixels) => {
			return matrixPixels.map((pixel) => {
				return utilUnpackPixel(pixel);
			});
		});
		const didChanged = onSelectedSprite({
			codename,
			type,
			matrix,
			metadata,
			widthPixels,
			heightPixels,
		});
		if (didChanged) {
			setSelectedRowIndex(rowIndex);
		}
	}, []);

	const handleRemoveDraft = useCallback(() => {
		const isConfirmed = window.confirm(`czy na pewno usunąć: ${selectedSpriteCodename}?`);
		if (isConfirmed) {
			draftApi.deleteEntryForCodename(selectedSpriteCodename);

			refresh();
		}
	}, [selectedSpriteCodename]);

	const handleDumpTilesetData = useCallback(() => {
		const spritesByTypes = sprites.reduce((stack, sprite) => {
			const isString = typeof sprite === 'string';
			if (isString) {
				return stack;
			}

			const spriteType = sprite.type;
			if (!stack.has(spriteType)) {
				stack.set(spriteType, {
					canvases: [],
					maxHeightPixels: 0,
					totlaWidthPixels: 0,
				});
			}

			const widthAndMarginPixels = sprite.widthPixels + 2;
			const heightAndMarginPixels = sprite.heightPixels + 2;

			const canvas = document.createElement('canvas');
			canvas.width = widthAndMarginPixels;
			canvas.height = heightAndMarginPixels;

			const context = canvas.getContext('2d');
			context.strokeStyle = 'magenta';
			context.lineWidth = 1;
			context.strokeRect(0, 0, canvas.width, canvas.height);

			sprite.matrix.forEach((row, rowIndex) => {
				row.split(';').map(pixel => utilUnpackPixel(pixel)).forEach((pixel, columnIndex) => {
					if (pixel) {
						context.fillStyle = pixel;
						context.fillRect(columnIndex + 1, rowIndex + 1, 1, 1);
					}
				});
			});

			const spritesOfType = stack.get(spriteType);

			// const totalWidthsOfCanvasesSoFar = spritesOfType.canvases.reduce((stack, canvas) => stack + canvas.canvas.width, 0);
			spritesOfType.canvases.push(canvas);
			spritesOfType.maxHeightPixels = Math.max(heightAndMarginPixels, spritesOfType.maxHeightPixels);
			spritesOfType.totlaWidthPixels += widthAndMarginPixels;

			return stack;
		}, new Map());

		const { requiredCanvacWidthPixels, requiredCanvacHeightPixels } = [...spritesByTypes].reduce((stack, [, typeRecord]) => {
			stack.requiredCanvacWidthPixels += typeRecord.totlaWidthPixels;
			stack.requiredCanvacHeightPixels += typeRecord.maxHeightPixels;

			return stack;
		}, {
			requiredCanvacWidthPixels: 0,
			requiredCanvacHeightPixels: 0,
		});

		const canvas = document.createElement('canvas');
		canvas.width = requiredCanvacWidthPixels;
		canvas.height = requiredCanvacHeightPixels;

		const context = canvas.getContext('2d');

		let offsetFromTopPixels = 0;
		spritesByTypes.forEach((canvasesOfType) => {
			let offsetFromLeftPixels = 0;
			canvasesOfType.canvases.forEach((spriteCanvas) => {
				context.drawImage(spriteCanvas, offsetFromLeftPixels, offsetFromTopPixels);
				offsetFromLeftPixels += spriteCanvas.width;
			});

			offsetFromTopPixels += canvasesOfType.maxHeightPixels;
		});

		const dataURL = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'sprites.png';
		link.click();
	}, []);

	const handleDumpData = useCallback(() => {
		const isAllSaved = pixelartGridRef.current?.checkIsSaved() ?? true;
		if (isAllSaved) {
			const dump = {
				...resources,
				sprites: resources.sprites.map((sprite) => {
					const isString = typeof sprite === 'string';
					if (isString) {
						return sprite;
					}

					const { codename } = sprite;
					const pendingMatrix = draftApi.getMatrixForCodename(codename, { shouldReturnMatrixFlatten: true });
					if (pendingMatrix) {
						// draftApi.deleteEntryForCodename(codename);

						return {
							...sprite,
							matrix: pendingMatrix,
						};
					}

					return sprite;
				}).map((sprite) => {
					const isString = typeof sprite === 'string';
					if (isString) {
						return sprite;
					}

					return {
						...sprite,
						matrix: sprite.matrix.map((matrixLine) => {
							return matrixLine.replace(/transparent/g, '').replace(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\s*\)/g, '$1+$2%$3%');
						}),
					};
				}),
			};

			const json = JSON.stringify(dump, null, '\t');
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.download = 'data.json';
			link.href = url;
			link.click();

			refresh();
		} else {
			// TODO tooltip
		}
	}, []);

	return (
		h(Window,
			{
				persistentId,
				title: 'List of Sprites',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
				childrenClassName: theme.container,
			},
			h('div', { className: classNames(theme.scrollable, 'sunken-panel') },
				h('table', { className: 'interactive' },
					h('thead', null,
						h('tr', {},
							h('th', null, 'id'),
							h('th', null, 'codename'),
							h('th', null, 'type'),
							h('th', null, 'width'),
							h('th', null, 'height'),
							h('th', null, 'has resource'),
							h('th', null, 'has pending'),
						),
					),
					h('tbody', { className: theme.tbody },
						sprites.map((spriteOrText, rowIndex) => {
							if (typeof spriteOrText === 'string') {
								return (
									h('tr',
										{
											className: classNames(
												theme.headerRow,
											),
										},
										h('td', { colspan: 5 }, `${spriteOrText.replace(/[#\s]/g, '')}:`),
									)
								);
							}

							const { id, type, codename, widthPixels, heightPixels, matrix } = spriteOrText;
							const hasPending = draftApi.checkHasEntryForCodename(codename);
							const hasResource = Boolean(matrix?.length);

							return (
								h('tr',
									{
										className: classNames(
											theme.tr,
											selectedRowIndex === rowIndex && 'highlighted',
										),
										onclick: () => handleRowClick(rowIndex),
									},
									h('td', null, id),
									h('td', null, codename),
									h('td', null, type),
									h('td', null, widthPixels),
									h('td', null, heightPixels),
									h('td', null, hasResource ? 'yes' : ''),
									h('td', null, hasPending ? 'yes' : ''),
								)
							);
						}),
					),
				),
			),
			h('button', { onclick: handleDumpData }, '💾 save / download'),
			h('button', { onclick: handleDumpTilesetData }, '💾 dump dadabase tileset into image'),
			h('button',
				{ onclick: handleRemoveDraft, disabled: !selectedSpriteCodename },
				selectedSpriteCodename
					? `remove ${selectedSpriteCodename} draft`
					: 'select sprite to delete its draft',
			),
		)
	);
}
