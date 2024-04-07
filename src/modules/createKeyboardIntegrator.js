// import utilCreateDefer from '../utils/utilCreateDefer.js';

export default function createKeyboardIntegrator() {
	/* const EVENT_KEY_TO_FLAG = {
		ArrowLeft: 'isLeft',
		a: 'isStepLeft',
		ArrowRight: 'isRight',
		d: 'isStepRight',
		ArrowUp: 'isForward',
		ArrowDown: 'isBackward',
		Enter: 'isAction',
		Space: 'isAction',
		Escape: 'isCancel',
		Backspace: 'isCancel',
	}; */

	/* const EVENT_FLAG_TO_PRESSED_FLAG = {
		isLeft: 'isLeftPressed',
		isRight: 'isRightPressed',
		isForward: 'isUpPressed',
		isBackward: 'isDownPressed',
		isAction: 'isActionPressed',
		isCancel: 'isCancelPressed',
	}; */

	/* const EVENT_FLAG_TO_HOLDED_FLAG = {
		isLeft: 'isLeftHolded',
		isRight: 'isRightHolded',
		isForward: 'isForwardHolded',
		isBackward: 'isBackwardHolded',
		isStepLeft: 'isStepLeftHolded',
		isStepRight: 'isStepRightHolded',
		// isAction: 'isActionHolded',
		// isCancel: 'isCancelHolded',
	}; */

	/* const currentPressed = {
	}; */

	const current = {
		// isForwardHolded: false,
		// isLeftHolded: false,
		// isRightHolded: false,
		// isBackwardHolded: false,
		// isStepLeftHolded: false,
		// isStepRightHolded: false,
	};

	// let anyKeyResolvers;
	// let handlers = [];

	function handleDocumentVisibilityChanged() {
		Object.keys(current).forEach((key) => {
			current[key] = false;
		});
	}

	function handleKeyDown(event) {
		const { code } = event;

		current[code] = true;
		/* if (anyKeyResolvers) {
			anyKeyResolvers.forEach((resolver) => {
				resolver?.();
			});

			anyKeyResolvers = undefined;
		} */

		/* const keyAlias = EVENT_KEY_TO_FLAG[event.code];
		if (keyAlias) {
			const keyPresedFlag = EVENT_FLAG_TO_PRESSED_FLAG[keyAlias];
			if (keyPresedFlag) {
				currentPressed[keyPresedFlag] = true;

				handlers.forEach((handler) => {
					handler({ [keyPresedFlag]: true });
				});
			}

			const keyHoldedFlag = EVENT_FLAG_TO_HOLDED_FLAG[keyAlias];
			if (keyHoldedFlag) {
				current[keyHoldedFlag] = true;
			}
		} */
	}

	function handleKeyUp(event) {
		const { code } = event;

		current[code] = false;
		/* const keyAlias = EVENT_KEY_TO_FLAG[event.key];
		if (keyAlias) {
			const keyHoldedFlag = EVENT_FLAG_TO_HOLDED_FLAG[keyAlias];
			if (keyHoldedFlag) {
				current[keyHoldedFlag] = false;
			}
		} */
	}

	document.addEventListener('visibilitychange', handleDocumentVisibilityChanged);
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);

	return {
		current,
		/* checkIsPressedAnyKey() {
			const isAnyPressed = Object.values(current).some(value => value === true);

			return isAnyPressed;
		}, */
		/* obtainPressAnyKeyPromise() {
			const [anyKeyDefer, anyKeyResolver] = utilCreateDefer();

			if (!anyKeyResolvers) {
				anyKeyResolvers = [];
			}

			anyKeyResolvers.push(anyKeyResolver);

			return anyKeyDefer;
		}, */
		/* addListener(handler) {
			handlers.push(handler);
		}, */
		/* removeListener(handlerToRemove) {
			handlers = handlers.filter(handler => handler !== handlerToRemove);
		}, */
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
