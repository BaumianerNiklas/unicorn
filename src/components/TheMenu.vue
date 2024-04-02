<script setup lang="ts">
import { modules as allModules, addModule } from "@/data/modules.js";
import { addSemester, removeSemester, semesterCount } from "@/data/semesterCount.js";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import { ref, computed } from "vue";
import { moduleGroups, addModuleGroup } from "@/data/groups";
import { saveToLocalstorage, exportToJson, importFromJson } from "@/util/localStorage";
import ModuleGroupCard from "./ModuleGroupCard.vue";
import ButtonWithIcon from "./ButtonWithIcon.vue";
import ModuleDropzone from "./ModuleDropzone.vue";

const modules = computed(() => allModules.value.filter((m) => !m.semester));

const importJsonInput = ref<HTMLInputElement>();

function reset() {
	moduleGroups.value = [];
	allModules.value = [];
}

async function handleFileUpload(e: Event) {
	let files: FileList | undefined | null;
	if (e instanceof DragEvent) {
		// drag & drop upload
		files = e.dataTransfer?.files;
	} else {
		// "click" upload
		files = (e.target as HTMLInputElement).files;
	}

	if (files?.length !== 1) {
		return alert("Can only upload one JSON file.");
	}

	const file = files.item(0);

	if (!file || file.type !== "application/json") {
		return alert("Can only import JSON files.");
	}

	const json = await file.text();
	if (!json) return;
	importFromJson(json);
}
</script>

<template>
	<menu>
		<ButtonWithIcon @click="saveToLocalstorage" text="Save changes" icon="i-lucide-save" />
		<ButtonWithIcon @click="reset" text="Reset" icon="i-lucide-rotate-ccw" />
		<ButtonWithIcon @click="exportToJson" text="Export to JSON" icon="i-lucide-upload" />

		<label @dragover.prevent @drop.prevent.stop="handleFileUpload">
			<ButtonWithIcon
				@click="importJsonInput?.click()"
				text="Import from JSON"
				icon="i-lucide-import"
			/>
			<input
				ref="importJsonInput"
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
		<ModuleDropzone :modules="modules" />

		<h2>Your module groups</h2>
		<FormModal title="Create new module group" reset-on-close @submit="addModuleGroup">
			<template v-slot:open-button>
				<ButtonWithIcon icon="i-lucide-circle-plus" text="Add group" />
			</template>

			<template v-slot:form-elements>
				<div>
					<label for="name-input">Name</label>
					<input type="text" required name="name" id="name-input" />
				</div>
				<div>
					<label for="color-input">Color</label>
					<input type="color" required name="color" id="color-input" />
				</div>
			</template>
		</FormModal>
		<ul>
			<li v-for="group in moduleGroups" :key="group.id" class="my-2">
				<ModuleGroupCard :group="group"></ModuleGroupCard>
			</li>
		</ul>
	</menu>
</template>
