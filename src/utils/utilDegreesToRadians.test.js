import { describe, expect, it } from '@jest/globals';
import utilDegreesToRadians from './utilDegreesToRadians.js';

describe('./utilDegreesToRadians.js', () => {
	it('should add margin to factor', () => {
		expect(utilDegreesToRadians(0)).toEqual(0);
		expect(utilDegreesToRadians(90)).toEqual(Math.PI * 0.5);
		expect(utilDegreesToRadians(180)).toEqual(Math.PI);
		expect(utilDegreesToRadians(360)).toEqual(0);
		expect(utilDegreesToRadians(370)).toBeCloseTo(0.1745, 3);
	});
});
