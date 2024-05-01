import { h } from 'preact';
import { useRef, useLayoutEffect } from 'preact-hooks';
import classNames from 'clsx';
import useDragging from '../hooks/useDragging.js';
import useTopZIndex from '../hooks/useTopZIndex.js';
import useTrackInstances from '../hooks/useTrackInstances.js';
import usePersistent from '../hooks/usePersistent.js';

export const TitleBarButtonClose = () => h('button', { 'aria-label': 'Close' });
export const TitleBarButtonMinimize = () => h('button', { 'aria-label': 'Minimize' });
export const TitleBarButtonMaximize = () => h('button', { 'aria-label': 'Maximize' });
export const TitleBarButtonHelp = () => h('button', { 'aria-label': 'Help' });

const WINDOW_POSITION_PADDING_PIXELD = 15;
const windows = new Set();

export function realignWindows() {
	Array.from(windows).forEach((windowRef, index) => {
		const number = index + 1;
		const position = `${number * WINDOW_POSITION_PADDING_PIXELD}px`;

		windowRef.current.style.top = position;
		windowRef.current.style.left = position;
	});
}

export default function Window({
	persistentId,
	title,
	width,
	children,
	childrenTitleBarButtons,
	childrenClassName,
}) {
	const windowRef = useRef();
	const titleRef = useRef();
	const instanceNumber = useTrackInstances(windows, windowRef);

	const [{ top, left }, saveParams] = usePersistent(persistentId, {
		top: `${instanceNumber * WINDOW_POSITION_PADDING_PIXELD}px`,
		left: `${instanceNumber * WINDOW_POSITION_PADDING_PIXELD}px`,
	});

	useDragging(windowRef, titleRef, {
		onDragEnded: ({ left: x, top: y }) => {
			saveParams({ left: x, top: y });
		},
	});

	useTopZIndex(windowRef);

	useLayoutEffect(() => {
		// windows.add(windowRef);

		return () => {
			// windows.remove(windowRef);
		};
	}, []);

	return (
		h('div', { className: 'window', style: { width, position: 'absolute', top, left }, ref: windowRef },
			h('div', { className: 'title-bar', ref: titleRef },
				h('div', { className: 'title-bar-text', style: { 'white-space': 'nowrap', 'cursor': 'default' } },
					title,
				),
				h('div', { className: 'title-bar-controls', style: { 'flex-wrap': 'nowrap' } },
					childrenTitleBarButtons,
				),
			),
			h('div', { className: classNames('window-body', childrenClassName) },
				// h('p', null, 'There are just so many possibilities:'),
				/* h('ul', null,
					h('li', null, 'A Task Manager'),
					h('li', null, 'A Notepad'),
					h('li', null, 'Or even a File Explorer!'),
				), */
				children,
			),
			h('div', { className: 'status-bar' },
				h('p', { className: 'status-bar-field' }, 'Press F1 for help'),
			),
		)
	);
}
