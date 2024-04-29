import { useRef, useLayoutEffect } from 'preact-hooks';

export default function useTrackInstances(set, ref) {
	const instanceNumberRef = useRef();
	if (!instanceNumberRef.current) {
		set.add(ref);

		instanceNumberRef.current = set.size;
	}

	useLayoutEffect(() => () => {
		set.remove(ref);
	}, []);

	return instanceNumberRef.current;
}
