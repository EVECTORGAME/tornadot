import { h } from 'preact';
import { useCallback, useState, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../windows/Window.js';
import HslColorPalete from '../components/HslColorPalete.js';
import PixelartGrid from '../components/PixelartGrid.js';
import CommandBox from '../components/CommandBox.js';
import Database from '../components/Database.js';

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
		h(HslColorPalete, {
			colorsCount: 9,
			saturationPercent: 40,
			lightnessPercent: 40,
			lightnessOffsetPercent: 10,
			onSetHslColor: handleSelectedHls,
		}),
		h(PixelartGrid, {
			width: 32,
			height: 32,
			apiRef: pixelartGridRef,
		}),
		h(CommandBox, {
			pixelartGridRef,
			// width: 32,
			// height: 32,
		}),
		h(Database),
	];
}
