import { useRef, useEffect } from 'preact-hooks';

export default function useKeyPressedTracker() {
	const pressedKeysRef = useRef({});

	useEffect(() => {
		function hanldeKeyDown(event) {
			const { key } = event;

			pressedKeysRef.current[key] = true;
		}

		function hanldeKeyUp(event) {
			const { key } = event;

			pressedKeysRef.current[key] = false;
		}

		document.body.addEventListener('keydown', hanldeKeyDown);
		document.body.addEventListener('keyup', hanldeKeyUp);

		return () => {
			document.body.removeEventListener('keydown', hanldeKeyDown);
			document.body.removeEventListener('keyup', hanldeKeyUp);
		};
	}, []);

	return pressedKeysRef;
}
