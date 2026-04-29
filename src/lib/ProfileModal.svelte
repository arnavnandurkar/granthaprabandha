<script>
    import { fade, fly } from 'svelte/transition';

    export let profile;
    export let onSave;
    export let onClose;
    let username = profile?.username || '';
    let bio = profile?.bio || '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        await onSave({ username, bio });
        loading = false;
        onClose();
    }
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <h2>Your Profile</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
            Customize your profile.
        </p>

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label for="username">Username</label>
                <input 
                    id="username" 
                    type="text" 
                    bind:value={username} 
                    placeholder="e.g., Anakin Skywalker" 
                    class="input-field" 
                    required 
                />
            </div>

            <div class="form-group" style="margin-bottom: 2rem;">
                <label for="bio">Bio</label>
                <textarea 
                    id="bio" 
                    bind:value={bio} 
                    placeholder="Write a few words about yourself" 
                    class="input-field" 
                    style="width: 100%; 
                    padding: 1rem; 
                    background: rgba(0, 0, 0, 0.2); 
                    border: 1px solid var(--glass-border); 
                    border-radius: var(--radius-sm); 
                    color: var(--text-primary); 
                    font-family: inherit; 
                    font-size: 0.95rem; 
                    min-height: 100px; 
                    resize: vertical;"
                ></textarea>
            </div>

            <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Cancel</button>
                <button type="submit" class="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
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
        margin-bottom: 0.2rem;
        color: var(--accent-gold);
    }
</style>