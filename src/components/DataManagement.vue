<script setup lang="ts">
import { importFromJson, saveToLocalstorage, exportToJson } from "@/util/localStorage";
import ButtonWithIcon from "./ButtonWithIcon.vue";
import { ref } from "vue";
import { moduleGroups } from "@/data/groups";
import { modules } from "@/data/modules";

const importJsonInput = ref<HTMLInputElement>();

function reset() {
	moduleGroups.value = [];
	modules.value = [];
}

async function handleFileUpload(e: Event) {
	let files: FileList | undefined | null;
	if (e instanceof DragEvent) {
		// drag & drop upload
		files = e.dataTransfer?.files;
	} else {
		// "click" upload
		files = (e.target as HTMLInputElement).files;
	}

	if (files?.length !== 1) {
		return alert("Can only upload one JSON file.");
	}

	const file = files.item(0);

	if (!file || file.type !== "application/json") {
		return alert("Can only import JSON files.");
	}

	const json = await file.text();
	if (!json) return;
	importFromJson(json);
}
</script>

<template>
	<h2>Data Management</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
		<ButtonWithIcon @click="saveToLocalstorage" text="Save changes" icon="i-lucide-save" />
		<ButtonWithIcon
			@click="reset"
			text="Reset"
			icon="i-lucide-rotate-ccw"
			classList="bg-red-500 hover:bg-red-600"
		/>
		<ButtonWithIcon
			@click="exportToJson"
			text="Export to JSON"
			icon="i-lucide-upload"
			classList="h-fit"
		/>

		<label @dragover.prevent @drop.prevent.stop="handleFileUpload">
			<ButtonWithIcon
				@click="importJsonInput?.click()"
				text="Import from JSON"
				icon="i-lucide-import"
				classList="w-full"
			/>
			<input
				ref="importJsonInput"
				type="file"
				name="jsonImport"
				accept="application/json"
				@change="handleFileUpload"
				class="opacity-0 size-0"
			/>
		</label>
	</div>
</template>
