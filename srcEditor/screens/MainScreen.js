import { h } from 'preact';
import { useCallback, useState, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
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

export default function MainScreen() {
	const pixelartGridRef = useRef();
	// const [selectedHsl, setSelectedHsl] = useState();

	const handleSelectedHls = useCallback((hslToSet) => {
		pixelartGridRef.current.setSelectedHslColor(hslToSet);
		console.log(hslToSet);
		// etSelectedHsl(hslToSet);
	}, []);

	// console.log('>>', selectedHsl);

	return [
		h(HslColorPaleteWindow, {
			colorsCount: 9,
			saturationPercent: 40,
			lightnessPercent: 40,
			lightnessOffsetPercent: 10,
			onSetHslColor: handleSelectedHls,
		}),
		h(PixelartGridWindow, {
			width: UNIT_PIXELS,
			height: UNIT_PIXELS,
			apiRef: pixelartGridRef,
		}),
		h(CommandWindow, {
			pixelartGridRef,
			// width: 32,
			// height: 32,
		}),
		h(ResourcesWindow),
	];
}
