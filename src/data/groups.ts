import isValidColor from "@/util/isValidColor";
import { ref, type Ref } from "vue";
import { modules } from "./modules";

export type ModuleGroup = {
	id: number;
	name: string;
	color: string;
};

let id = 0;

export const moduleGroups: Ref<ModuleGroup[]> = ref([]);

export function addModuleGroup(data: Record<string, string>) {
	if (!data.name || !data.color || !isValidColor(data.color)) {
		alert("Recieved invalid data for this module group. Try adding it again.");
		return;
	}

	moduleGroups.value.push({
		id: id++,
		name: data.name,
		color: data.color,
	});
}

export function editModuleGroup(group: ModuleGroup, data: Record<string, string>) {
	if (!data.name || !data.color || !isValidColor(data.color)) {
		alert("Recieved invalid data for this module group. Try adding it again.");
		return;
	}

	for (const [key, value] of Object.entries(data)) {
		if (!["name", "color"].includes(key)) continue;

		// @ts-expect-error At this point key can only be a valid key for a ModuleGroup
		group[key] = value;
	}

	// Need to update all modules that have this group as they might not be the same pointer which
	// means the DOM wouldn't rerender
	for (const module of modules.value) {
		if (module.group?.id === group.id) module.group = group;
	}
}

export function deleteModuleGroup(group: ModuleGroup) {
	moduleGroups.value = moduleGroups.value.filter((g) => g !== group);

	modules.value.forEach((module) => {
		if (module.group?.id === group.id) module.group = undefined;
	});
}

export function setModuleGroups(newModuleGroups: ModuleGroup[]) {
	moduleGroups.value = newModuleGroups;

	id = moduleGroups.value.reduce((acc, curr) => Math.max(acc, curr.id), id) + 1;
}
