<script setup lang="ts">
import { modules as allModules, addModule, editModule } from "@/data/modules.js";
import { semesterCount } from "@/data/semesterCount.js";
import ModuleCard from "./ModuleCard.vue";
import FormModal from "./FormModal.vue";
import ModuleForm from "./ModuleForm.vue";
import { computed } from "vue";
import { moduleGroups, addModuleGroup, editModuleGroup, deleteModuleGroup } from "@/data/groups";
import { saveToLocalstorage } from "@/util/localStorage";

const modules = computed(() => allModules.value.filter((m) => !m.semester));

function reset() {
	moduleGroups.value = [];
	allModules.value = [];
}
</script>

<template>
	<menu>
		<button @click="saveToLocalstorage">Save changes</button>
		<button @click="reset">Reset</button>

		<label>
			Semester Count
			<input required type="number" v-model="semesterCount" name="semesterCount" />
		</label>

		<h2>Your modules</h2>
		<FormModal @submit="addModule" reset-on-close>
			<template v-slot:open-button>Add module</template>

			<template v-slot:form-elements>
				<ModuleForm />
			</template>
		</FormModal>
		<ul>
			<li v-for="module in modules" :key="module.id">
				<FormModal reset-on-close @submit="(data) => editModule(module, data)">
					<template v-slot:form-elements>
						<ModuleForm :module="module" />
					</template>

					<template v-slot:open-button>
						<ModuleCard :module="module" />
					</template>
				</FormModal>
			</li>
		</ul>

		<h2>Your module groups</h2>
		<FormModal reset-on-close @submit="addModuleGroup">
			<template v-slot:open-button>Create new group</template>

			<template v-slot:form-elements>
				<label>Name <input type="text" name="name" /></label>
				<label>Color <input type="color" name="color" /></label>
			</template>
		</FormModal>
		<ul>
			<li
				v-for="group in moduleGroups"
				:key="group.id"
				:style="{ backgroundColor: group.color ?? 'initial' }"
			>
				<FormModal reset-on-close @submit="(data) => editModuleGroup(group, data)">
					<template v-slot:form-elements>
						<label>
							Name
							<input type="text" required name="name" :data-default="group.name" />
						</label>
						<label>
							Color
							<input type="color" required name="color" :data-default="group.color" />
						</label>
						<button type="button" @click="deleteModuleGroup(group)">Delete</button>
					</template>

					<template v-slot:open-button>
						{{ group.name }}
						({{ allModules.filter((m) => m.group?.id === group.id).length }})
					</template>
				</FormModal>
			</li>
		</ul>
	</menu>
</template>
