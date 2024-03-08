import { ref } from "vue";

/**
* Stores the width of the currently dragged module for use in the drag & drop indicators.
* If no module is being dragged, this value is 0.
*
* Sharing this value is done via a ref because HTML drag & drop events do not allow
* access to the drag data in dragover events: https://stackoverflow.com/questions/33420306/drag-drop-datatransfer-object
*/
const draggedModuleWidth = ref(0);

export default draggedModuleWidth;
