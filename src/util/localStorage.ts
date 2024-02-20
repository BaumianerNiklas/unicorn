import { moduleGroups, setModuleGroups } from "@/data/groups";
import { modules, setModules } from "@/data/modules";

export function saveToLocalstorage() {
	localStorage.setItem("modules", JSON.stringify(modules.value));
	localStorage.setItem("groups", JSON.stringify(moduleGroups.value));
}

export function loadFromLocalstorage() {
	const modulesInStorage = localStorage.getItem("modules");
	const groupsInStorage = localStorage.getItem("groups");

	if (!modulesInStorage || !groupsInStorage) return;

	setModules(JSON.parse(modulesInStorage));
	setModuleGroups(JSON.parse(groupsInStorage));
}
