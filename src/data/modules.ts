import { ref } from "vue";
import { moduleGroups, type ModuleGroup } from "./groups";
import parseNoneableStringToInt from "@/util/parseNoneableStringToInt";

export type Module = {
	id: number;
	name: string;
	semester?: number;
	ects: number;
	group?: ModuleGroup;
};

let id = 0;

export const modules = ref<Module[]>([
	{
		id: id++,
		name: "Lineare Algebra I",
		semester: 1,
		ects: 9,
	},
]);

export function addModule(data: Record<string, string>) {
	if (!data.name || !data.ects) {
		alert("Received invalid data for this module. Try adding it again.");
		return;
	}

	const semester = parseNoneableStringToInt(data.semester);
	const groupId = parseNoneableStringToInt(data.group);

	const newModule: Module = {
		id: id++,
		name: data.name,
		ects: parseInt(data.ects),
	};

	if (semester) newModule.semester = semester;
	if (groupId) newModule.group = moduleGroups.value.find((g) => g.id === groupId);

	modules.value.push(newModule);
}

export function editModule(module: Module, data: Record<string, string>) {
	for (const [key, value] of Object.entries(data)) {
		if (!["name", "ects", "semester", "group"].includes(key)) continue;

		const groupId = parseNoneableStringToInt(data.group);

		switch (key) {
			case "name":
				module[key] = value;
				break;
			case "semester":
				module[key] = parseNoneableStringToInt(data.semester);
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

export function deleteModule(module: Module) {
	modules.value = modules.value.filter((m) => m !== module);
}
