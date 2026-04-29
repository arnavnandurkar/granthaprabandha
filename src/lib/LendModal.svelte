<script>
    import { fade, fly } from 'svelte/transition';
    import { supabase } from './supabase.js';

    export let book;
    export let onSave;
    export let onClose;

    let borrowerName = book?.borrower || '';
    let loading = false;
    let searchError = '';

    async function handleLend() {
        if (!borrowerName.trim()) return;
        
        loading = true;
        searchError = '';
        let borrowerId = null;
        if (borrowerName.startsWith('@')) {
            const usernameToFind = borrowerName.substring(1).trim();
            const { data } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', usernameToFind)
                .maybeSingle();

            if (data) {
                borrowerId = data.id; 
            } else {
                searchError = "User not found. Check the username, or just type a regular name without the '@' symbol.";
                loading = false;
                return;
            }
        }

        await onSave({ 
            borrower: borrowerName.trim(), 
            borrower_id: borrowerId 
        });
        
        loading = false;
        onClose();
    }

    function handleReturn() {

        onSave({ borrower: '', borrower_id: null });
        onClose();
    }
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <h2>Lend Volume</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
            Who is borrowing <em>"{book.title}"</em>?
        </p>

        <div class="form-group" style="margin-bottom: 1rem;">
            <label for="borrower">Borrower Name or @username</label>
            <input 
                id="borrower" 
                type="text" 
                bind:value={borrowerName} 
                placeholder="e.g., Captain Nemo or @captain_nemo" 
                class="input-field {searchError ? 'error-shake' : ''}" 
                style={searchError ? 'border-color: #fb7185;' : ''}
                on:keydown={(e) => e.key === 'Enter' && handleLend()}
                autofocus 
            />
            {#if searchError}
                <span style="color: #fb7185; font-size: 0.8rem; display: block; margin-top: 0.5rem;">{searchError}</span>
            {/if}
            
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
                Tip: Use <strong>@username</strong> to lend directly to another user!
            </p>
        </div>

        <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
            {#if book.borrower}
                <button type="button" class="btn-secondary" style="margin-right: auto; color: var(--success-muted); border-color: var(--success-muted);" on:click={handleReturn} disabled={loading}>
                    Mark Returned
                </button>
            {/if}
            <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Cancel</button>
            <button type="button" class="btn-primary" on:click={handleLend} disabled={loading || !borrowerName}>
        Confirm
         </button>
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
        display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;
    }
    
    
    .modal-content {
        width: 100%; 
        max-width: 400px; 
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        background: rgba(122, 122, 141, 0.2); 
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    :global(.light-mode) .modal-content {
        background: rgba(255, 255, 255, 0.46);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 20px -12px rgba(112, 79, 8, 0.5);
    }

    h2 {
        font-family: 'Playfair Display', serif;
        margin-bottom: 0.5rem;
    }
</style>