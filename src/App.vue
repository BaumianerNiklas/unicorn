<script setup lang="ts">
import TheMenu from "@/components/TheMenu.vue";
import SemesterPlan from "@/components/SemesterPlan.vue";
import { onBeforeMount } from "vue";
import { loadFromLocalstorage } from "./util/localStorage";

onBeforeMount(() => loadFromLocalstorage());
</script>

<template>
	<h1>🦄 Unicorn</h1>
	<main class="flex flex-col lg:flex-row w-full justify-around px-12 lg:px-0">
		<SemesterPlan />
		<TheMenu />
	</main>
</template>
