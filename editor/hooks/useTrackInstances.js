import { useRef, useLayoutEffect } from 'preact-hooks';

export default function useTrackInstances(set, ref) {
	const instanceNumberRef = useRef();
	if (!instanceNumberRef.current) {
		set.add(ref);

		instanceNumberRef.current = set.size;
	}

	useLayoutEffect(() => () => {
		set.delete(ref);
	}, []);

	return instanceNumberRef.current;
}
