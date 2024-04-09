export default function createChronos(onTick, { initialDelayMilliseconds = 0, doInitialSyncCall = false }) {
	let isRunning = true;
	let prevMilliseconds;

	let handleTimeUpdate = () => {
		const nowMilliseconds = Date.now();
		const deltaMilliseconds = nowMilliseconds - prevMilliseconds;

		prevMilliseconds = nowMilliseconds;

		if (deltaMilliseconds > 1000) {
			//
		} else if (deltaMilliseconds > 16) {
			const deltaSeconds = deltaMilliseconds / 1000;

			if (isRunning) {
				onTick(deltaSeconds);
			}
		}

		window.requestAnimationFrame(() => {
			handleTimeUpdate?.();
		});
	};

	if (doInitialSyncCall) {
		handleTimeUpdate(0, 0);
	}

	const initialDelayTimerId = setTimeout(() => {
		prevMilliseconds = Date.now();

		handleTimeUpdate?.();
	}, initialDelayMilliseconds);

	return {
		destroy() {
			clearTimeout(initialDelayTimerId);
			handleTimeUpdate = undefined;
		},
		setIsRunning(shouldBeRunning) {
			isRunning = shouldBeRunning;
		},
	};
}
