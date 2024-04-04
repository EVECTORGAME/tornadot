import utilCreateDefer from '../utils/utilCreateDefer.js';
import utilAddMarginToFactor from '../utils/utilAddMarginToFactor.js';
import createChronos from '../modules/createChronos.js';

export default function LevelEndedScreen() {
	const element = document.createElement('div');
	element.style.position = 'fixed';
	element.style.inset = 0;
	// element.style.backgroundColor = 'black';
	// element.style.opacity = 0;
	element.style.display = 'flex';
	element.style.flexDirection = 'column';
	element.style.justifyContent = 'center';
	element.style.alignItems = 'center';
	element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

	const elementLabel = document.createElement('div');
	elementLabel.innerText = 'level ended';
	element.appendChild(elementLabel);

	// BIGTODO

	document.body.appendChild(element);

	const [pressAnyKeyPromise, pressAnyKeyResolve] = utilCreateDefer();

	const chronos = createChronos((deltaTimeMilliseconds, timeMilliseconds) => {
		// const opacityFactor = Math.sin(timeMilliseconds * 0.01) * 0.5 + 0.5;
		// const opacityFactorMargined = utilAddMarginToFactor(0.2, opacityFactor);

		// continueElement.style.opacity = opacityFactorMargined;

		const isAnyKeyPressed = keyboardIntegrator.checkIsPressedAnyKey();
		if (isAnyKeyPressed) {
			pressAnyKeyResolve();
		}
	}, { initialDelayMilliseconds: 1000 });

	return {
		waitUntilUserPressedAnyKey() {
			return pressAnyKeyPromise;
		},
		destroy() {
			chronos.destroy();
			element.parentElement.removeChild(element);
		},
	};
}
