export default function <T>(
	array: T[],
	selector: (element: T) => number,
	defaultMax: number = 0,
): number {
	return array.reduce((acc, curr) => Math.max(acc, selector(curr)), defaultMax);
}
