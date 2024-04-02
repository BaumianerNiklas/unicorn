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

	dialogElem.value?.addEventListener("close", () => {
		if (resetOnClose) resetForm();
	});
});

onUnmounted(() => window.removeEventListener("click", closeOnOutsideClick));
</script>

<template>
	<dialog ref="dialogElem" @submit.prevent="handleSubmit" class="form-modal m-auto w-96 p-4">
		<h3 class="flex justify-between items-center mb-4 min-w-full">{{ title }}</h3>
		<form ref="formElem" method="dialog" class="flex flex-col gap-4">
			<slot name="form-elements" />

			<div class="flex justify-around">
				<button
					formmethod="dialog"
					@click="dialogElem?.close()"
					class="border-none text-base text-red-500 bg-red-100 hover:bg-red-200 px-2 rounded-1"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="text-green-500 border-none text-base bg-green-100 hover:bg-green-200 px-2 rounded-1"
				>
					Confirm
				</button>
			</div>
		</form>
	</dialog>

	<div @click.stop="dialogElem?.showModal()" class="cursor-pointer border-none">
		<slot name="open-button" />
	</div>
</template>

<style>
/*
This style tag has to be global in order for it to apply to all form elements (which are defined outside this component)
So make selectors as specific as possible (hence the .form-modal class)
*/

dialog.form-modal > form div:has(> label) {
	display: flex;
	flex-direction: column;
}

dialog.form-modal > form input,
dialog.form-modal > form select {
	font-size: 1rem;
	height: 2rem;
	border: 1.5px solid black;
	padding: 3px 6px;
	border-radius: 4px;
}

dialog.form-modal > form label:has(+ input:required, + select:required)::after {
	content: "*";
	color: red;
}
</style>
