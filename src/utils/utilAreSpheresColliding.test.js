import { describe, expect, it } from '@jest/globals';
import utilAreSpheresColliding from './utilAreSpheresColliding.js';

describe('./utilAreSpheresColliding.js', () => {
	it('should add margin to factor', () => {
		expect(utilAreSpheresColliding({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 4 }, 3, 1)).toEqual(false);
		expect(utilAreSpheresColliding({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 2 }, 3, 1)).toEqual(false);
	});
});
