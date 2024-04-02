import { ref } from "vue";
import { moduleGroups } from "./groups";
import parseNoneableStringToInt from "@/util/parseNoneableStringToInt";
import maxBy from "@/util/maxBy";
import { semesterCount } from "./semesterCount";

export const VALID_GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0] as const;
export type Grade = (typeof VALID_GRADES)[number];

export type Module = {
	id: number;
	name: string;
	semester?: number;
	ects: number;
	grade?: Grade;
	groupId?: number;
	sortIndex?: number;
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
	const groupId = parseNoneableStringToInt(data.groupId);

	const newModule: Module = {
		id: id++,
		name: data.name,
		ects: parseInt(data.ects),
	};

	if (semester) newModule.semester = semester;
	if (grade && VALID_GRADES.includes(grade as Grade)) newModule.grade = grade as Grade;
	if (groupId !== undefined && moduleGroups.value.some((g) => g.id === groupId))
		newModule.groupId = groupId;

	rearrangeModuleSortIndices(newModule);

	modules.value.push(newModule);
}

export function editModule(module: Module, data: Record<string, string>) {
	for (const [key, value] of Object.entries(data)) {
		if (!["name", "ects", "semester", "groupId", "grade", "sortIndex"].includes(key)) continue;

		const grade = data.grade
			? data.grade === "none"
				? undefined
				: parseFloat(data.grade)
			: undefined;
		const groupId = parseNoneableStringToInt(data.groupId);

		switch (key) {
			case "name":
				module[key] = value;
				break;
			case "semester":
				moveModuleToSemester(
					module,
					parseNoneableStringToInt(data.semester),
					module.sortIndex,
				);
				break;
			case "ects":
				module[key] = parseInt(value);
				break;
			case "grade":
				module[key] = VALID_GRADES.includes(grade as Grade) ? (grade as Grade) : undefined;
				break;
			case "groupId":
				module[key] = moduleGroups.value.some((g) => g.id === groupId)
					? groupId
					: undefined;
				break;
		}
	}

	rearrangeModuleSortIndices(module, module.sortIndex);
}

export function deleteModule(module: Module) {
	modules.value = modules.value.filter((m) => m.id !== module.id);
}

export function setModules(newModules: Module[]) {
	modules.value = newModules;

	id = maxBy(modules.value, (m) => m.id) + 1;
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

	if (obj.groupId && typeof obj.groupId !== "number") return false;

	return true;
}

export function averageGrade(modules: Module[]) {
	// only need to look at modules that have a grade
	modules = modules.filter((m) => !!m.grade);

	const totalEcts = modules.reduce((acc, curr) => acc + curr.ects, 0);
	const weightedGradeSum = modules.reduce((acc, curr) => acc + curr.grade! * curr.ects, 0);

	return weightedGradeSum / totalEcts;
}

export function moveModuleToSemester(module: Module, toSemester?: number, sortIndex?: number) {
	if (!toSemester) {
		delete module.semester;
		rearrangeModuleSortIndices(module, sortIndex);
		return;
	}

	if (toSemester <= 0 || toSemester > semesterCount.value) {
		console.error(
			`Tried moving module ${module.name} (${module.id}) to semester ${toSemester}, which is outside the valid range of semesters (1-${semesterCount})`,
		);
		return;
	}

	module.semester = toSemester;
	rearrangeModuleSortIndices(module, sortIndex);
}

export function rearrangeModuleSortIndices(pivotModule: Module, sortIndex?: number) {
	const modulesInSameSemester = modules.value.filter(
		(m) => m.id !== pivotModule.id && m.semester === pivotModule.semester,
	);

	if (sortIndex === undefined) {
		pivotModule.sortIndex = maxBy(modulesInSameSemester, (m) => m.sortIndex ?? 0, -1) + 1;
		return;
	} else {
		pivotModule.sortIndex = sortIndex;
	}

	for (const module of modulesInSameSemester) {
		if (module.sortIndex === undefined || module.sortIndex < sortIndex) continue;

		module.sortIndex += 1;
	}
}
