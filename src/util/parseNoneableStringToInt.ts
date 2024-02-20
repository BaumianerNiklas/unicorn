// Whacky function name for a little utility that just unwraps a string that could be undefined or "none"
// to its integer representation or undefined.
// Primarily used for creation/updates using forms where "None" is a valid option that should set the
// corresponsing field to undefined.
export default function (str?: string): number | undefined {
	return str ? (str === "none" ? undefined : parseInt(str)) : undefined;
}
