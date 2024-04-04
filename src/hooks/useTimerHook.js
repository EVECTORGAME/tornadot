import { h, render } from 'preact';
import { useState, useEffect, useRef } from 'preact-hooks';

function useAnimationFrame(callback) {
	const requestRef = useRef();

	const animate = () => {
		callback();
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(requestRef.current);
		};
	}, [callback]);

  	return requestRef.current;
}
