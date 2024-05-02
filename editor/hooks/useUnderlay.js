import { useState, useCallback } from 'preact-hooks';

export default function useUnderlay() {
	const [underlayProps, setUnderlayProps] = useState({});
	const {
		styles: underlayStyles,
	} = underlayProps;

	const setProps = useCallback(({ styles }) => {
		setUnderlayProps({ styles });
	}, []);

	return [underlayStyles, setProps];
}
