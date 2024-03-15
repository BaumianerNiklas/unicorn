<script setup lang="ts">
import { modules as allModules, editModule, sortModules } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed, ref } from "vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import semesterDropzoneHandler from "@/util/semesterDropzoneHandler";
import draggedModule from "@/data/draggedModule";

const { semester } = defineProps<{ semester: number }>();

const modules = computed(() => allModules.value.filter((m) => m.semester === semester));
const totalEcts = computed(() => modules.value.reduce((acc, curr) => curr.ects + acc, 0));

const closestDropIndicatorIndex = ref<number | undefined>(undefined);
const dropzone = ref<HTMLDivElement>();

// Event handlers

function handleDrop(event: DragEvent) {
	// if the clostest drop indicator is -1 that is the one at the very right
	// so we set sortIndex to undefined because inserting with an undefined sortIndex inserts at the end
	let sortIndex: number | undefined;
	if (closestDropIndicatorIndex.value === undefined || closestDropIndicatorIndex.value === -1)
		sortIndex = undefined;
	else sortIndex = closestDropIndicatorIndex.value;

	semesterDropzoneHandler(event, semester, sortIndex);

	// cleanup; resetting the draggedModule ref is done within semesterDropzoneHandler
	if (modules.value.length >= 2) sortModules(modules.value);
	clearDropIndicators();
}

function handleDragOver(event: DragEvent) {
	if (!dropzone.value) return;

	const closestDropIndicator = getClosestDropIndicator(event.clientX);
	if (!(closestDropIndicator instanceof HTMLElement) || !closestDropIndicator.dataset.index)
		return;

	const currClosestIndex = parseInt(closestDropIndicator.dataset.index);
	const prevClosestIndex = closestDropIndicatorIndex.value;

	// if still targeting same spot, don't do anything
	if (prevClosestIndex === currClosestIndex) return;

	// Reset all previous active drop indicators
	// Use querySelectorAll instead of the single one as with quick mouse movement, multiple indicators
	// could be active at the same time, leading to visual bugs
	document.querySelectorAll(".activeDropIndicator").forEach(resetDropIndicator);

	// make new target active
	const currClosestDropIndicatorEL = dropzone.value.querySelector(
		`.dropIndicator[data-index="${currClosestIndex}"]`,
	);
	currClosestDropIndicatorEL?.classList.add("activeDropIndicator");

	if (currClosestDropIndicatorEL instanceof HTMLElement) {
		currClosestDropIndicatorEL.style.width = `${draggedModule.value?.width ?? 0}px`;
		currClosestDropIndicatorEL.style.backgroundColor = draggedModule.value?.color ?? "initial";
	}

	// update the closest index for use in sorting when dropping
	closestDropIndicatorIndex.value = currClosestIndex;
}

// Clear the indicators when leaving the dropzone (the row) with the mouse
document.addEventListener("dragover", (event: MouseEvent) => {
	if (!dropzone.value) return;

	const { left, right, top, bottom } = dropzone.value.getBoundingClientRect();

	if (
		event.screenX < left ||
		event.screenX > right ||
		event.screenY < top ||
		event.screenY > bottom
	) {
		clearDropIndicators();
	}
});

// Utility functions

function resetDropIndicator(indicator: Element) {
	indicator.classList.remove("activeDropIndicator");

	// The style property only exists on HTMLElements so add this check for type safety
	if (!(indicator instanceof HTMLElement)) return;

	indicator.style.width = "0px";
	indicator.style.backgroundColor = "transparent";
}

function clearDropIndicators() {
	if (!dropzone.value) return;

	dropzone.value.querySelectorAll(".activeDropIndicator").forEach(resetDropIndicator);

	closestDropIndicatorIndex.value = undefined;
}

function getClosestDropIndicator(toX: number) {
	if (!dropzone.value) return;

	const dropIndicators = dropzone.value.querySelectorAll(".dropIndicator");

	return [...dropIndicators].reduce(
		(closest, curr) => {
			const currBoundingRect = curr.getBoundingClientRect();
			const currX = currBoundingRect.x + currBoundingRect.width / 2;

			const distToMouse = Math.abs(currX - toX);
			if (distToMouse < closest.x) return { closest: curr, x: distToMouse };
			else return closest;
		},
		{ closest: null as Element | null, x: Number.POSITIVE_INFINITY },
	).closest;
}
</script>

<template>
	<div>
		<span>{{ semester }}. semester ({{ totalEcts }})</span>
		<div class="flex" @dragover.prevent.stop="handleDragOver" @drop="handleDrop" ref="dropzone">
			<div v-for="module in sortModules(modules)" :key="module.id" class="flex">
				<div class="dropIndicator h-full" :data-index="module.sortIndex"></div>
				<FormModal
					:title="`Edit ${module.name}`"
					reset-on-close
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
			<!-- Index -1 as a literal edge case for the last element -->
			<div
				@dragover.prevent
				@drop="(ev) => handleDrop(ev)"
				:data-index="-1"
				class="dropIndicator min-h-12"
			></div>
		</div>
	</div>
</template>

<style scoped>
.activeDropIndicator {
	border: 2px solid black;
}
</style>
