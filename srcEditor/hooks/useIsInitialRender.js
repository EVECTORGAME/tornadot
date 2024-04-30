import { useRef } from 'preact-hooks';

export default function useIsInitialRender() {
	const isInitialRenderRef = useRef(true);
	if (isInitialRenderRef.current) {
		isInitialRenderRef.current = false;

		return true;
	}

	return false;
}
