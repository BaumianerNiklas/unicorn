<script setup lang="ts">
import { modules as allModules, editModule } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed } from "vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));

function handleDrop(e: DragEvent) {
	const data = e.dataTransfer?.getData("text/plain");
	if (!data) return;

	const id = parseInt(data);

	const module = allModules.value.find((m) => m.id === id);
	if (!module) return;

	module.semester = semester;
}
</script>

<template>
	<div draggable="true" @dragover.prevent @drop="handleDrop">
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
