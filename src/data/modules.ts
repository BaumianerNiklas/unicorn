import { ref } from "vue";
import { moduleGroups, type ModuleGroup, isValidModuleGroup } from "./groups";
import parseNoneableStringToInt from "@/util/parseNoneableStringToInt";

export type Module = {
	id: number;
	name: string;
	semester?: number;
	ects: number;
	group?: ModuleGroup;
};

let id = 0;

export const modules = ref<Module[]>([]);

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
	modules.value = modules.value.filter((m) => m.id !== module.id);
}

export function setModules(newModules: Module[]) {
	modules.value = newModules;

	id = modules.value.reduce((acc, curr) => Math.max(acc, curr.id), id) + 1;
}

// I could import something like Zod to validate data like this, but this is relatively rudimentary and I
// did not want to include another dependency for this simple task
export function isValidModule(module: unknown) {
	// check if module is object (typeof arrays/null is also "object")
	if (module && typeof module === "object" && !Array.isArray(module)) return false;

	const obj = module as Record<string | number | symbol, unknown>;

	// check for required keys
	if (typeof obj.id !== "number" || typeof obj.name !== "string" || typeof obj.ects !== "number")
		return false;

	// check optional keys
	if (obj.semester && (typeof obj.smester !== "number" || (obj.semester as number) <= 0))
		// dont know why typescript doesnt infer the number type here     ^
		return false;

	if (obj.group && !isValidModuleGroup(obj.group)) return false;

	return true;
}
