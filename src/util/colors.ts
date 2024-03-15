const HEX_COLOR_REGEX = /^#[0-9a-f]{6}$/;

// is valid hex color is literally just the test method on the regex
// need the bind for it to be callable
export const isValidHexColor = HEX_COLOR_REGEX.test.bind(HEX_COLOR_REGEX);

// https://www.w3.org/TR/AERT/#color-contrast
// https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color/1855903#1855903
export function calculatePerceivedBrightness(red: number, green: number, blue: number) {
	// Divide by 1000 to get a value between 0 and 255 (sum of weights is 1000)
	// Divide by 255 to get a value between 0 and 1
	return (red * 299 + green * 587 + blue * 114) / 1000 / 255;
}

export function getMostLegibleFontColor(
	red: number,
	green: number,
	blue: number,
): "black" | "white" {
	const perceivedBrightness = calculatePerceivedBrightness(red, green, blue);

	return perceivedBrightness > 0.5 ? "black" : "white";
}

/**
 * Converts a color in hex string format (`#rrggbb`) to its RGB values in an array `[r, g, b]`.
 * If `hexStr` is not a valid hex string, returns `[0, 0, 0]` (black).
 */
export function hexToRgb(hexStr: string): [number, number, number] {
	const FALLBACK = [0, 0, 0] satisfies [number, number, number];

	if (!isValidHexColor(hexStr)) return FALLBACK;

	hexStr = hexStr.substring(1); // get rid of the leading #

	const split = hexStr.match(/../g) ?? [];
	if (split.length !== 3) return FALLBACK; // a length unequal to 3 should never happen

	// @ts-expect-error TS can't infer this will always have length 3
	return split.map((segment) => parseInt(segment, 16));
}
