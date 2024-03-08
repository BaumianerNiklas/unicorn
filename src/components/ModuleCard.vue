<script setup lang="ts">
import draggedModuleWidth from "@/data/draggedModuleWidth";
import { moduleGroups } from "@/data/groups";
import { type Module } from "@/data/modules.js";
import { computed, ref } from "vue";

const { module } = defineProps<{ module: Module }>();

const group = computed(() => moduleGroups.value.find((g) => g.id === module.groupId));

const divEl = ref<HTMLDivElement>();

function handleDragStart(e: DragEvent) {
	if (!e.dataTransfer) return;

	e.dataTransfer.dropEffect = "move";
	e.dataTransfer.setData("text/plain", module.id.toString());

	draggedModuleWidth.value = divEl.value?.clientWidth ?? 0;
}
</script>

<template>
	<div
		draggable="true"
		@dragstart="handleDragStart"
		class="text-center p-2 rounded-2"
		:style="{ backgroundColor: group?.color ?? 'inherit' }"
		ref="divEl"
	>
		<span>{{ module.name }}</span> <br />
		<div class="flex justify-around">
			<span>({{ module.ects }})</span>
			<span v-if="module.grade"> {{ module.grade.toFixed(1) }}</span>
		</div>
	</div>
</template>
