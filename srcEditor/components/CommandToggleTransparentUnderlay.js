import { h } from 'preact';
import { useCallback } from 'preact-hooks';

export default function CommandToggleTransparentUnderlay({ pixelartGridRef }) {
	const handleToggle = useCallback(() => {
		// const isShowed = pixelartGridRef.current.checkIsGridShowed();

		pixelartGridRef.current.setShowTransparentUnderlay(undefined); // !isShowed);
	}, []);

	return (
		h('button',
			{
				onclick: handleToggle,
			},
			'toggle transparent underlay',
		)
	);
}
