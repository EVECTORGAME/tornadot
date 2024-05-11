// export const COLOR_DARK = '#0C2233';
// https://lospec.com/palette-list/andrade-gameboy
// 0A91AB

// kolor bazowy:
// hsl(185, 80%, 50%)
// - żeby dobrać inny kolor bazowy: zmieniasz tylko drugą i trzecią liczbe
// - żeby do danego kolory dobrać lekki odcień modyfikujemy drugi parametr o 30%

const COLOR_SCHEME = {
	src: 'https://lospec.com/palette-list/andrade-gameboy',
	rocks: '#202020',
	green: '#5e6745',
	water: '#e3eec0',
	floor: '#aeba89',
};

export const COLOR_WATER = COLOR_SCHEME.water; // '#aeba89'; // bazowy kolor z https://colorkit.co/color/0a91ab/
export const COLOR_FLOOR = 0x30251d; // COLOR_SCHEME.floor; // = '#5e6745'; // '#01719c';
export const COLOR_GREEN = COLOR_SCHEME.green;
export const COLOR_ROCKS = COLOR_SCHEME.rocks;

export const COLOR_ACCENT = '#FFFF00';
export const COLOR_RED = '#FF0000';
export const COLOR_BLACK = '#000000';

export const MOUSE_X_SPEED_FACTOR = 0.002;
export const MOUSE_Y_SPEED_FACTOR = 0.001;

export const RESOURCES = {};
