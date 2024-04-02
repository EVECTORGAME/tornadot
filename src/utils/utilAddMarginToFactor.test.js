import { describe, expect, it } from '@jest/globals';
import utilAddMarginToFactor from './utilAddMarginToFactor.js';

describe('./utilAddMarginToFactor.js', () => {
	it('should add margin to factor', () => {
		expect(utilAddMarginToFactor(0.5, 0)).toEqual(0.5);
		expect(utilAddMarginToFactor(0.5, 0.5)).toEqual(0.75);
		expect(utilAddMarginToFactor(0.5, 1)).toEqual(1);
	});
});
