import { useRef, useEffect } from 'preact-hooks';

export default function useKeyHook(keyCode, callback, dependencies) {
	const callbackRef = useRef();
	callbackRef.current = callback;

	useEffect(() => {
		function handleKeydown({ code }) {
			if (code === keyCode) {
				callbackRef.current();
			}
		}

		document.addEventListener('keydown', handleKeydown, { passive: true });

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, dependencies);
}
