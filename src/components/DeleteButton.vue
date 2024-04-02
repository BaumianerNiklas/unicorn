<script setup lang="ts">
const { text } = defineProps<{ text: string }>();
</script>

<template>
	<button
		type="button"
		class="border-none flex justify-center items-center gap-1 text-base bg-red-600 text-white w-fit p-2 rounded-2"
	>
		<div class="i-lucide-trash-2"></div>
		<span>{{ text }}</span>
	</button>
</template>
