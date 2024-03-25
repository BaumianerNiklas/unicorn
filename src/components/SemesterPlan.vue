<script setup lang="ts">
import { semesterCount } from "@/data/semesterCount";
import SemesterRow from "./SemesterRow.vue";
</script>

<template>
	<div>
		<h2 class="mb-1">Your semesters</h2>
		<div class="flex flex-col gap-1">
			<SemesterRow
				v-for="semester in semesterCount"
				:key="semester"
				:semester="semester"
			></SemesterRow>
		</div>
	</div>
</template>
