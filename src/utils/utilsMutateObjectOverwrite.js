export default function utilsMutateObjectOverwrite(destination, object) {
	Object.keys(object).forEach((key) => {
		destination[key] = object[key];
	});
}
