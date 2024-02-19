import { ref } from "vue";
import type { ModuleGroup } from "./groups";

export type Module = {
	id: number;
	name: string;
	semester?: number | "none";
	ects: number;
	group?: ModuleGroup;
};

export const modules = ref<Module[]>([
	{
		id: 1,
		name: "Lineare Algebra I",
		semester: 1,
		ects: 9,
	},
]);

export const id = ref(0);
