import isValidColor from "@/util/isValidColor";
import { ref, type Ref } from "vue";

export type ModuleGroup = {
	id: number;
	name: string;
	color: string;
};

let id = 0;

export const moduleGroups: Ref<ModuleGroup[]> = ref([
	{
		id: id++,
		name: "Mathematik und Theoretische Informatik",
		color: "#00ff00",
	},
]);

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
}
