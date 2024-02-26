import { ref } from "vue";
import { modules } from "./modules";

export const semesterCount = ref(6);

export function addSemester() {
	semesterCount.value += 1;
}

export function removeSemester() {
	// Make sure no modules get lost by removing the semester property of modules that are in the semester about to get removed
	for (const module of modules.value) {
		if (module.semester === semesterCount.value) delete module.semester;
	}

	semesterCount.value -= 1;
}
