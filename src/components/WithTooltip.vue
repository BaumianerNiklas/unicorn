<script setup lang="ts">
import draggedModule from "@/data/draggedModule";
import { ref } from "vue";

const { tooltip } = defineProps<{ tooltip: string }>();

let show = ref(false);
</script>

<template>
	<div @mouseenter="show = true" @mouseleave="show = false" class="relative w-fit z-50">
		<span
			v-if="show && !draggedModule"
			class="absolute bottom-4 left-[50%] translate-x-[-50%] text-xs bg-gray-700 text-white p-1 rounded-2"
		>
			{{ tooltip }}
		</span>
		<slot />
	</div>
</template>
