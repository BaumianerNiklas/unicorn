<script setup lang="ts">
import { modules as allModules, addModule } from "@/data/modules.js";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import GroupForm from "./GroupForm.vue";
import { computed } from "vue";
import { moduleGroups, addModuleGroup } from "@/data/groups";
import ModuleGroupCard from "./ModuleGroupCard.vue";
import ButtonWithIcon from "./ButtonWithIcon.vue";
import ModuleDropzone from "./ModuleDropzone.vue";
import DataManagement from "./DataManagement.vue";

const modules = computed(() => allModules.value.filter((m) => !m.semester));
</script>

<template>
	<menu>
		<h2>Your modules</h2>
		<FormModal title="Create new module" @submit="addModule" reset-on-close>
			<template v-slot:open-button>
				<ButtonWithIcon icon="i-lucide-plus-circle" text="Add module" />
			</template>

			<template v-slot:form-elements>
				<ModuleForm />
			</template>
		</FormModal>

		<ModuleDropzone :modules="modules">
			<template v-slot:empty-fallback>
				<div
					class="flex justify-center items-center border-dotted border-gray-400 rounded-2 text-gray-400 text-xs w-32"
				>
					<span class="text-center">No unassigned modules</span>
				</div>
			</template>
		</ModuleDropzone>

		<h2>Your module groups</h2>
		<FormModal title="Create new module group" reset-on-close @submit="addModuleGroup">
			<template v-slot:open-button>
				<ButtonWithIcon icon="i-lucide-circle-plus" text="Add group" />
			</template>

			<template v-slot:form-elements>
				<GroupForm />
			</template>
		</FormModal>
		<ul>
			<li v-for="group in moduleGroups" :key="group.id" class="my-2">
				<ModuleGroupCard :group="group"></ModuleGroupCard>
			</li>
		</ul>

		<DataManagement />
	</menu>
</template>
