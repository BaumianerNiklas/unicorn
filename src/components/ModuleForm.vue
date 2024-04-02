<script setup lang="ts">
import { moduleGroups } from "@/data/groups";
import { deleteModule, VALID_GRADES, type Module } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";

const { module } = defineProps<{ module?: Module }>();
</script>

<template>
	<div>
		<label for="name-input">Name</label>
		<input required type="text" name="name" :data-default="module?.name" autocomplete="off" />
	</div>
	<div class="flex gap-4 w-full justify-between">
		<div class="flex-1 w-0">
			<label for="ects-input">ECTS</label>
			<input
				required
				type="number"
				name="ects"
				:data-default="module?.ects.toString()"
				id="ects-input"
				autocomplete="off"
			/>
		</div>
		<div class="flex-1 w-0">
			<label for="semester-select">Semester</label>
			<select name="semester" :data-default="module?.semester" id="semester-select">
				<option value="none">None</option>
				<option v-for="semester in semesterCount" :value="semester" :key="semester">
					{{ semester }}
				</option>
			</select>
		</div>
		<div class="flex-1 w-0">
			<label for="grade-select"> Grade </label>
			<select
				name="grade"
				:data-default="module?.grade?.toString() ?? 'none'"
				id="grade-select"
				autocomplete="off"
			>
				<option value="none">None</option>
				<option v-for="grade in VALID_GRADES" :value="grade" :key="grade">
					{{ grade.toFixed(1) }}
				</option>
			</select>
		</div>
	</div>
	<div>
		<label for="groupId-select">Group</label>
		<select
			name="groupId"
			:data-default="module?.groupId?.toString() ?? 'none'"
			id="groupId-select"
			autocomplete="off"
		>
			<option value="none">None</option>
			<option v-for="group in moduleGroups" :value="group.id" :key="group.id">
				{{ group.name }}
			</option>
		</select>
	</div>
	<button
		type="button"
		v-if="module"
		@click="deleteModule(module)"
		class="border-none text-red-500 bg-red-100 text-base rounded-2 w-fit p-2"
	>
		Delete
	</button>
</template>
