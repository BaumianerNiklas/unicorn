<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const { title, resetOnClose = false } = defineProps<{
	title: string;
	resetOnClose?: boolean;
}>();

const emit = defineEmits<{
	(e: "submit", data: Record<string, string>): void;
}>();

const dialogElem: Ref<HTMLDialogElement | null> = ref(null);
const formElem: Ref<HTMLFormElement | null> = ref(null);

let inputsWithDefaults: HTMLInputElement[] = [];
let selectsWithDefaults: HTMLSelectElement[] = [];

function handleSubmit(event: Event) {
	const formData = new FormData(event.target as HTMLFormElement);

	emit("submit", Object.fromEntries(formData) as Record<string, string>);

	dialogElem.value?.close();
}

function resetForm() {
	formElem.value?.reset();
	writeDefaultValues();
}

function writeDefaultValues() {
	for (const input of inputsWithDefaults) {
		input.value = input.dataset.default!;
	}

	for (const select of selectsWithDefaults) {
		select.value = select.dataset.default!;
	}
}

function closeOnOutsideClick({ x, y }: MouseEvent) {
	if (!dialogElem.value?.open) return;

	const boundingRect = dialogElem.value?.getBoundingClientRect();
	if (!boundingRect) return;

	if (
		x > boundingRect.right ||
		x < boundingRect.left ||
		y > boundingRect.bottom ||
		y < boundingRect.top
	) {
		dialogElem.value?.close();
	}
}

onMounted(() => {
	inputsWithDefaults = Array.from(formElem.value?.querySelectorAll("input[data-default]") ?? []);
	selectsWithDefaults = Array.from(
		formElem.value?.querySelectorAll("select[data-default]") ?? [],
	);

	writeDefaultValues();

	window.addEventListener("click", closeOnOutsideClick);

	// Make the first element of the form always autofocus
	// (instead of the close button, because <dialog>s always autofocus the first element in the hierarchy by default)
	dialogElem.value?.querySelector("input:first-of-type")?.setAttribute("autofocus", "");

	dialogElem.value?.addEventListener("close", () => {
		if (resetOnClose) resetForm();
	});
});

onUnmounted(() => window.removeEventListener("click", closeOnOutsideClick));
</script>

<template>
	<dialog ref="dialogElem" @submit.prevent="handleSubmit" class="form-modal m-auto w-72">
		<div
			class="flex justify-between items-center mb-4 p-2 border-b-3 border-b-solid border-gray-400"
		>
			<span>{{ title }}</span>
			<button
				formmethod="dialog"
				@click="dialogElem?.close()"
				class="cursor-pointer flex items-center border-none text-base"
			>
				<div class="i-lucide-x"></div>
				<span>Cancel</span>
			</button>
		</div>
		<form ref="formElem" method="dialog" class="flex flex-col gap-4">
			<slot name="form-elements" />

			<button type="submit" value="what">Submit</button>
		</form>
	</dialog>

	<button @click.stop="dialogElem?.showModal()" class="cursor-pointer" name="submit">
		<slot name="open-button" />
	</button>
</template>

<style>
/* 
This style tag has to be global in order for it to apply to all form elements (which are defined outside this component)
So make this selector as specific as possible (hence the .form-modal class)
*/
dialog.form-modal > form > label {
	display: flex;
	justify-content: space-between;
}
</style>
