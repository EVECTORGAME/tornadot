import { h } from 'preact';
import { useCallback } from 'preact-hooks';

export default function ToolGridUnderlay({ pixelartGridRef }) {
	const handleToggle = useCallback(() => {
		const isShowed = pixelartGridRef.current.checkIsGridShowed();

		pixelartGridRef.current.setShouldShowGrid(!isShowed);
	}, []);

	return (
		h('button',
			{
				onclick: handleToggle,
			},
			'toggle grid',
		)
	);
}
