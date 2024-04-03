import { useRef, useCallback } from 'preact-hooks';

export default function useLocalStorageValue(key, initialValue) {
	const valueRef = useRef();
	const isInitedRef = useRef(false);
	if (!isInitedRef.current) {
		isInitedRef.current = true;

		valueRef.current = Number(localStorage.getItem(key)) || initialValue;
	}

	const setNeWValue = useCallback((newValue) => {
		localStorage.setItem(key, newValue);
		valueRef.current = newValue;
	}, []);

	return [valueRef.current, setNeWValue];
}
