<script setup lang="ts">
import { semesterCount } from "@/data/semesterCount";
import SemesterRow from "./SemesterRow.vue";
</script>

<template>
	<div>
		your semester
		<div class="flex flex-col">
			<SemesterRow
				v-for="semester in semesterCount"
				:key="semester"
				:semester="semester"
			></SemesterRow>
		</div>
	</div>
</template>
