import { ref, type Ref } from "vue";

export type ModuleGroup = {
	id: number;
	name: string;
	color: string;
};

export const id = ref(0);

export const moduleGroups: Ref<ModuleGroup[]> = ref([
	{
		id: id.value++,
		name: "Mathematik und Theoretische Informatik",
		color: "#00ff00",
	},
]);
