import { useRef } from 'preact-hooks';

export default function usePersistent(creator) {
	const valueRef = useRef();

	const isInitialRef = useRef(true);
	if (isInitialRef.current) {
		isInitialRef.current = false;

		valueRef.current = creator();
	}

	return valueRef.current;
}
