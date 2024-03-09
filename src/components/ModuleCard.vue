<script setup lang="ts">
import draggedModule from "@/data/draggedModule";
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

	draggedModule.value = {
		id: module.id,
		color: group.value?.color ?? "inherit",
		width: divEl.value?.scrollWidth ?? 0,
	};
}
</script>

<template>
	<div
		draggable="true"
		@dragstart="handleDragStart"
		@dragend="() => (draggedModule = undefined)"
		class="text-center p-2 rounded-2 h-12"
		:class="{ 'opacity-40': module.id === draggedModule?.id }"
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
