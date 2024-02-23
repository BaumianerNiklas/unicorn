import { ref } from "vue";
import { moduleGroups, type ModuleGroup, isValidModuleGroup } from "./groups";
import parseNoneableStringToInt from "@/util/parseNoneableStringToInt";

export const VALID_GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0] as const;
export type Grade = (typeof VALID_GRADES)[number];

export type Module = {
	id: number;
	name: string;
	semester?: number;
	ects: number;
	grade?: Grade;
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
	const grade = data.grade
		? data.grade === "none"
			? undefined
			: parseFloat(data.grade)
		: undefined;
	const groupId = parseNoneableStringToInt(data.group);

	const newModule: Module = {
		id: id++,
		name: data.name,
		ects: parseInt(data.ects),
	};

	if (semester) newModule.semester = semester;
	if (grade && VALID_GRADES.includes(grade as Grade)) newModule.grade = grade as Grade;
	if (groupId) newModule.group = moduleGroups.value.find((g) => g.id === groupId);

	modules.value.push(newModule);
}

export function editModule(module: Module, data: Record<string, string>) {
	for (const [key, value] of Object.entries(data)) {
		if (!["name", "ects", "semester", "group", "grade"].includes(key)) continue;

		const grade = data.grade
			? data.grade === "none"
				? undefined
				: parseFloat(data.grade)
			: undefined;
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
			case "grade":
				module[key] = VALID_GRADES.includes(grade as Grade) ? (grade as Grade) : undefined;
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
export function isValidModule(module: unknown): module is Module {
	// check if module is object (typeof arrays/null is also "object")
	if (!module || typeof module !== "object" || Array.isArray(module)) return false;

	const obj = module as Record<string | number | symbol, unknown>;

	// check for required keys
	if (typeof obj.id !== "number" || typeof obj.name !== "string" || typeof obj.ects !== "number")
		return false;

	// check optional keys
	if (obj.semester) {
		if (typeof obj.semester !== "number" || obj.semester <= 0) return false;
	}

	if (obj.group && !isValidModuleGroup(obj.group)) return false;

	return true;
}

export function averageGrade(modules: Module[]) {
	// only need to look at modules that have a grade
	modules = modules.filter((m) => !!m.grade);

	const totalEcts = modules.reduce((acc, curr) => acc + curr.ects, 0);
	const weightedGradeSum = modules.reduce((acc, curr) => acc + curr.grade! * curr.ects, 0);

	return weightedGradeSum / totalEcts;
}
