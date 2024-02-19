import { moduleGroups } from "@/data/groups";
import { type Module } from "@/data/modules.js";

export default function (module: Module, data: Record<string, string>) {
	for (const [key, value] of Object.entries(data)) {
		if (!["name", "ects", "semester", "group"].includes(key)) continue;

		const semester = data.semester
			? data.semester === "none"
				? data.semester
				: parseInt(data.semester)
			: undefined;

		const groupId = data.group
			? data.group === "none"
				? undefined
				: parseInt(data.group)
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
			case "group":
				module[key] = moduleGroups.value.find((g) => g.id === groupId);
				break;
		}
	}
}
