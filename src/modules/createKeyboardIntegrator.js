import utilCreateDefer from '../utils/utilCreateDefer.js';

export default function createKeyboardIntegrator() {
	const EVENT_KEY_TO_FLAG = {
		ArrowLeft: 'isLeft',
		A: 'isLeft',
		ArrowRight: 'isRight',
		D: 'isRight',
		ArrowUp: 'isForward',
		W: 'isForward',
		ArrowDown: 'isBackward',
		S: 'isBackward',
		Enter: 'isAction',
		Space: 'isAction',
		Escape: 'isCancel',
		Backspace: 'isCancel',
	};

	const EVENT_FLAG_TO_PRESSED_FLAG = {
		isLeft: 'isLeftPressed',
		isRight: 'isRightPressed',
		isForward: 'isUpPressed',
		isBackward: 'isDownPressed',
		isAction: 'isActionPressed',
		isCancel: 'isCancelPressed',
	};

	const EVENT_FLAG_TO_HOLDED_FLAG = {
		isLeft: 'isLeftHolded',
		isRight: 'isRightHolded',
		isForward: 'isForwardHolded',
		// isBackward: 'isBackwardHolded',
		// isAction: 'isActionHolded',
		// isCancel: 'isCancelHolded',
	};

	const current = {
		isForwardHolded: false,
		isLeftHolded: false,
		isRightHolded: false,
	};

	let anyKeyResolvers;
	let handlers = [];

	document.body.addEventListener('keydown', (event) => {
		if (anyKeyResolvers) {
			anyKeyResolvers.forEach((resolver) => {
				resolver?.();
			});

			anyKeyResolvers = undefined;
		}

		const keyAlias = EVENT_KEY_TO_FLAG[event.key];
		if (keyAlias) {
			const keyPresedFlag = EVENT_FLAG_TO_PRESSED_FLAG[keyAlias];
			if (keyPresedFlag) {
				handlers.forEach((handler) => {
					handler({ [keyPresedFlag]: true });
				});
			}

			const keyHoldedFlag = EVENT_FLAG_TO_HOLDED_FLAG[keyAlias];
			if (keyHoldedFlag) {
				current[keyHoldedFlag] = true;
			}
		}
	});

	document.body.addEventListener('keyup', (event) => {
		const keyAlias = EVENT_KEY_TO_FLAG[event.key];
		if (keyAlias) {
			const keyHoldedFlag = EVENT_FLAG_TO_HOLDED_FLAG[keyAlias];
			if (keyHoldedFlag) {
				current[keyHoldedFlag] = false;
			}
		}
	});

	return {
		current,
		checkIsPressedAnyKey() {
			const isAnyPressed = Object.values(current).some(value => value === true);

			return isAnyPressed;
		},
		obtainPressAnyKeyPromise() {
			const [anyKeyDefer, anyKeyResolver] = utilCreateDefer();

			if (!anyKeyResolvers) {
				anyKeyResolvers = [];
			}

			anyKeyResolvers.push(anyKeyResolver);

			return anyKeyDefer;
		},
		addListener(handler) {
			handlers.push(handler);
		},
		removeListener(handlerToRemove) {
			handlers = handlers.filter(handler => handler !== handlerToRemove);
		},
	};
}
