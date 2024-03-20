<script setup lang="ts">
const { text, icon } = defineProps<{
	text: string;
	icon: string;
}>();
</script>

<template>
	<button
		class="flex items-center border-none text-base gap-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 rounded-2 text-white cursor-pointer"
	>
		<div class="text-lg" :class="icon"></div>
		<span>{{ text }}</span>
	</button>
</template>
