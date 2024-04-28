import { h } from 'preact';
import { useRef } from 'preact-hooks';
import useDragging from '../hooks/useDragging.js';
import useTopZIndex from '../hooks/useTopZIndex.js';

export const TitleBarButtonClose = () => h('button', { 'aria-label': 'Close' });
export const TitleBarButtonMinimize = () => h('button', { 'aria-label': 'Minimize' });
export const TitleBarButtonMaximize = () => h('button', { 'aria-label': 'Maximize' });
export const TitleBarButtonHelp = () => h('button', { 'aria-label': 'Help' });

/*
	h(Window,
		{
			title: 'A Window With A Status Bar',
			childrenTitleBarButtons: [
				h(TitleBarButtonClose),
				h(TitleBarButtonMinimize),
				h(TitleBarButtonMaximize),
				h(TitleBarButtonHelp),
			],
		},
		'hello',
	),
*/

export default function Window({
	title,
	width,
	children,
	childrenTitleBarButtons,
	initialPosition,
}) {
	const windowRef = useRef();
	const titleRef = useRef();

	useDragging(windowRef, titleRef);
	useTopZIndex(windowRef);

	const initialPositionArgs = initialPosition === 'center'
		? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
		: {};

	return (
		h('div', { className: 'window', style: { width, position: 'absolute', ...initialPositionArgs }, ref: windowRef },
			h('div', { className: 'title-bar', ref: titleRef },
				h('div', { className: 'title-bar-text', style: { 'white-space': 'nowrap' } },
					title,
				),
				h('div', { className: 'title-bar-controls', style: { 'flex-wrap': 'nowrap' } },
					childrenTitleBarButtons,
				),
			),
			h('div', { className: 'window-body' },
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
