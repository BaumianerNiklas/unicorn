<script setup lang="ts">
import { moduleGroups } from "@/data/groups";
import { deleteModule, VALID_GRADES, type Module } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";

const { module } = defineProps<{ module?: Module }>();
</script>

<template>
	<label>
		Name
		<input required type="text" name="name" :data-default="module?.name" />
	</label>
	<label>
		ECTS
		<input required type="number" name="ects" :data-default="module?.ects.toString()" />
	</label>
	<label>
		Semester
		<select name="semester" :data-default="module?.semester">
			<option value="none">None</option>
			<option v-for="semester in semesterCount" :value="semester" :key="semester">
				{{ semester }}
			</option>
		</select>
	</label>
	<label>
		Group
		<select name="groupId" :data-default="module?.groupId?.toString() ?? 'none'">
			<option value="none">None</option>
			<option v-for="group in moduleGroups" :value="group.id" :key="group.id">
				{{ group.name }}
			</option>
		</select>
	</label>
	<label>
		Grade
		<select name="grade" :data-default="module?.grade?.toString() ?? 'none'">
			<option value="none">None</option>
			<option v-for="grade in VALID_GRADES" :value="grade" :key="grade">
				{{ grade.toFixed(1) }}
			</option>
		</select>
	</label>
	<button type="button" v-if="module" @click="deleteModule(module)">Delete</button>
</template>
