import { h } from 'preact';
import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'preact-hooks';
import classNames from 'clsx';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';

// TINPAEYALF

const theme = createStylesheet('PixelartGridWindow', {
	container: {
		'position': 'relative',
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		// 'margin-bottom': '1em',
		'align-items': 'center',
	},
	underlay: {
		'position': 'absolute',
		'inset': '0 0 0 0',
		'pointer-events': 'none',
	},
	underlayTransparent: {
		'background-image': 'url("./images/transparent-background.png")',
	},
	underlayLetter: {
		'display': 'flex',
		'align-items': 'center',
		'justify-content': 'center',
		'font-size': '600px',
		'font-family': 'Rubik Mono One',
		'opacity': 0.5,
	},
	rows: {
		'position': 'relative',
		//
	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
		// 'border': '1px solid red',
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
		'box-sizing': 'border-box',
	},
	bottomRightGrid: {
		'border-width': '0px 1px 1px 0px',
		'border-style': 'dotted',
		'border-color': 'black',
		'box-sizing': 'border-box',
	},
});

// TODO transparent background base64

export default function PixelartGridWindow({
	persistentId,
	width,
	height,
	apiRef,
	// onClickedPixel
	// onSelectedRectangle
	onPixelMouseDown,
	onPixelMouseUp,
	onPixelMouseDragOver,
	//
	letterUnderlay,
}) {
	const selectedHslRef = useRef();
	const isMouseDownRef = useRef(false);
	const underlayLetterRef = useRef();
	// const underlayTransparentRef = useRef();
	const [showGrid, setShowGrid] = useState(true);
	const [shouldTransparentUnderlay, setShouldTransparentUnderlay] = useState();

	const handleClick = useCallback(() => {
		//
	}, []);

	const handleMouseDown = useCallback((event) => {
		isMouseDownRef.current = true;

		// onPixelMouseDown();
		event.target.style.backgroundColor = selectedHslRef.current;
	}, []);

	const handleMouseOver = useCallback((event) => {
		if (isMouseDownRef.current) {
			event.target.style.backgroundColor = selectedHslRef.current;
		}
	}, []);

	const handleMouseUp = useCallback(() => {
		isMouseDownRef.current = false;

		event.target.style.backgroundColor = selectedHslRef.current;
	}, []);

	useLayoutEffect(() => {
		apiRef.current = {
			setSelectedHslColor(selectedHsl) {
				selectedHslRef.current = selectedHsl;
			},
			checkIsGridShowed() {
				return showGrid;
			},
			setShouldShowGrid(should) {
				setShowGrid(should);
			},
			setShowTransparentUnderlay(should) {
				setShouldTransparentUnderlay((prev) => {
					return should === undefined ? !prev : should;
				});
			},
				setLetterUnderlay(text, styles) {
					underlayLetterRef.current.innerText = text;
					underlayLetterRef.current.style.cssText = styles;
					// setLetterUnderlay([text, styles]);
				},
		};
	}, [showGrid]);

	return (
		h(Window,
			{
				persistentId,
				title: 'Picel Grid',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
			},
			h('div',
				{ className: theme.container },
				// TODO dodać div na obrazek i literke
				h('div', {
					className: classNames(
						theme.underlay,
						shouldTransparentUnderlay && theme.underlayTransparent,
					),
				}),
				h('div',
					{
						ref: underlayLetterRef, // kkicj
						className: classNames(
							theme.underlay,
							theme.underlayLetter,
							// letter && theme.underlayTransparent,
						),
					},
					letterUnderlay,
				),
				h('div',
					{
						onmousedown: handleMouseDown,
						onmouseup: handleMouseUp,
						// onmouseout: handleMouseUp,
						className: classNames(
							theme.rows,
							showGrid && theme.topLeftGrid,
						),
					},
					Array(height).fill(undefined).map((_, rowIndex) => {
						return h('div',
							{ className: theme.row },
							Array(width).fill(undefined).map((__, columnIndex) => {
								return h('div', {
									className: classNames(
										theme.pixel,
										showGrid && theme.bottomRightGrid,
									),
									onmouseover: handleMouseOver,
									onclick: handleClick,
								}); // , `${columnIndex}:${rowIndex}`);
							}),
						);
					}),
				),
			),
		)
	);
}
