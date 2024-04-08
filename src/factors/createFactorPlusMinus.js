import utilClamp from '../utils/utilClamp.js';

export default function createFactorPlusMinus({
	factorOfIncreasing,
	factorOfDecreasing,
	factorOfContring,
}) {
	let factor = 0;

	return {
		update(timeDeltaSeconds, { shouldGoToMinus, shouldGoToPlus }) {
			if (shouldGoToMinus && shouldGoToPlus) {
				return factor;
			} else if (shouldGoToPlus) {
				const changeFactor = factor < 0 ? factorOfContring : factorOfIncreasing;

				factor = utilClamp(factor + (timeDeltaSeconds * changeFactor), -1, +1);

				return factor;
			} else if (shouldGoToMinus) {
				const changeFactor = factor > 0 ? factorOfContring : factorOfIncreasing;

				factor = utilClamp(factor - (timeDeltaSeconds * changeFactor), -1, +1);

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
