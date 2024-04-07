import utilClamp from '../utils/utilClamp.js';

export default function createFactorPlusMinus({
	factorOfIncreasing,
	factorOfDecreasing,
}) {
	let factor = 0;

	return {
		update(timeDeltaSeconds, { shouldGoToMinus, shouldGoToPlus }) {
			if (shouldGoToMinus && shouldGoToPlus) {
				return factor;
			} else if (shouldGoToPlus) {
				factor = utilClamp(factor + (timeDeltaSeconds * factorOfIncreasing), -1, +1);

				return factor;
			} else if (shouldGoToMinus) {
				factor = utilClamp(factor - (timeDeltaSeconds * factorOfIncreasing), -1, +1);

				return factor;
			} else if (factor > 0) {
				factor = utilClamp(factor - (timeDeltaSeconds * factorOfDecreasing), 0, +1);

				return factor;
			} else if (factor < 0) {
				factor = utilClamp(factor + (timeDeltaSeconds * factorOfDecreasing), -1, 0);

				return factor;
			}

			return factor;
		},
		reverseAndMultiply(multiplyFactor) {
			factor = factor * -1 * multiplyFactor;
		},
	};
}
