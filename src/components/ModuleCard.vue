<script setup lang="ts">
import draggedModule from "@/data/draggedModule";
import { moduleGroups } from "@/data/groups";
import { type Module } from "@/data/modules.js";
import { calculatePerceivedBrightness, getMostLegibleFontColor, hexToRgb } from "@/util/colors";
import { computed, ref } from "vue";
import WithTooltip from "./WithTooltip.vue";

const { module } = defineProps<{ module: Module }>();

const group = computed(() => moduleGroups.value.find((g) => g.id === module.groupId));

const divEl = ref<HTMLDivElement>();

const groupColorAsRgb = computed(() => hexToRgb(group.value?.color ?? "#ffffff"));

// change font color of the card to either black or white depending on which has better contrast
const fontColor = computed(() => getMostLegibleFontColor(...groupColorAsRgb.value));

// Add a border to very bright modules so you can distinguish them from the background
const hasBorder = computed(() => calculatePerceivedBrightness(...groupColorAsRgb.value) > 0.9);

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
		class="text-center py-2 px-6 rounded-2 min-h-12 h-fit flex flex-col border-1"
		:class="{ 'opacity-40': module.id === draggedModule?.id, 'border-solid': hasBorder }"
		:style="{
			backgroundColor: group?.color ?? 'inherit',
			color: fontColor,
		}"
		ref="divEl"
	>
		<span class="font-500 max-w-72 overflow-hidden text-nowrap text-ellipsis">{{
			module.name
		}}</span>
		<div class="flex justify-around gap-3">
			<WithTooltip tooltip="Credits">
				<div class="flex items-center gap-1">
					<div class="i-lucide-hexagon"></div>
					<span>{{ module.ects }}</span>
				</div>
			</WithTooltip>
			<WithTooltip v-if="module.grade" tooltip="Grade">
				<div class="flex items-center gap-1">
					<div class="i-lucide-sparkles"></div>
					<span> {{ module.grade.toFixed(1) }}</span>
				</div>
			</WithTooltip>
		</div>
	</div>
</template>
