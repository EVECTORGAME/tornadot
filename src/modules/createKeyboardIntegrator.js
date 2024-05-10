export default function createKeyboardIntegrator() {
	const current = {};

	function handleDocumentVisibilityChanged() {
		Object.keys(current).forEach((key) => {
			current[key] = false;
		});
	}

	function handleKeyDown(event) {
		const { code } = event;

		current[code] = true;
	}

	function handleKeyUp(event) {
		const { code } = event;

		current[code] = false;
	}

	document.addEventListener('visibilitychange', handleDocumentVisibilityChanged, { passive: true });
	document.addEventListener('keydown', handleKeyDown, { passive: true });
	document.addEventListener('keyup', handleKeyUp, { passive: true });

	return {
		current,
		consumeIsPressed(keyPresedFlag) {
			const isPressed = current[keyPresedFlag];

			current[keyPresedFlag] = false;

			return isPressed;
		},
		destroy() {
			document.removeEventListener('visibilitychange', handleDocumentVisibilityChanged);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		},
	};
}
