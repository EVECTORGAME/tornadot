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
		const isConfirmed = window.confirm('czy na pewno usunąć?');
		if (isConfirmed) {
			// TODO remove draft
		}
	}, [selectedRowIndex]);

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
			h('button', { onclick: handleDumpData }, 'dump data'),
			h('button', { onclick: handleRemoveDraft }, 'remove draft'),
		)
	);
}
