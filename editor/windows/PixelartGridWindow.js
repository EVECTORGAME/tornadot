import { h } from 'preact';
import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'preact-hooks';
import classNames from 'clsx';
import createStylesheet from 'createStylesheet';
import { createMatrixWidthHeight } from '../utils/utilMatrix.js';
import useRefresh from '../hooks/useRefresh.js';
import useIsInitialRender from '../hooks/useIsInitialRender.js';
import useKeyPressedTracker from '../hooks/useKeyPressedTracker.js';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';

const theme = createStylesheet('PixelartGridWindow', {
	container: {
		'position': 'relative',
		'display': 'flex',
		'flex-direction': 'column',
	},
	underlay: {
		'position': 'absolute',
		'pointer-events': 'none',
	},
	gridHolder: {
		'position': 'relative',
		'display': 'flex',
		'justify-content': 'center',
	},
	griCenterer: {
		position: 'relative',
		display: 'flex',
	},
	underlayTransparent: {
		'inset': '0 0 0 0',
		'background-image': 'url("./images/transparent-background.png")',
	},
	underlayLetter: {
		'left': '50%',
		'transform': 'translateX(-50%)',
		'bottom': 0,
		'opacity': 0.5,
		'line-height': 0,
		'&:global(.capital-letter)': {
			'color': 'red',
			'bottom': '285px',
			'transform': 'translateX(-50%) scaleY(1.2)',
			'font-size': '760px',
			'font-family': '"Rubik Mono One"',
		},
		'&:global(.digit)': {
			'color': 'red',
			'bottom': '292px',
			'font-size': '1000px',
			'font-family': 'Geo',
		},
		'&:global(.small-letter)': {
			'color': 'blue',
			'bottom': '124px',
			'font-size': '400px',
			'font-family': '"Rubik Mono One"',
		},
		'&:global(.character)': {
			'color': 'orange',
			'bottom': '140px',
			'font-size': '400px',
			'font-family': '"Rubik Mono One"',
		},
	},
	rows: {
		'position': 'relative',
		'border-width': '1px 0px 0px 1px',
		'border-style': 'solid',
		'border-color': 'transparent',
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
	},
	pixel: {
		'font-size': '0.5em',
		'width': '20px',
		'height': '20px',
	},
	//
	topLeftGrid: {
		'border-width': '1px 0px 0px 1px',
		'border-style': 'dotted',
		'border-color': 'black',
		'box-sizing': 'content-box',
	},
	bottomRightGrid: {
		'border-width': '0px 1px 1px 0px',
		'border-style': 'dotted',
		'border-color': 'black',
		'box-sizing': 'border-box',
	},
	//
	actionColumns: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
	},
	actionColumn: {
		'display': 'flex',
		'flex-direction': 'column',
		'flex-grow': 1,
	},
});

export default function PixelartGridWindow({
	persistentId,
	columnsCount,
	rowsCount,
	apiRef,
	draftApi,
	onPixelMouseInteraction,
	editSpriteCodename,
	editSpriteType,
	editSpriteMatrix,
	letterUnderlay,
}) {
	const [refresh, refreshKey] = useRefresh();
	const databaseDataRef = useRef();
	const editorDataRef = useRef();
	const isTouchedRef = useRef(false);
	const pressedKeysRef = useKeyPressedTracker();
	const isInitialRender = useIsInitialRender();
	if (isInitialRender) {
		databaseDataRef.current = createMatrixWidthHeight(columnsCount, rowsCount, editSpriteMatrix, 'transparent');

		const savedMatrix = draftApi.getMatrixForCodename(editSpriteCodename, {});
		const isSavedMatrixNotEmpty = savedMatrix?.length >= 1 && savedMatrix[0]?.length >= 1;
		const matrixToLoadIntoEditor = isSavedMatrixNotEmpty
			? savedMatrix
			: editSpriteMatrix;
		editorDataRef.current = createMatrixWidthHeight(columnsCount, rowsCount, matrixToLoadIntoEditor, 'transparent');
	}

	const [showEditMode, setShowEditor] = useState(false);
	const isDatabaseView = !showEditMode;
	const gridRef = useRef();
	const isMouseDownRef = useRef(false);
	const underlayLetterRef = useRef();
	const [shouldShowGrid, setShowGrid] = useState(showEditMode);
	const [shouldTransparentUnderlay, setShouldTransparentUnderlay] = useState();

	const handleMouseDown = useCallback((event, rowIndex, columnIndex) => {
		if (showEditMode) {
			if (pressedKeysRef.current.e) {
				apiRef.current.setPixel(rowIndex, columnIndex, undefined);
			} else {
				isMouseDownRef.current = true;

				onPixelMouseInteraction(rowIndex, columnIndex);
			}
		}
	}, [showEditMode, onPixelMouseInteraction]);

	const handleMouseOver = useCallback((event, rowIndex, columnIndex) => {
		if (showEditMode) {
			if (isMouseDownRef.current) {
				onPixelMouseInteraction(rowIndex, columnIndex);
			}
		}
	}, [showEditMode, onPixelMouseInteraction]);

	const handleSaveEditorMatrixAsDraft = useCallback(() => {
		// TODO debounce + powiadomienie saved
		isTouchedRef.current = false;
		console.log('>> saqve');
		draftApi.setMatrixForCodename(editSpriteCodename,
			editorDataRef.current,
		);
	}, []);

	const handleMouseUp = useCallback(() => {
		isMouseDownRef.current = false;

		handleSaveEditorMatrixAsDraft();
	}, []);

	const handleCanvasMouseLeave = useCallback(() => {
		isMouseDownRef.current = false;
	}, []);

	const handleDeleteDraft = useCallback(() => {
		const shouldDelete = window.confirm('Czy aby na pewno usunąć draft z localStorage?');
		if (shouldDelete) {
			draftApi.deleteEntryForCodename(editSpriteCodename);
			// TODO reset, draftDataRef
		}
	}, []);

	const handleClearEditor = useCallback(() => {
		isTouchedRef.current = false;
		editorDataRef.current = createMatrixWidthHeight(columnsCount, rowsCount, undefined, 'transparent');
		refresh();
	}, [columnsCount, rowsCount]);

	const handleCopyOriginalIntoEditor = useCallback(() => {
		isTouchedRef.current = false;
		editorDataRef.current = createMatrixWidthHeight(columnsCount, rowsCount, databaseDataRef.current, 'transparent');
		refresh();
	}, []);

	const handleLoadOriginal = useCallback(() => {
		setShowGrid(false);
		setShowEditor(false);
	}, []);
	const handleLoadDraft = useCallback(() => {
		setShowGrid(true);
		setShowEditor(true);
	}, []);

	useLayoutEffect(() => {
		apiRef.current = {
			checkIsSaved() {
				return !isTouchedRef.current;
			},
			setPixel(rowIndex, columnIndex, selectedColor) {
				if (showEditMode) {
					isTouchedRef.current = true;
					editorDataRef.current[rowIndex][columnIndex] = selectedColor;
					gridRef.current.children[rowIndex].children[columnIndex].style['background-color'] = selectedColor ?? 'transparent';

					// TODO trigger save
				}
			},
			getCanvasRowsAndColumnsCount() {
				return [rowsCount, columnsCount];
			},
			getPixel(rowIndex, columnIndex) {
				const pixelColor = showEditMode
					? editorDataRef.current[rowIndex][columnIndex]
					: databaseDataRef.current[rowIndex][columnIndex];

				return pixelColor;
			},
			checkIsGridShowed() {
				return shouldShowGrid;
			},
			setShouldShowGrid(should) {
				setShowGrid(should);
			},
			setShowTransparentUnderlay(should) {
				setShouldTransparentUnderlay((prev) => {
					return should === undefined ? !prev : should;
				});
			},
			setGridOpacity(opacity) {
				gridRef.current.style.opacity = opacity;
			},
		};
	}, [shouldShowGrid, isDatabaseView, showEditMode]);

	const seletedData
		= isDatabaseView ? databaseDataRef.current
		: showEditMode ? editorDataRef.current
		: undefined;

	const showGrid = shouldShowGrid;

	return (
		h(Window,
			{
				persistentId,
				title: 'Pixel Grid',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
			},
			h('div', { className: theme.container },
				h('menu', { role: 'tablist' },
					h('li',
						{
							'role': 'tab',
							'aria-selected': String(isDatabaseView),
							'onclick': handleLoadOriginal,
						},
						h('a', null, 'database'),
					),
					h('li',
						{
							'role': 'tab',
							'aria-selected': String(showEditMode),
							'onclick': handleLoadDraft,
						},
						h('a', null, '🖊️ editor'),
					),
				),
				h('div', { className: 'window', role: 'tabpanel' },
					h('div', { className: 'window-body' },
						h('div', { className: theme.gridHolder },
							h('div', { className: theme.griCenterer },
								h('div', {
									className: classNames(
										theme.underlay,
										shouldTransparentUnderlay && theme.underlayTransparent,
									),
								}),
								h('div',
									{
										ref: underlayLetterRef,
										className: classNames(
											theme.underlay,
											theme.underlayLetter,
											editSpriteType,
										),
									},
									letterUnderlay,
								),
								h('div',
									{
										ref: gridRef,
										onmouseleave: handleCanvasMouseLeave,
										className: classNames(
											theme.rows,
											showGrid && theme.topLeftGrid,
										),
									},
									seletedData.map((row, rowIndex) => {
										return h('div',
											{ className: theme.row },
											row.map((pixel, columnIndex) => {
												return h('div', {
													/*
														key here is important because it seems that changing only style['background-color']
														doesnt trigger corosponding redraw on dom
													*/
													key: `${showEditMode}:${refreshKey}`,
													className: classNames(
														theme.pixel,
														showGrid && theme.bottomRightGrid,
													),
													style: {
														'background-color': pixel,
													},
													onmousedown: event => handleMouseDown(event, rowIndex, columnIndex),
													onmouseup: event => handleMouseUp(event, rowIndex, columnIndex),
													onmouseover: event => handleMouseOver(event, rowIndex, columnIndex),
												});
											}),
										);
									}),
								),
							),
						),
						h('div', { className: theme.actionColumns },
							h('fieldset', { className: theme.actionColumn },
								h('legend', null, 'database element actions'),
								h('button', {
									onclick: handleCopyOriginalIntoEditor,
									disabled: !isDatabaseView,
								}, 'copy this to editor'),
							),
							h('fieldset', { className: theme.actionColumn },
								h('legend', null, 'editor actions'),
								h('button', {
									onclick: handleSaveEditorMatrixAsDraft,
									disabled: !showEditMode || !isTouchedRef,
								}, '💾 save manualy'),
								h('button', {
									onclick: handleClearEditor,
									disabled: !showEditMode,
								}, 'clear editor'),
							),
						),
					),
				),
			),
		)
	);
}
