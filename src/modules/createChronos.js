export default function createChronos(onTick, { initialDelayMilliseconds = 0, doInitialSyncCall = false }) {
	let prevMilliseconds;
	let accumulatorMilliseconds = 0;

	let handleTimeUpdate = () => {
		const nowMilliseconds = Date.now();
		const deltaMilliseconds = nowMilliseconds - prevMilliseconds;

		prevMilliseconds = nowMilliseconds;

		if (deltaMilliseconds > 1000) {
			//
		} else if (deltaMilliseconds > 16) {
			accumulatorMilliseconds += deltaMilliseconds;

			onTick(deltaMilliseconds, accumulatorMilliseconds);
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
	};
}
