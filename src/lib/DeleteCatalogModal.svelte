<<<<<<< HEAD
<script>
    import { fade, fly } from 'svelte/transition';
    export let catalog;
    export let onConfirm;
    export let onClose;
    let loading = false;

    async function handleConfirm() {
        loading = true;
        await onConfirm();
        loading = false;
        onClose();
    }
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <h2>Delete Catalog?</h2>
        <p style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5;">
            Are you absolutely sure you want to delete <strong>"{catalog.name}"</strong>?<br><br>
            <span style="color: #910b0b;">This will permanently erase ALL books inside this catalog. This action cannot be undone.</span>
        </p>

        <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Cancel</button>
            <button type="button" class="btn-delete" on:click={handleConfirm} disabled={loading}>
                Delete
            </button>
        </div>
    </div>
</div>
<style>
    .modal-backdrop { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh;
        background: rgba(0, 0, 0, 0.6); 
        backdrop-filter: blur(8px);
        display: flex; 
        justify-content: center; 
        align-items: center; 
        z-index: 2000;
        padding: 1rem; }
    .modal-content { 
        width: 100%; 
        max-width: 400px; 
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(122, 122, 141, 0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px -12px rgba(255, 255, 255, 0.5); 
        }
        :global(.light-mode) .modal-content {
        background: rgba(255, 255, 255, 0.46);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 20px -12px rgba(112, 79, 8, 0.5);
    }
    h2 { 
        font-family: 'Playfair Display', serif; 
        margin-bottom: 0.5rem; 
        color: #910b0b; }
=======
<script>
    import { fade, fly } from 'svelte/transition';
    export let catalog;
    export let onConfirm;
    export let onClose;
    let loading = false;

    async function handleConfirm() {
        loading = true;
        await onConfirm();
        loading = false;
        onClose();
    }
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <h2>Delete Catalog?</h2>
        <p style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5;">
            Are you absolutely sure you want to delete <strong>"{catalog.name}"</strong>?<br><br>
            <span style="color: #910b0b;">This will permanently erase ALL books inside this catalog. This action cannot be undone.</span>
        </p>

        <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Cancel</button>
            <button type="button" class="btn-delete" on:click={handleConfirm} disabled={loading}>
                Delete
            </button>
        </div>
    </div>
</div>
<style>
    .modal-backdrop { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh;
        background: rgba(0, 0, 0, 0.6); 
        backdrop-filter: blur(8px);
        display: flex; 
        justify-content: center; 
        align-items: center; 
        z-index: 2000;
        padding: 1rem; }
    .modal-content { 
        width: 100%; 
        max-width: 400px; 
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(122, 122, 141, 0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px -12px rgba(255, 255, 255, 0.5); 
        }
        :global(.light-mode) .modal-content {
        background: rgba(255, 255, 255, 0.46);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 20px -12px rgba(112, 79, 8, 0.5);
    }
    h2 { 
        font-family: 'Playfair Display', serif; 
        margin-bottom: 0.5rem; 
        color: #910b0b; }
>>>>>>> 3a1a39d (Initial commit- MVP ready for launch)
</style>