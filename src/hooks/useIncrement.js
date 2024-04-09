import { useState, useCallback } from 'preact-hooks';

export default function useIncrement() {
	const [counter, setCounter] = useState(1);
	const increaseCounter = useCallback((currentCounter) => {
		setCounter(currentCounter + 1);
	}, []);

	return [counter, increaseCounter];
}
