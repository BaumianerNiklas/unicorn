import { modules, moveModuleToSemester } from "@/data/modules";

export default function (event: DragEvent, semester?: number) {
	const data = event.dataTransfer?.getData("text/plain");
	if (!data) return;

	const id = parseInt(data);

	const module = modules.value.find((m) => m.id === id);
	if (!module) return;

	moveModuleToSemester(module, semester);
}
