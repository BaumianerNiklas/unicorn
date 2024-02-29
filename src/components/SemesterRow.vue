<script setup lang="ts">
import { modules as allModules, editModule, sortModules } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed, watch } from "vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import semesterDropzoneHandler from "@/util/semesterDropzoneHandler";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));

watch(modules, () => sortModules(modules.value));
</script>

<template>
	<div draggable="true" @dragover.prevent @drop="(ev) => semesterDropzoneHandler(ev, semester)">
		<span>{{ semester }}. semester ({{ totalEcts }})</span>
		<div class="flex">
			<FormModal
				reset-on-close
				v-for="module in modules"
				:key="module.id"
				@submit="(data) => editModule(module, data)"
			>
				<template v-slot:form-elements>
					<ModuleForm :module="module" />
				</template>

				<template v-slot:open-button>
					<ModuleCard :module="module" />
				</template>
			</FormModal>
		</div>
	</div>
</template>
