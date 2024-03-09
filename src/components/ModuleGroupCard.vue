<script setup lang="ts">
import FormModal from "./FormModal.vue";
import { type ModuleGroup, editModuleGroup, deleteModuleGroup } from "@/data/groups";
import { modules as allModules, averageGrade } from "@/data/modules";
import { computed } from "vue";

const { group } = defineProps<{ group: ModuleGroup }>();

const modules = computed(() => allModules.value.filter((m) => m.groupId === group.id));

const avgGrade = computed(() => averageGrade(modules.value));
const avgGradeDisplay = computed(() => (isNaN(avgGrade.value) ? "/" : avgGrade.value.toFixed(2)));
</script>

<template>
	<span :style="{ backgroundColor: group.color ? group.color : 'initial' }">
		{{ group.name }}
	</span>
	<ul>
		<li>Modules: {{ modules.length }}</li>
		<li>Total ECTS: {{ modules.reduce((acc, curr) => acc + curr.ects, 0) }}</li>
		<li>Average Grade: {{ avgGradeDisplay }}</li>
	</ul>
	<FormModal :title="`Edit ${group.name}`" @submit="(data) => editModuleGroup(group, data)">
		<template v-slot:form-elements>
			<label>
				Name
				<input type="text" required name="name" :data-default="group.name" />
			</label>
			<label>
				Color
				<input type="color" required name="color" :data-default="group.color" />
			</label>
			<button type="button" @click="deleteModuleGroup(group)">Delete</button>
		</template>

		<template v-slot:open-button>Edit group</template>
	</FormModal>
</template>
