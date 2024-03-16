<script setup lang="ts">
import draggedModule from "@/data/draggedModule";
import { moduleGroups } from "@/data/groups";
import { type Module } from "@/data/modules.js";
import { getMostLegibleFontColor, hexToRgb } from "@/util/colors";
import { computed, ref } from "vue";

const { module } = defineProps<{ module: Module }>();

const group = computed(() => moduleGroups.value.find((g) => g.id === module.groupId));

const divEl = ref<HTMLDivElement>();

// change font color of the card to either black or white depending on which has better contrast
const fontColor = computed(() => {
	return getMostLegibleFontColor(...hexToRgb(group.value?.color ?? "#ffffff"));
});

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
		:style="{ backgroundColor: group?.color ?? 'inherit', color: fontColor }"
		ref="divEl"
	>
		<span>{{ module.name }}</span>
		<br />
		<div class="flex justify-around gap-2">
			<span>({{ module.ects }})</span>
			<span v-if="module.grade"> {{ module.grade.toFixed(1) }}</span>
		</div>
	</div>
</template>
