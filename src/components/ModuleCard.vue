<script setup lang="ts">
import type { Module } from "@/data/modules.js";

defineProps<{ module: Module }>();
</script>

<template>
	<div
		class="text-center p-2 rounded-2"
		:style="{ backgroundColor: module.group?.color ?? 'inherit' }"
	>
		<span>{{ module.name }}</span> <br />
		<div class="flex justify-around">
			<span>({{ module.ects }})</span>
			<span v-if="module.grade"> {{ module.grade.toFixed(1) }}</span>
		</div>
	</div>
</template>
