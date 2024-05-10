export function condition(i, t, e) {
	return i ? t : e;
}

export function conditionCallback(i, t, e) {
	return i ? t() : e();
}
