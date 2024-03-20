<script setup lang="ts">
import { modules as allModules, addModule, editModule, sortModules } from "@/data/modules.js";
import { addSemester, removeSemester, semesterCount } from "@/data/semesterCount.js";
import ModuleCard from "./ModuleCard.vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import { computed } from "vue";
import { moduleGroups, addModuleGroup } from "@/data/groups";
import { saveToLocalstorage, exportToJson, importFromJson } from "@/util/localStorage";
import ModuleGroupCard from "./ModuleGroupCard.vue";
import ButtonWithIcon from "./ButtonWithIcon.vue";
import moduleDropzoneHandler from "@/util/moduleDropzoneHandler";

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
		<ButtonWithIcon @click="saveToLocalstorage" text="Save changes" icon="i-lucide-save" />
		<ButtonWithIcon @click="reset" text="Reset" icon="i-lucide-rotate-ccw" />
		<ButtonWithIcon @click="exportToJson" text="Export to JSON" icon="i-lucide-upload" />

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
		<FormModal title="Create new module" @submit="addModule" reset-on-close>
			<template v-slot:open-button>
				<ButtonWithIcon icon="i-lucide-plus-circle" text="Add module" />
			</template>

			<template v-slot:form-elements>
				<ModuleForm />
			</template>
		</FormModal>
		<div @dragover.prevent @drop="moduleDropzoneHandler" class="min-h-16 mt-4">
			<ul>
				<li v-for="module in sortModules(modules)" :key="module.id">
					<FormModal
						:title="`Edit ${module.name}`"
						reset-on-close
						@submit="(data) => editModule(module, data)"
					>
						<template v-slot:form-elements>
							<ModuleForm :module="module" />
						</template>
						<template v-slot:open-button>
							<ModuleCard :module="module" />
						</template>
					</FormModal>
				</li>
			</ul>
		</div>

		<h2>Your module groups</h2>
		<FormModal title="Create new module group" reset-on-close @submit="addModuleGroup">
			<template v-slot:open-button>
				<ButtonWithIcon icon="i-lucide-circle-plus" text="Add group" />
			</template>

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
