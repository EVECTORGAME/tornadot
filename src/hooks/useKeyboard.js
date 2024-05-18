import {
	useRef,
	useCallback,
	useState,
	useLayoutEffect,
} from 'preact-hooks';

/*
	toggles: { // press cuases toggle
		E: 'showInventory',
		M: 'showMap',
	},
	holdes: { // active untill holded
		V: 'showRadarView',
	},
	presseds: {
		R: 'doRealod',
	},
	persistents: { // causes refresh
		I: 'isInvertMouse',
	},
*/

export default function useKeyboard({
	toggles,
	holdes,
	presseds,
	persistents,
}) {
	const flagsRefs = useRef({});
	const pressedRefs = useRef({});

	const [, setRefreshCounter] = useState(0);
	const refresh = useCallback(prev => setRefreshCounter(prev + 1), []);

	function handleKeyDown(event) {
		const { code } = event;

		let isAnyChangeDone = false;

		const toggleFlag = toggles[code];
		if (toggleFlag) {
			flagsRefs.current[toggleFlag] = !flagsRefs.current[toggleFlag];

			isAnyChangeDone = true;
		}

		const holdFlag = holdes[code];
		if (holdFlag && !flagsRefs.current[holdFlag]) {
			flagsRefs.current[holdFlag] = true;

			isAnyChangeDone = true;
		}

		const pressedFlag = presseds[code];
		if (pressedFlag) {
			pressedRefs.current[pressedFlag] = true;

			isAnyChangeDone = true;
		}

		if (isAnyChangeDone) {
			refresh();
		}
	}

	function handleKeyUp(event) {
		const { code } = event;

		let isAnyChangeDone = false;

		const holdFlag = holdes[code];
		if (holdFlag) {
			flagsRefs.current[holdFlag] = false;

			isAnyChangeDone = true;
		}

		if (isAnyChangeDone) {
			refresh();
		}
	}

	useLayoutEffect(() => {
		// document.addEventListener('visibilitychange', handleDocumentVisibilityChanged, { passive: true });
		document.addEventListener('keydown', handleKeyDown, { passive: true });
		document.addEventListener('keyup', handleKeyUp, { passive: true });

		return () => {
			// document.removeEventListener('visibilitychange', handleDocumentVisibilityChanged);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	const result = {
		...flagsRefs.current,
		...pressedRefs.current,
	};

	pressedRefs.current = {};

	return result;
}
