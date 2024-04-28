import { useEffect } from 'preact-hooks';

let topZIndex = 1;

export default function useTopZIndex(windowRef) {
	useEffect(() => {
		function handleClick() {
			topZIndex++;

			windowRef.current.style.zIndex = topZIndex;
		}

		windowRef.current.addEventListener('mousedown', handleClick);

		return () => {
			windowRef.current.removeEventListener('mousedown', handleClick);
		};
	}, []);
}
