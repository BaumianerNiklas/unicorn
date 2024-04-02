<script setup lang="ts">
import { type ModuleGroup, deleteModuleGroup } from "@/data/groups";
import DeleteButton from "./DeleteButton.vue";

const { group } = defineProps<{ group?: ModuleGroup }>();
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
		<label for="color-input">Color</label>
		<input
			type="color"
			required
			name="color"
			:data-default="group?.color"
			id="color-input"
			autocomplete="off"
		/>
	</div>
	<div class="flex justify-center items-center" v-if="group">
		<DeleteButton text="Delete this group" @click="deleteModuleGroup(group)" />
	</div>
</template>
