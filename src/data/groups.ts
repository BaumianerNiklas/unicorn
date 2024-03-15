import { ref, type Ref } from "vue";
import { modules } from "./modules";
import maxBy from "@/util/maxBy";
import { isValidHexColor } from "@/util/colors";

export type ModuleGroup = {
	id: number;
	name: string;
	color: string;
};

let id = 0;

export const moduleGroups: Ref<ModuleGroup[]> = ref([]);

export function addModuleGroup(data: Record<string, string>) {
	if (!data.name || !data.color || !isValidHexColor(data.color)) {
		alert("Received invalid data for this module group. Try adding it again.");
		return;
	}

	moduleGroups.value.push({
		id: id++,
		name: data.name,
		color: data.color,
	});
}

export function editModuleGroup(group: ModuleGroup, data: Record<string, string>) {
	if (!data.name || !data.color || !isValidHexColor(data.color)) {
		alert("Received invalid data for this module group. Try adding it again.");
		return;
	}

	for (const [key, value] of Object.entries(data)) {
		if (!["name", "color"].includes(key)) continue;

		// @ts-expect-error At this point key can only be a valid key for a ModuleGroup
		group[key] = value;
	}
}

export function deleteModuleGroup(group: ModuleGroup) {
	moduleGroups.value = moduleGroups.value.filter((g) => g !== group);

	modules.value.forEach((module) => {
		if (module.groupId === group.id) module.groupId = undefined;
	});
}

export function setModuleGroups(newModuleGroups: ModuleGroup[]) {
	moduleGroups.value = newModuleGroups;

	id = maxBy(moduleGroups.value, (g) => g.id) + 1;
}

export function isValidModuleGroup(moduleGroup: unknown): moduleGroup is ModuleGroup {
	// check if module is object (typeof arrays/null is also "object")
	if (!moduleGroup || typeof moduleGroup !== "object" || Array.isArray(moduleGroup)) return false;

	const obj = moduleGroup as Record<string | number | symbol, unknown>;

	// check for required keys
	if (
		typeof obj.id !== "number" ||
		typeof obj.name !== "string" ||
		typeof obj.color !== "string" ||
		!isValidHexColor(obj.color)
	)
		return false;

	return true;
}
