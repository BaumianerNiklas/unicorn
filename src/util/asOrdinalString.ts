/**
 * Returns the ordinal string representation of a number, i.e. with the suffix "st", "nd", "rd", or "th" added.
 */
export default function (number: number) {
	const numStr = number.toString();
	const lastDigit = numStr.at(-1);

	// i wish JS had a match operator...
	let suffix: string;
	// 11, 12, 13 are an exception and all have a "th" suffix
	if (number >= 11 && number <= 20) suffix = "th";
	else {
		// not using a switch since they're less readable here the way prettier formats them
		if (lastDigit === "1") suffix = "st";
		else if (lastDigit === "2") suffix = "nd";
		else if (lastDigit === "3") suffix = "rd";
		else suffix = "th";
	}

	return numStr + suffix;
}
