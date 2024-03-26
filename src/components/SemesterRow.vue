<script setup lang="ts">
import { modules as allModules } from "@/data/modules.js";
import { computed } from "vue";
import asOrdinalString from "@/util/asOrdinalString";
import ModuleDropzone from "./ModuleDropzone.vue";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));
</script>

<template>
	<div>
		<p class="font-500 mb-1">{{ asOrdinalString(semester) }} semester ({{ totalEcts }})</p>
		<ModuleDropzone :semester="semester" :modules="modules" />
	</div>
</template>

<style>
.dropIndicator {
	height: 100%;
	width: 0px;
	border-radius: 0.5rem;
}
</style>
