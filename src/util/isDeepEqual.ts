/**
 * Recursively compares any two values for deep equality.
 * For arrays, see if all their elements match.
 * For objects, see if all key/value pairs match.
 */
export default function isDeepEqual(a: any, b: any) {
	// primitive checks
	if (Object.is(a, b)) return true;

	// array checks
	if (Array.isArray(a) && Array.isArray(b)) {
		// two arrays can't be equal if their lengths differ
		if (a.length !== b.length) return false;

		// deep compare every element of both ararys
		for (const [i, aElem] of a.entries()) {
			if (!isDeepEqual(aElem, b[i])) return false;
		}

		// no element differed, so arrays are equal
		return true;
	}

	// object checks
	if (typeof a === "object" && typeof b === "object") {
		// this check is only for type safety
		// if one or both of the arguments were null, the function would have already ended at the Object.is check
		if (a === null || b === null) return;

		// check if every key in a is also in b and has the same value
		for (const [key, aValue] of Object.entries(a)) {
			if (!(key in b) || !isDeepEqual(aValue, b[key])) return false;
		}

		// no key/value pair differed, so objects are equal
		return true;
	}

	// if the code gets here, a and b have different types
	return false;
}
