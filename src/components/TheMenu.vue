<script setup lang="ts">
import { modules as allModules, type Module, id as moduleId } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";
import editModule from "@/util/editModule.js";
import isValidColor from "@/util/isValidColor.js";
import ModuleCard from "./ModuleCard.vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import { computed } from "vue";
import { moduleGroups, id as groupId } from "@/data/groups";

const modules = computed(() => allModules.value.filter((m) => m.semester === "none"));

function addModule(data: Record<string, string>) {
	if (!data.name || !data.ects) {
		alert("Received invalid data for this module. Try adding it again.");
		return;
	}

	const semester = data.semester
		? data.semester === "none"
			? data.semester
			: parseInt(data.semester)
		: undefined;

	const groupId = data.group
		? data.group === "none"
			? undefined
			: parseInt(data.group)
		: undefined;

	const newModule: Module = {
		id: moduleId.value++,
		name: data.name,
		ects: parseInt(data.ects),
		semester,
	};

	if (groupId) newModule.group = moduleGroups.value.find((g) => g.id === groupId);

	allModules.value.push(newModule);
}

function addModuleGroup(data: Record<string, string>) {
	if (!data.name || !data.color || !isValidColor(data.color)) {
		alert("Recieved invalid data for this module group. Try adding it again.");
		return;
	}

	moduleGroups.value.push({
		id: groupId.value++,
		name: data.name,
		color: data.color,
	});
}
</script>

<template>
	<menu>
		<label>
			Semester Count
			<input required type="number" v-model="semesterCount" name="semesterCount" />
		</label>

		<h2>Your modules</h2>
		<FormModal @submit="addModule" reset-on-close>
			<template v-slot:open-button>Add module</template>

			<template v-slot:form-elements>
				<ModuleForm />
			</template>
		</FormModal>
		<ul>
			<li v-for="module in modules" :key="module.id">
				<FormModal reset-on-close @submit="(data) => editModule(module, data)">
					<template v-slot:form-elements>
						<ModuleForm :module="module" />
					</template>

					<template v-slot:open-button>
						<ModuleCard :module="module" />
					</template>
				</FormModal>
			</li>
		</ul>

		<h2>Your module groups</h2>
		<FormModal reset-on-close @submit="addModuleGroup">
			<template v-slot:open-button>Create new group</template>

			<template v-slot:form-elements>
				<label>Name <input type="text" name="name" /></label>
				<label>Color <input type="color" name="color" /></label>
			</template>
		</FormModal>
		<ul>
			<li
				v-for="group in moduleGroups"
				:key="group.id"
				:style="{ backgroundColor: group.color ?? 'initial' }"
			>
				{{ group.name }} ({{ allModules.filter((m) => m.group === group).length }})
			</li>
		</ul>
	</menu>
</template>
