import { ref } from "vue";

export type Module = {
	id: number;
	name: string;
	semester?: number | "none";
	ects: number;
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
