import { ref } from "vue";
import type { ModuleGroup } from "./groups";

export type Module = {
	id: number;
	name: string;
	semester?: number | "none";
	ects: number;
	group?: ModuleGroup;
};

export const id = ref(0);

export const modules = ref<Module[]>([
	{
		id: id.value++,
		name: "Lineare Algebra I",
		semester: 1,
		ects: 9,
	},
]);
