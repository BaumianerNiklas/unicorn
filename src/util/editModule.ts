import { type Module } from "@/data/modules.js";

export default function (module: Module, data: Record<string, string>) {
	for (const [key, value] of Object.entries(data)) {
		if (!["name", "ects", "semester"].includes(key)) continue;

		const semester = data.semester
			? data.semester === "none"
				? data.semester
				: parseInt(data.semester)
			: undefined;

		switch (key) {
			case "name":
				module[key] = value;
				break;
			case "semester":
				module[key] = semester;
				break;
			case "ects":
				module[key] = parseInt(value);
				break;
		}
	}
}
