<script setup lang="ts">
import FormModal from "./FormModal.vue";
import GroupForm from "./GroupForm.vue";
import WithTooltip from "./WithTooltip.vue";
import { type ModuleGroup, editModuleGroup } from "@/data/groups";
import { modules as allModules, averageGrade } from "@/data/modules";
import { computed } from "vue";

const { group } = defineProps<{ group: ModuleGroup }>();

const modules = computed(() => allModules.value.filter((m) => m.groupId === group.id));

const totalEcts = computed(() => modules.value.reduce((acc, curr) => acc + curr.ects, 0));

const avgGrade = computed(() => averageGrade(modules.value));

const iconicTextContainerClasslist = "flex items-center gap-1";
</script>

<template>
	<FormModal
		:title="`Edit ${group.name}`"
		reset-on-close
		@submit="(data) => editModuleGroup(group, data)"
	>
		<template v-slot:form-elements>
			<GroupForm :group="group" />
		</template>

		<template v-slot:open-button>
			<div
				class="border-l-solid border-6 px-4 py-3 bg-gray-100 rounded-2 max-w-100"
				:style="{ borderColor: group.color }"
			>
				<h4 class="text-center mb-2">{{ group.name }}</h4>
				<ul class="flex justify-around">
					<WithTooltip tooltip="Number of modules">
						<li :class="iconicTextContainerClasslist">
							<div class="i-lucide-shapes"></div>
							<span>{{ modules.length }}</span>
						</li>
					</WithTooltip>
					<WithTooltip tooltip="Total ECTS">
						<li :class="iconicTextContainerClasslist">
							<div class="i-lucide-hexagon text"></div>
							<span>{{ totalEcts }}</span>
						</li>
					</WithTooltip>
					<WithTooltip tooltip="Average Grade" v-if="!isNaN(avgGrade)">
						<li :class="iconicTextContainerClasslist">
							<div class="i-lucide-sparkles"></div>
							<span>{{ avgGrade.toFixed(2) }}</span>
						</li>
					</WithTooltip>
				</ul>
			</div>
		</template>
	</FormModal>
</template>
