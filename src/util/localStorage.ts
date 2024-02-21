import { isValidModuleGroup, moduleGroups, setModuleGroups } from "@/data/groups";
import { isValidModule, modules, setModules } from "@/data/modules";

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

export function importFromJson(json: string) {
	const data = JSON.parse(json);

	// check if imported data is valid
	let valid = true;
	if (!Array.isArray(data.modules) || !Array.isArray(data.groups)) valid = false;

	if (valid && !data.modules.every(isValidModule)) valid = false;
	if (valid && !data.groups.every(isValidModuleGroup)) valid = false;

	if (!valid) {
		alert("This JSON file cannot be imported as it is not in the shape of a Unicorn export.");
		return;
	}

	setModules(data.modules);
	setModuleGroups(data.groups);
}
