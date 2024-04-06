import { ref, watch } from "vue";
import { modules } from "./modules";
import { moduleGroups } from "./groups";
import isDeepEqual from "@/util/isDeepEqual";

const hasUnsavedChanges = ref(false);

export function setupUnsavedChangesWatcher() {
	const initialState = JSON.parse(JSON.stringify([modules.value, moduleGroups.value]));

	return watch(
		[modules, moduleGroups],
		(newState) => {
			hasUnsavedChanges.value = !isDeepEqual(initialState, newState);
		},
		{ deep: true },
	);
}

export default hasUnsavedChanges;
