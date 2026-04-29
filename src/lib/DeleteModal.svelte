<script>
    import { fade, fly } from 'svelte/transition';

    export let book;
    export let onConfirm;
    export let onClose;
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <div class="warning-icon">⚠️</div>
        <h2 style="color: #910b0b;">Delete Book?</h2>
        
        <p style="color: var(--text-primary); margin-bottom: 2rem; line-height: 1.5; text-align: center;">
            Are you sure you want to permanently delete <strong style="color: var(--text-primary);">"{book?.title}"</strong> from your library? This action cannot be undone.
        </p>

        <div class="modal-actions">
            <button class="btn-secondary" on:click={onClose}>Cancel</button>
            <button class="btn-delete" on:click={() => { onConfirm(); onClose(); }}>
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
        z-index: 1000; 
        padding: 1rem;
    }
    
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

    .warning-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    h2 {
        font-family: 'Playfair Display', serif;
        margin-bottom: 1rem;
    }

    .modal-actions {
        display: flex; 
        gap: 1rem; 
        width: 100%;
        justify-content: center;
    }
</style>