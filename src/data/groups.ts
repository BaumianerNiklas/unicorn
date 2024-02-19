import { ref, type Ref } from "vue";

export type ModuleGroup = {
	id: number;
	name: string;
	color: string;
};

export const moduleGroups: Ref<ModuleGroup[]> = ref([
	{
		id: 1,
		name: "Mathematik und Theoretische Informatik",
		color: "#00ff00",
	},
]);
