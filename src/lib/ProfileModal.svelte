<script>
    import { fade, fly } from 'svelte/transition';
    import { supabase } from './supabase';
    import DeleteConfirmModal from './DeleteConfirmModal.svelte';
    export let profile;
    export let onSave;
    export let onClose;
    export let onUpdate = null;
    let username = profile?.username || '';
    let bio = profile?.bio || '';
    let loading = false;
    let newPassword = '';
    let securityMessageColor = '';
    let securityMessage = '';
    let activeTab = 'profile';
    let currentPassword = ''; 
    let showDeleteModal = false;


    async function handleSave() {
        loading = true;
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Could not verify your identity.");

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    username: username, 
                    bio: bio 
                })
                .eq('id', user.id); 
            if (error) throw error;
            if (onUpdate) {
                onUpdate({ username: username, bio: bio });
            }
            
            onClose(); 
            
        } catch (err) {
            console.error("Profile Save Crash:", err.message);
            alert("Failed to save profile: " + err.message);
        } finally {
            loading = false;
        }
    }
    async function updateSecurity() {
        const cleanPassword = newPassword.trim();

        if (!cleanPassword) return;

        loading = true;
        securityMessage = '';

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const provider = session?.user?.app_metadata?.provider;

            if (provider !== 'email') {
                securityMessage = `You have logged in through(${provider}), you cannot change your password here.`;
                securityMessageColor = '#910b0b';
                loading = false;
                return;
            }
            const { error } = await supabase.auth.updateUser({ 
                password: cleanPassword 
            });
            
            if (error) throw new Error(error.message);

            securityMessage = "Success! Password updated.";
            securityMessageColor = '#084e35'; 
            newPassword = '';

        } catch (err) {
            console.error("Password Update Failed:", err);
            securityMessage = err.message;
            securityMessageColor = '#910b0b'; 
        } finally {
            loading = false;
        }
    }
    async function deleteAccount() {
        loading = true;
        const { error } = await supabase.rpc('delete_user');
        
        if (error) {
            securityMessage = `Failed to delete: ${error.message}`;
            securityMessageColor = '#910b0b';
            loading = false;
            showDeleteModal = false; 
        } else {
            await supabase.auth.signOut();
            onClose();
        }
    }
    
</script>
<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <h2>Settings</h2>

        <div class="tabs-container">
            <button class="tab-btn {activeTab === 'profile' ? 'active' : ''}" on:click={() => activeTab = 'profile'}>
                Profile
            </button>
            <button class="tab-btn {activeTab === 'security' ? 'active' : ''}" on:click={() => activeTab = 'security'}>
                Security
            </button>
        </div>

        {#if activeTab === 'profile'}
            <div class="tab-content" in:fade={{ duration: 200 }}>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" type="text" bind:value={username} placeholder="e.g., captain_nemo" class="input-field" maxlength="20" />
                </div>

                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label for="bio">Bio</label>
                    <textarea 
                        id="bio" 
                        bind:value={bio} 
                        placeholder="Write something about yourself" 
                        class="input-field" 
                        maxlength="160" 
                        rows="3"  
                        style="width: 100%; padding: 1rem; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); color: var(--text-primary); font-family: inherit; font-size: 0.95rem; min-height: 100px; resize: vertical;"
                    ></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Close</button>
                    <button type="button" class="btn-primary" on:click={handleSave} disabled={loading}>
                        Save Profile
                    </button>
                </div>
            </div>
        {/if}

        {#if activeTab === 'security'}
            <div class="tab-content" in:fade={{ duration: 200 }}>
            
                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label for="newPassword">Change Password</label>
                    <input id="newPassword" type="password" bind:value={newPassword} placeholder="Enter new password..." class="input-field" />
                </div>

                {#if securityMessage}
                    <p style="color: {securityMessageColor}; font-size: 0.85rem; margin-bottom: 1rem;">{securityMessage}</p>
                {/if}
                <div class="modal-actions">
    <button type="button" class="btn-secondary" on:click={onClose} disabled={loading}>Close</button>
    <button type="button" class="btn-primary" on:click={updateSecurity} disabled={loading || !newPassword}>
        Update Password
    </button>
</div>

                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed #910b0b;">
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        Deleting your account will erase ALL data. Please be sure about this.
                    </p>
                    <button type="button" class="btn-delete" on:click={() => showDeleteModal = true} disabled={loading}>
                     Permanently Delete Account
                  </button>
                </div>
            </div>
        {/if}
    </div>
</div>
<DeleteConfirmModal 
    isOpen={showDeleteModal} 
    onClose={() => showDeleteModal = false} 
    onConfirm={deleteAccount} 
    loading={loading} 
/>
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
        max-height: 90vh;
        overflow-y: auto;
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
    .tabs-container {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 1rem;
        padding: 0.5rem 0;
        cursor: pointer;
        position: relative;
        transition: color 0.2s ease;
    }

    .tab-btn:hover {
        color: white;
    }

    .tab-btn.active {
        color: var(--accent-gold); 
        font-weight: 600;
    }
    .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--accent-gold);
        border-radius: 2px;
    }
    
    .tab-content {
        display: flex;
        flex-direction: column;
    }
</style>