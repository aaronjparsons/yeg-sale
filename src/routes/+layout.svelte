<script lang="ts">
import '../app.postcss';
import { Modal, Toast, initializeStores } from '@skeletonlabs/skeleton';
import type { ModalComponent } from '@skeletonlabs/skeleton';
import CreateSaleModal from '$lib/CreateSaleModal.svelte';
import OptionsModal from '$lib/OptionsModal.svelte';
import LegendModal from '$lib/LegendModal.svelte';
import DeleteConfirmModal from '$lib/DeleteConfirmModal.svelte';

initializeStores();

const modalRegistry: Record<string, ModalComponent> = {
	// Set a unique modal ID, then pass the component reference
	createSaleModal: { ref: CreateSaleModal },
	optionsModal: { ref: OptionsModal },
	legendModal: { ref: LegendModal },
	deleteConfirmModal: { ref: DeleteConfirmModal },
};

</script>

<slot />
<Modal components={modalRegistry} />
<Toast />