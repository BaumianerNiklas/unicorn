export default function (str: string) {
	const regex = /#[0-9a-f]{6}/g;
	return regex.test(str);
}
