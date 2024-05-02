import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('ToolRollCanvas', {
	container: {
		'padding-top': '10px',
		'padding-bottom': '10px',
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'nowrap',
		'& > *': {
			width: '30%',
		},
	},
});

// TODO move those roll operations to utils/utilMatrix.js

export default function ToolRollCanvas({ pixelartGridRef }) {
	const handleRollUp = useCallback(() => {
		const [rowsCount, columnsCount] = pixelartGridRef.current.getCanvasRowsAndColumnsCount();
		const copyOfFirstRow = Array(columnsCount).fill(undefined).map((_, columnIndex) => {
			return pixelartGridRef.current.getPixel(0, columnIndex);
		});

		for (let rowIndex = 1; rowIndex < rowsCount; rowIndex += 1) {
			for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
				const pixel = pixelartGridRef.current.getPixel(rowIndex, columnIndex);
				pixelartGridRef.current.setPixel(rowIndex - 1, columnIndex, pixel);
			}
		}

		const lastRowIndex = rowsCount - 1;
		copyOfFirstRow.forEach((pixel, columnIndex) => {
			pixelartGridRef.current.setPixel(lastRowIndex, columnIndex, pixel);
		});
	}, []);

	const handleRollDown = useCallback(() => {
		const [rowsCount, columnsCount] = pixelartGridRef.current.getCanvasRowsAndColumnsCount();
		const copyOfLastRow = Array(columnsCount).fill(undefined).map((_, columnIndex) => {
			return pixelartGridRef.current.getPixel(rowsCount - 1, columnIndex);
		});

		for (let rowIndex = rowsCount - 2; rowIndex >= 0; rowIndex -= 1) {
			for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
				const pixel = pixelartGridRef.current.getPixel(rowIndex, columnIndex);
				pixelartGridRef.current.setPixel(rowIndex + 1, columnIndex, pixel);
			}
		}

		copyOfLastRow.forEach((pixel, columnIndex) => {
			pixelartGridRef.current.setPixel(0, columnIndex, pixel);
		});
	}, []);

	const handleRollLeft = useCallback(() => {
		const [rowsCount, columnsCount] = pixelartGridRef.current.getCanvasRowsAndColumnsCount();
		const copyOfFirstColumn = Array(rowsCount).fill(undefined).map((_, rowIndex) => {
			return pixelartGridRef.current.getPixel(rowIndex, 0);
		});

		for (let columnIndex = 1; columnIndex < columnsCount; columnIndex += 1) {
			for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
				const pixel = pixelartGridRef.current.getPixel(rowIndex, columnIndex);
				pixelartGridRef.current.setPixel(rowIndex, columnIndex - 1, pixel);
			}
		}

		copyOfFirstColumn.forEach((pixel, rowIndex) => {
			pixelartGridRef.current.setPixel(rowIndex, columnsCount - 1, pixel);
		});
	}, []);

	const handleRollRight = useCallback(() => {
		const [rowsCount, columnsCount] = pixelartGridRef.current.getCanvasRowsAndColumnsCount();
		const indexOfLastCoumn = columnsCount - 1;
		const copyOfLastColumn = Array(rowsCount).fill(undefined).map((_, rowIndex) => {
			return pixelartGridRef.current.getPixel(rowIndex, indexOfLastCoumn);
		});

		for (let columnIndex = indexOfLastCoumn; columnIndex >= 1; columnIndex -= 1) {
			for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
				const pixel = pixelartGridRef.current.getPixel(rowIndex, columnIndex - 1);
				pixelartGridRef.current.setPixel(rowIndex, columnIndex, pixel);
			}
		}

		copyOfLastColumn.forEach((pixel, rowIndex) => {
			pixelartGridRef.current.setPixel(rowIndex, 0, pixel);
		});
	}, []);

	return (
		h('div', { className: theme.container },
			h('fieldset', null, // { className: theme.actionColumn },
				h('legend', null, 'roll canvas'),
				h('div', { className: theme.row },
					h('div'),
					h('button', { onclick: handleRollUp },
						'up',
					),
					h('div'),
				),
				h('div', { className: theme.row },
					h('button', { onclick: handleRollLeft },
						'left',
					),
					h('div'),
					h('button', { onclick: handleRollRight },
						'right',
					),
				),
				h('div', { className: theme.row },
					h('div'),
					h('button', { onclick: handleRollDown },
						'down',
					),
					h('div'),
				),
			),
		)
	);
}
