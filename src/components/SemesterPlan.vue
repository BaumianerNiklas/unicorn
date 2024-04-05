<script setup lang="ts">
import { semesterCount, removeSemester, addSemester } from "@/data/semesterCount";
import SemesterRow from "./SemesterRow.vue";
import WithTooltip from "./WithTooltip.vue";

const buttonStyles =
	"p-1 rounded-full size-6 text-center border-none font-semibold text-white bg-blue-400";
</script>

<template>
	<div>
		<div class="flex gap-6 items-center mb-4">
			<h2>Your semesters</h2>
			<div class="flex justify-center items-center gap-1">
				<WithTooltip tooltip="Remove semester">
					<button @click="removeSemester" :class="buttonStyles">-</button>
				</WithTooltip>
				<span class="text-xl font-semibold">{{ semesterCount }} </span>
				<WithTooltip tooltip="Add semester">
					<button @click="addSemester" :class="buttonStyles">+</button>
				</WithTooltip>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<SemesterRow
				v-for="semester in semesterCount"
				:key="semester"
				:semester="semester"
			></SemesterRow>
		</div>
	</div>
</template>
