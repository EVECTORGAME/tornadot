import { h } from 'preact';
import { useCallback, useState, useRef } from 'preact-hooks';
import { condition } from '../../src/utils/index.js';
import useDraftDatabase from '../hooks/useDraftDatabase.js';
import Topmenu from '../components/Topmenu.js';
import { realignWindows } from '../components/Window.js';
import HslColorPaleteWindow from '../windows/HslColorPaleteWindow.js';
import PixelartGridWindow from '../windows/PixelartGridWindow.js';
import CommandWindow from '../windows/CommandWindow.js';
import ResourcesWindow from '../windows/ResourcesWindow.js';

const UNIT_PIXELS = 32;

export default function MainScreen({ resources }) {
	const draftApi = useDraftDatabase();
	const pixelartGridRef = useRef();
	const [selectedColor, setSelectedColor] = useState(undefined);
	const [{ codename, type, matrix, metadata }, setTypeAndData] = useState({});

	const handleSelectedHls = useCallback((hslToSet) => {
		setSelectedColor(hslToSet);
	}, []);

	const handlePixelMouseInteraction = useCallback((rowIndex, columnIndex) => {
		pixelartGridRef.current.setPixel(rowIndex, columnIndex, selectedColor);
	}, [selectedColor]);

	const { colorPalette } = resources;
	const {
		colorsCount,
		saturationPercent,
		lightnessPercent,
		lightnessOffsetPercent,
	} = colorPalette;

	return [
		h(HslColorPaleteWindow, {
			persistentId: HslColorPaleteWindow.name,
			colorsCount,
			saturationPercent,
			lightnessPercent,
			lightnessOffsetPercent,
			onSetHslColor: handleSelectedHls,
		}),
		condition(
			Boolean(codename),
			h(PixelartGridWindow, {
				key: codename,
				persistentId: PixelartGridWindow.name,
				width: UNIT_PIXELS, // TODOD from resourcess
				height: UNIT_PIXELS,
				apiRef: pixelartGridRef,
				//
				codename,
				matrix,
				//
				onPixelMouseInteraction: handlePixelMouseInteraction,
				letterUnderlay: metadata?.letterUnderlay,
				draftApi,
			}),
		),
		h(CommandWindow,
			{
				persistentId: CommandWindow.name,
				pixelartGridRef,
			},
		),
		h(Topmenu, null,
			h('button', { onclick: realignWindows }, 'reset windows positions'),
		),
		h(ResourcesWindow, {
			persistentId: ResourcesWindow.name,
			resources,
			draftApi,
			pixelartGridRef,
			onSelectedSprite({ codename: a, type: b, matrix: c, metadata: d, draftData: e }) {
				const isSaved = pixelartGridRef.current?.checkIsSaved() ?? true;
				if (!isSaved) {
					return false;
				}

				setTypeAndData({
					codename: a,
					type: b,
					matrix: c,
					metadata: d,
					draftData: e,
				});

				return true;
			},
		}),
	];
}
