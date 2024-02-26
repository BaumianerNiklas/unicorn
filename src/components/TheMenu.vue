<script setup lang="ts">
import { modules as allModules, addModule, editModule } from "@/data/modules.js";
import { addSemester, removeSemester, semesterCount } from "@/data/semesterCount.js";
import ModuleCard from "./ModuleCard.vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import { computed } from "vue";
import { moduleGroups, addModuleGroup } from "@/data/groups";
import { saveToLocalstorage, exportToJson, importFromJson } from "@/util/localStorage";
import ModuleGroupCard from "./ModuleGroupCard.vue";

const modules = computed(() => allModules.value.filter((m) => !m.semester));

function reset() {
	moduleGroups.value = [];
	allModules.value = [];
}

async function handleFileUpload(e: Event) {
	const files = (e.target as HTMLInputElement).files;

	if (files?.length !== 1) return;

	const json = await files.item(0)?.text();
	if (!json) return;
	importFromJson(json);
}
</script>

<template>
	<menu>
		<button @click="saveToLocalstorage">Save changes</button>
		<button @click="reset">Reset</button>
		<button @click="exportToJson">Export to JSON</button>

		<label>
			Import from JSON
			<input
				type="file"
				name="jsonImport"
				accept="application/json"
				@change="handleFileUpload"
				class="opacity-0 size-0"
			/>
		</label>

		<div>
			<span>Semesters:</span>
			<button @click="removeSemester">-</button>
			<span>{{ semesterCount }} </span>
			<button @click="addSemester">+</button>
		</div>

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
			<li v-for="group in moduleGroups" :key="group.id">
				<ModuleGroupCard :group="group"></ModuleGroupCard>
			</li>
		</ul>
	</menu>
</template>
