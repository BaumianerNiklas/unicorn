<script setup lang="ts">
import type { ModuleGroup } from "@/data/groups";
import { modules as allModules, averageGrade } from "@/data/modules";
import { computed } from "vue";

const { group } = defineProps<{ group: ModuleGroup }>();

const modules = computed(() => allModules.value.filter((m) => m.group?.id === group.id));

const avgGrade = computed(() => averageGrade(modules.value));
const avgGradeDisplay = computed(() => (isNaN(avgGrade.value) ? "/" : avgGrade.value.toFixed(2)));
</script>

<template>
	<div>
		<span>{{ group.name }}</span>
		<ul>
			<li>Modules: {{ modules.length }}</li>
			<li>Total ECTS: {{ modules.reduce((acc, curr) => acc + curr.ects, 0) }}</li>
			<li>Average Grade: {{ avgGradeDisplay }}</li>
		</ul>
	</div>
</template>
