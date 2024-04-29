import { h } from 'preact';
import { useCallback, useState, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Topmenu from '../components/Topmenu.js';
import Window, {
	realignWindows,
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../components/Window.js';
import HslColorPaleteWindow from '../windows/HslColorPaleteWindow.js';
import PixelartGridWindow from '../windows/PixelartGridWindow.js';
import CommandWindow from '../windows/CommandWindow.js';
import ResourcesWindow from '../windows/ResourcesWindow.js';

const UNIT_PIXELS = 32;

const theme = createStylesheet('MainScreen', {
	selectedColor: {
		height: '1em',
	},
});

export default function MainScreen({ sprites }) {
	const pixelartGridRef = useRef();
	const [{ type, data, metadata }, setTypeAndData] = useState({});
	// const [selectedHsl, setSelectedHsl] = useState();

	const handleSelectedHls = useCallback((hslToSet) => {
		pixelartGridRef.current.setSelectedHslColor(hslToSet);
		console.log(hslToSet);
		// etSelectedHsl(hslToSet);
	}, []);

	const handleOnPixelMouseDown = useCallback(([x, y]) => {
		console.log('>> handleOnPixelMouseDown', x, y);
	}, []);

	const handleOnPixelMouseUp = useCallback(([x, y]) => {
		console.log('>> handleOnPixelMouseUp', x, y);
	}, []);

	const handleOnPixelMouseDragOver = useCallback(([x, y]) => {
		console.log('>> handleOnPixelMouseDragOver', x, y);
	}, []);

	console.log('>>', { type, data, metadata });

	return [
		h(HslColorPaleteWindow, {
			persistentId: HslColorPaleteWindow.name,
			colorsCount: 9,
			saturationPercent: 40,
			lightnessPercent: 40,
			lightnessOffsetPercent: 10,
			onSetHslColor: handleSelectedHls,
		}),
		h(PixelartGridWindow, {
			persistentId: PixelartGridWindow.name,
			width: UNIT_PIXELS,
			height: UNIT_PIXELS,
			apiRef: pixelartGridRef,
			onPixelMouseDown: handleOnPixelMouseDown,
			onPixelMouseUp: handleOnPixelMouseUp,
			onPixelMouseDragOver: handleOnPixelMouseDragOver,
			letterUnderlay: metadata?.letterUnderlay,
		}),
		h(CommandWindow,
			{
				persistentId: CommandWindow.name,
				pixelartGridRef,
				// width: 32,
				// height: 32,
			},
		),
		h(Topmenu,
			{
				//
			},
			h('button', { onclick: realignWindows }, 'reset windows positions'),
		),
		h(ResourcesWindow, {
			persistentId: ResourcesWindow.name,
			sprites,
			onSelectedSprite({ type: a, data: b, metadata: c }) {
				setTypeAndData({
					type: a,
					data: b,
					metadata: c,
				});
			},
		}),
	];
}
