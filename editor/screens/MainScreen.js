import { h } from 'preact';
import { useCallback, useState, useRef } from 'preact-hooks';
import { condition } from '../../src/utils/index.js';
import useDraftDatabase from '../hooks/useDraftDatabase.js';
import Topmenu from '../components/Topmenu.js';
import { realignWindows } from '../components/Window.js';
import ToolGridTransparency from '../tools/ToolGridTransparency.js';
import ToolGridUnderlay from '../tools/ToolGridUnderlay.js';
import ToolMirrorMode from '../tools/ToolMirrorMode.js';
import ToolRollCanvas from '../tools/ToolRollCanvas.js';
import ToolTransparentUnderlay from '../tools/ToolTransparentUnderlay.js';
import HslColorPaleteWindow from '../windows/HslColorPaleteWindow.js';
import PixelartGridWindow from '../windows/PixelartGridWindow.js';
import CommandWindow from '../windows/CommandWindow.js';
import ResourcesWindow from '../windows/ResourcesWindow.js';

export default function MainScreen({ resources }) {
	const draftApi = useDraftDatabase();
	const mirrorApiRef = useRef();
	const pixelartGridRef = useRef();
	const [selectedColor, setSelectedColor] = useState(undefined);
	const [{
		codename: editSpriteCodename,
		type: editSpriteType,
		matrix: editSpriteMatrix,
		metadata: editSpriteMetadata,
		widthPixels: editSpriteWidthPixels,
		heightPixels: editSpriteHeightPixels,
	}, setTypeAndData] = useState({});

	const handleSelectedHls = useCallback((hslToSet) => {
		setSelectedColor(hslToSet);
	}, []);

	const handlePixelMouseInteraction = useCallback((rowIndex, columnIndex) => {
		pixelartGridRef.current.setPixel(rowIndex, columnIndex, selectedColor);

		const mirrorPixel = mirrorApiRef.current.getMirrorPixels(rowIndex, columnIndex, editSpriteWidthPixels);
		if (mirrorPixel) {
			pixelartGridRef.current.setPixel(mirrorPixel[0], mirrorPixel[1], selectedColor);
		}
	}, [selectedColor, editSpriteWidthPixels]);

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
			Boolean(editSpriteCodename),
			h(PixelartGridWindow, {
				key: editSpriteCodename,
				persistentId: PixelartGridWindow.name,
				columnsCount: editSpriteWidthPixels,
				rowsCount: editSpriteHeightPixels,
				apiRef: pixelartGridRef,
				//
				editSpriteCodename,
				editSpriteMatrix,
				editSpriteType,
				//
				onPixelMouseInteraction: handlePixelMouseInteraction,
				letterUnderlay: editSpriteMetadata?.letterUnderlay,
				draftApi,
			}),
		),
		h(CommandWindow,
			{
				persistentId: CommandWindow.name,
				pixelartGridRef,
			},
			h(ToolMirrorMode, { apiRef: mirrorApiRef }),
			h(ToolGridUnderlay, { pixelartGridRef }),
			h(ToolRollCanvas, { pixelartGridRef }),
			h(ToolTransparentUnderlay, { pixelartGridRef }),
			h(ToolGridTransparency, { pixelartGridRef }),
		),
		h(Topmenu, null,
			h('button', { onclick: realignWindows }, 'reset windows positions'),
		),
		h(ResourcesWindow, {
			persistentId: ResourcesWindow.name,
			resources,
			draftApi,
			pixelartGridRef,
			onSelectedSprite(spriteData) {
				const isSaved = pixelartGridRef.current?.checkIsSaved() ?? true;
				if (!isSaved) {
					window.alert('masz niezapiszne zmiany, zapisz je albo usuń');

					return false;
				}

				setTypeAndData(spriteData);

				return true;
			},
		}),
	];
}
