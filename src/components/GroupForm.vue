<script setup lang="ts">
import { type ModuleGroup, deleteModuleGroup } from "@/data/groups";
import DeleteButton from "./DeleteButton.vue";
import { ref, onMounted, onUnmounted } from "vue";

const { group } = defineProps<{ group?: ModuleGroup }>();

// Using JS and a separate label wrapped around the color input here because
// trying to style a color input using CSS is absolute hell
const selectedColor = ref<string | undefined>(group?.color ?? "#000000");

const resetSelectedColor = () => (selectedColor.value = group?.color);

onMounted(() => {
	document.addEventListener("unicorn:formModalClosed", resetSelectedColor);
});

onUnmounted(() => {
	document.removeEventListener("unicorn:formModalClosed", resetSelectedColor);
});
</script>

<template>
	<div>
		<label for="name-input">Name</label>
		<input
			type="text"
			required
			name="name"
			:data-default="group?.name"
			id="name-input"
			autocomplete="off"
		/>
	</div>
	<div>
		<label for="color-input" class="w-fit">Color</label>
		<!-- Clicking labels wrapped around inputs opens the input, so use the label for the visual and hide the actual input -->
		<label
			class="size-10 rounded-full border-solid border-black border-2"
			:style="{ backgroundColor: selectedColor }"
		>
			<input
				type="color"
				required
				name="color"
				:data-default="group?.color"
				id="color-input"
				autocomplete="off"
				class="opacity-0 size-0"
				v-model="selectedColor"
			/>
		</label>
	</div>
	<div class="flex justify-center items-center" v-if="group">
		<DeleteButton text="Delete this group" @click="deleteModuleGroup(group)" />
	</div>
</template>
