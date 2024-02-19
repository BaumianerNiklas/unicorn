<script setup lang="ts">
import { modules as allModules } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed } from "vue";
import FormModal from "./FormModal.vue";
import SemesterUpdateForm from "./SemesterUpdateForm.vue";
import editModule from "@/util/editModule";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));
</script>

<template>
	<div>
		<span>{{ semester }}. semester ({{ totalEcts }})</span>
		<div class="flex">
			<FormModal
				reset-on-close
				v-for="module in modules"
				:key="module.id"
				@submit="(data) => editModule(module, data)"
			>
				<template v-slot:form-elements>
					<SemesterUpdateForm :module="module" />
				</template>

				<template v-slot:open-button>
					<ModuleCard :module="module" />
				</template>
			</FormModal>
		</div>
	</div>
</template>
