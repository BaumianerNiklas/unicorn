<script setup lang="ts">
import { type Module } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";

const { module } = defineProps<{ module: Module }>();
</script>

<template>
	<label>
		Name
		<input required type="text" name="name" :data-default="module.name" />
	</label>
	<label>
		ECTS
		<input required type="number" name="ects" :data-default="module.ects.toString()" />
	</label>
	<label>
		Semester
		<select name="semester" :data-default="module.semester">
			<option value="none">None</option>
			<option v-for="semester in semesterCount" :value="semester" :key="semester">
				{{ semester }}
			</option>
		</select>
	</label>
</template>
