import utilCreateDefer from '../utils/utilCreateDefer.js';
// import utilCreateDefer from '../utils/utilCreateDefer';
import utilAddMarginToFactor from '../utils/utilAddMarginToFactor.js';
import createChronos from './createChronos.js';

export default function createSplashscreen({ keyboardIntegrator, shouldSkipIntro = false }) {
	const splashscreenElement = document.getElementById('splashscreen');
	const continueElement = splashscreenElement.querySelector('.continue');

	const [pressAnyKeyPromise, pressAnyKeyResolve] = utilCreateDefer();

	const chronos = createChronos((deltaTimeMilliseconds, timeMilliseconds) => {
		const opacityFactor = Math.sin(timeMilliseconds * 0.01) * 0.5 + 0.5;
		const opacityFactorMargined = utilAddMarginToFactor(0.2, opacityFactor);

		continueElement.style.opacity = opacityFactorMargined;

		const isAnyKeyPressed = keyboardIntegrator.checkIsPressedAnyKey();
		if (isAnyKeyPressed) {
			pressAnyKeyResolve();
		}
	}, { initialDelayMilliseconds: 1000 });

	if (shouldSkipIntro) {
		pressAnyKeyResolve();
	}

	return {
		waitUntilUserPressedAnyKey() {
			return pressAnyKeyPromise;
		},
		destroy() {
			chronos.destroy();
			splashscreenElement.parentElement.removeChild(splashscreenElement);
		},
	};
}
