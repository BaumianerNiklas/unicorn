<script setup lang="ts">
import { modules as allModules, type Module, id as moduleId } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";
import editModule from "@/util/editModule.js";
import ModuleCard from "./ModuleCard.vue";
import FormModal from "./FormModal.vue";
import SemesterUpdateForm from "./SemesterUpdateForm.vue";
import { computed } from "vue";
import { moduleGroups } from "@/data/groups";

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
</script>

<template>
	<menu>
		<label>
			Semester Count
			<input required type="number" v-model="semesterCount" name="semesterCount" />
		</label>

		<FormModal @submit="addModule" reset-on-close>
			<template v-slot:open-button>Add module</template>

			<template v-slot:form-elements>
				<label>Name <input required type="text" name="name" /></label>
				<label>ECTS <input required type="number" name="ects" /></label>
				<label>
					Group
					<select name="group">
						<option value="none">None</option>
						<option v-for="group in moduleGroups" :value="group.id" :key="group.id">
							{{ group.name }}
						</option>
					</select>
				</label>
				<label>
					Semester

					<select name="semester">
						<option value="none">None</option>
						<option v-for="semester in semesterCount" :value="semester" :key="semester">
							{{ semester }}
						</option>
					</select>
				</label>
			</template>
		</FormModal>
		<div v-for="module in modules" :key="module.id">
			<FormModal reset-on-close @submit="(data) => editModule(module, data)">
				<template v-slot:form-elements>
					<SemesterUpdateForm :module="module" />
				</template>

				<template v-slot:open-button>
					<ModuleCard :module="module" />
				</template>
			</FormModal>
		</div>
	</menu>
</template>
