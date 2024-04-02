export default function utilCreateDefer() {
	let resolver;
	const promise = new Promise((resolve) => {
		resolver = resolve;
	});

	return [promise, resolver];
}
