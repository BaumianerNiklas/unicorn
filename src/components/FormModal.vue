<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const { resetOnClose } = defineProps<{
	resetOnClose: boolean;
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
	<dialog ref="dialogElem" @submit.prevent="handleSubmit">
		<form ref="formElem" method="dialog">
			<slot name="form-elements" />

			<button type="submit" value="what">Submit</button>
		</form>
		<button formmethod="dialog" @click="dialogElem?.close()">X</button>
	</dialog>

	<button @click.stop="dialogElem?.showModal()" class="cursor-pointer" name="submit">
		<slot name="open-button" />
	</button>
</template>
