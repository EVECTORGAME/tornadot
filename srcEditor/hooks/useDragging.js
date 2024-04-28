import { useEffect } from 'preact-hooks';

export default function useDragging(windowRef, titleRef) {
	// Get the elements
	// const windowElement = document.getElementById('myWindow');
	// const titleBar = document.getElementById('titleBar');

	useEffect(() => {
		// Variables to store the initial position and status
		let isDragging = false;
		let initialX;
		let initialY;
		let offsetX;
		let offsetY;

		function handleMouseDown(event) {
			isDragging = true;
			initialX = event.clientX;
			initialY = event.clientY;

			// Calculate the offset from the top-left corner of the window
			offsetX = windowRef.current.offsetLeft - initialX;
			offsetY = windowRef.current.offsetTop - initialY;

			// Prevent default behavior (to avoid text selection or other issues)
			event.preventDefault();
		}

		function handleMouseMove(event) {
			if (isDragging) {
				// Calculate new position of the window
				const newX = event.clientX + offsetX;
				const newY = event.clientY + offsetY;

				// Update the window position
				windowRef.current.style.left = `${newX}px`;
				windowRef.current.style.top = `${newY}px`;
			}
		}

		function handleMouseUp() {
			isDragging = false;
		}

		// Event listener for mouse down on the title bar
		titleRef.current.addEventListener('mousedown', handleMouseDown);
		// Event listener for mouse move to handle dragging
		document.addEventListener('mousemove', handleMouseMove);
		// Event listener for mouse up to stop dragging
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			// Event listener for mouse down on the title bar
			titleRef.current.removeEventListener('mousedown', handleMouseDown);
			// Event listener for mouse move to handle dragging
			document.removeEventListener('mousemove', handleMouseMove);
			// Event listener for mouse up to stop dragging
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);
}
