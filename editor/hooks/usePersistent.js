import { useRef, useCallback } from 'preact-hooks';

export default function usePersistent(id, defaultData) {
	const savedDataRef = useRef({});

	const saveData = useCallback((data) => {
		localStorage.setItem(`usePersistent(${id})`, JSON.stringify(data));
		savedDataRef.current = data;
	}, []);

	const isInitedRef = useRef(false);
	if (!isInitedRef.current) {
		isInitedRef.current = true;

		const storedParams = localStorage.getItem(`usePersistent(${id})`) ?? null;

		try {
			const data = JSON.parse(storedParams) ?? defaultData;

			return [data, saveData];
		} catch (error) {
			console.error('error while restoring:', `usePersistent(${id})`, error);

			localStorage.removeItem(`usePersistent(${id})`);

			return [defaultData, saveData];
		}
	}

	return [savedDataRef.current, saveData];
}
