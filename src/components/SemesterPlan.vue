<script setup lang="ts">
import { semesterCount } from "@/data/semesterCount";
import SemesterRow from "./SemesterRow.vue";
</script>

<template>
	<div>
		<h2>Your semesters</h2>
		<div class="flex flex-col">
			<SemesterRow
				v-for="semester in semesterCount"
				:key="semester"
				:semester="semester"
			></SemesterRow>
		</div>
	</div>
</template>
