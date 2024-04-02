<script setup lang="ts">
import { type ModuleGroup, deleteModuleGroup } from "@/data/groups";

const { group } = defineProps<{ group?: ModuleGroup }>();
</script>

<template>
	<div>
		<label for="name-input">Name</label>
		<input type="text" required name="name" :data-default="group?.name" id="name-input" />
	</div>
	<div>
		<label for="color-input">Color</label>
		<input type="color" required name="color" :data-default="group?.color" id="color-input" />
	</div>
	<button v-if="group" type="button" @click="deleteModuleGroup(group)">Delete</button>
</template>
