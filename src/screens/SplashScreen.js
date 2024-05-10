import { useState, useEffect } from 'preact-hooks';

export default function SplashScreen({ elementId, children }) {
	const [isActive, setIsActive] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setIsActive(false);
		}, 1);
	}, []);

	useEffect(() => {
		const element = document.getElementById(elementId);

		return () => {
			element.parentElement.removeChild(element);
		};
	}, [isActive]);

	if (isActive) {
		return null;
	}

	return children;
}

/* doukraść animację

import utilCreateDefer from '../utils/utilCreateDefer.js';
import utilAddMarginToFactor from '../utils/utilAddMarginToFactor.js';
import utilSinusFactor from '../utils/utilSinusFactor.js';
import createChronos from '../modules/createChronos.js';

export default function createSplashscreen({ keyboardIntegrator, shouldSkipIntro = false }) {
	const splashscreenElement = document.getElementById('splashscreen');
	const continueElement = splashscreenElement.querySelector('.continue');

	const [pressAnyKeyPromise, pressAnyKeyResolve] = utilCreateDefer();

	const chronos = createChronos((deltaTimeMilliseconds, timeMilliseconds) => {
		const opacityFactor = utilSinusFactor(timeMilliseconds * 0.01);
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

*/
