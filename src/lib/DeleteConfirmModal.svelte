<<<<<<< HEAD
<script>
    import { fade, fly } from 'svelte/transition';

    export let isOpen = false;
    export let onClose;      
    export let onConfirm; 
    export let loading = false;
</script>
{#if isOpen}
    <div class="modal-backdrop" transition:fade={{ duration: 150 }} on:click={onClose}>
        
        <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 300 }} on:click|stopPropagation>
            <div class="warning-icon">⚠️</div>
            <h2>Delete Account?</h2>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 1.5rem; line-height: 1.4;">
                This will permanently erase your library, your catalogs, and your profile. <br/>
                <strong style="color: var(--text-primary);">This cannot be undone.</strong>
            </p>
            
            <div class="confirm-actions">
                <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>
                    Cancel
                </button>
                <button type="button" class="btn-delete" on:click={onConfirm} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
            
        </div>
    </div>
{/if}

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
        color: #910b0b; 20, 0.95);
    }
    

    .warning-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .confirm-actions {
        display: flex;
        gap: 1rem;
    }

    .confirm-actions button {
        flex: 1; 
    }
=======
<script>
    import { fade, fly } from 'svelte/transition';

    export let isOpen = false;
    export let onClose;      
    export let onConfirm; 
    export let loading = false;
</script>
{#if isOpen}
    <div class="modal-backdrop" transition:fade={{ duration: 150 }} on:click={onClose}>
        
        <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 300 }} on:click|stopPropagation>
            <div class="warning-icon">⚠️</div>
            <h2>Delete Account?</h2>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 1.5rem; line-height: 1.4;">
                This will permanently erase your library, your catalogs, and your profile. <br/>
                <strong style="color: var(--text-primary);">This cannot be undone.</strong>
            </p>
            
            <div class="confirm-actions">
                <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>
                    Cancel
                </button>
                <button type="button" class="btn-delete" on:click={onConfirm} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
            
        </div>
    </div>
{/if}

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
        color: #910b0b; 20, 0.95);
    }
    

    .warning-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .confirm-actions {
        display: flex;
        gap: 1rem;
    }

    .confirm-actions button {
        flex: 1; 
    }
>>>>>>> 3a1a39d (Initial commit- MVP ready for launch)
</style>