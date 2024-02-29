<script setup lang="ts">
import { modules as allModules, editModule, sortModules } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed } from "vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import semesterDropzoneHandler from "@/util/semesterDropzoneHandler";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));

function handleDrop(event: DragEvent, sortIndex?: number) {
	semesterDropzoneHandler(event, semester, sortIndex);
	if (modules.value.length >= 2) sortModules(modules.value);
}
</script>

<template>
	<div>
		<span>{{ semester }}. semester ({{ totalEcts }})</span>
		<div class="flex">
			<div v-for="(module, index) in sortModules(modules)" :key="module.id" class="flex">
				<div @dragover.prevent @drop="(ev) => handleDrop(ev, index)" class="bg-blue h-full">
					drop
				</div>
				<FormModal reset-on-close @submit="(data) => editModule(module, data)">
					<template v-slot:form-elements>
						<ModuleForm :module="module" />
					</template>

					<template v-slot:open-button>
						<ModuleCard :module="module" />
					</template>
				</FormModal>
			</div>
			<div @dragover.prevent @drop="(ev) => handleDrop(ev)" class="bg-blue h-full">drop</div>
		</div>
	</div>
</template>
