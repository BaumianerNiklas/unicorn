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

export function exportToJson() {
	const json = JSON.stringify({
		modules: modules.value,
		groups: moduleGroups.value,
	});
	const downloadUrl = URL.createObjectURL(new Blob([json]));

	// I don't know of another way of downloading a file than
	// creating a phantom anchor element, setting its download attributes and clicking it
	const anchor = document.createElement("a");
	anchor.setAttribute("download", "unicorn.json");
	anchor.setAttribute("href", downloadUrl);
	anchor.click();

	// cleanup
	anchor.remove();
	URL.revokeObjectURL(downloadUrl);
}
