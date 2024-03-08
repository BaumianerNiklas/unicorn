<script setup lang="ts">
import { modules as allModules, editModule, sortModules } from "@/data/modules.js";
import ModuleCard from "./ModuleCard.vue";
import { computed, ref } from "vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import semesterDropzoneHandler from "@/util/semesterDropzoneHandler";
import draggedModuleWidth from "@/data/draggedModuleWidth";

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

	if (modules.value.length >= 2) sortModules(modules.value);
	clearDropIndicators();
	draggedModuleWidth.value = 0;
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

	// make previous target no longer active
	const prevClosestDropIndicatorEl = dropzone.value.querySelector(
		`.dropIndicator[data-index="${prevClosestIndex}"]`,
	);
	prevClosestDropIndicatorEl?.classList.remove("activeDropIndicator");

	if (prevClosestDropIndicatorEl instanceof HTMLElement) {
		prevClosestDropIndicatorEl.style.width = "0px";
	}

	// make new target active
	const currClosestDropIndicatorEL = dropzone.value.querySelector(
		`.dropIndicator[data-index="${currClosestIndex}"]`,
	);
	currClosestDropIndicatorEL?.classList.add("activeDropIndicator");

	if (currClosestDropIndicatorEL instanceof HTMLElement) {
		currClosestDropIndicatorEL.style.width = `${draggedModuleWidth.value}px`;
	}

	// update the closest index for use in sorting when dropping
	closestDropIndicatorIndex.value = currClosestIndex;
}

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

function clearDropIndicators() {
	if (!dropzone.value) return;

	dropzone.value.querySelectorAll(".activeDropIndicator").forEach((el) => {
		if (!(el instanceof HTMLElement)) return;

		el.classList.remove("activeDropIndicator");
		el.style.width = "0px";
	});

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
				<FormModal reset-on-close @submit="(data) => editModule(module, data)">
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
	background-color: red;
}
</style>
