<script setup lang="ts">
import draggedModule from "@/data/draggedModule";
import { ref } from "vue";

const { tooltip, delay = 300 } = defineProps<{
	/** The tooltip text to display */
	tooltip: string;
	/** The delay in milliseconds the tooltip should take to appear. Defaults to 300. Use 0 to disable. */
	delay?: number;
}>();

const show = ref(false);

let timeoutId: number;

function handleMouseEnter() {
	// Don't create a timeout for a non-delay as it would actually just add a delay
	if (delay > 0) timeoutId = setTimeout(() => (show.value = true), delay);
	else show.value = true;
}

function handleMouseLeave() {
	show.value = false;
	if (delay > 0) clearTimeout(timeoutId);
}
</script>

<template>
	<div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="relative w-fit z-50">
		<span
			v-if="show && !draggedModule"
			class="absolute bottom-4 left-[50%] translate-x-[-50%] text-xs bg-gray-700 text-white p-1 rounded-2"
		>
			{{ tooltip }}
		</span>
		<slot />
	</div>
</template>
