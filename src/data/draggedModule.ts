import { ref } from "vue";

/**
 * Stores the id, background color and width of the currently dragged module for use in drop indicators and dropzones.
 * If no module is being dragged, this value is undefined
 * (which is why this is a ref and not a reactive, because Vue reactives cannot be null/undefined).
 *
 * Sharing this value is done via a ref because HTML drag & drop events do not allow
 * access to the drag data in dragover events: https://stackoverflow.com/questions/33420306/drag-drop-datatransfer-object
 */
const draggedModule = ref<{
	color: string;
	width: number;
}>();

export default draggedModule;
