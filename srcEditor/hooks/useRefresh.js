import { useState, useCallback } from 'preact-hooks';

export default function useRefresh() {
	const [, setCounter] = useState(0);
	const refresh = useCallback(() => {
		setCounter(prev => prev + 1);
	}, []);

	return refresh;
}
