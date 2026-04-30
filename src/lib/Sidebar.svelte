<script>
    
    import { slide, fade, scale } from 'svelte/transition';

    export let catalogs = [];
    export let currentCatalog = null;
    export let isOpen = false;
    export let onSelect;
    export let onCreate;
    export let onClose;
    export let onRename; 
    export let onDelete;
    export let onShare;
    

    let isCreating = false;
    let newCatalogName = "";
    let editingId = null;
    let editingName = "";

    function handleCreate() {
        if (newCatalogName.trim()) {
            onCreate(newCatalogName.trim());
            newCatalogName = "";
            isCreating = false;
        }
    }
    function selectAndClose(catalog) {
        onSelect(catalog);
        onClose(); 
    }
    function startEditing(catalog) {
        editingId = catalog.id;
        editingName = catalog.name;
    }
    function submitRename(id) {
        if (editingName.trim() && editingName !== catalogs.find(c => c.id === id).name) {
            onRename(id, editingName.trim());
        }
        editingId = null;
    }
</script>
{#if isOpen}
    <div class="modal-overlay">
        
        <div class="sidebar-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}></div>
        <aside class="sidebar" transition:scale={{ start: 0.95, duration: 250, opacity: 0 }}>
            
            <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-family: 'Playfair Display', serif; color: var(--accent-gold); font-size: 1.2rem; margin: 0;">Catalogs</h2>
                <button class="close-btn" style="padding: 0.2rem 0.6rem; border: none;" on:click={onClose}>✕</button>
            </div>
            
            <ul class="catalog-list">
                
                <li class="catalog-item {currentCatalog?.id === 'borrowed' ? 'active' : ''}">
                    <div class="catalog-name" on:click={() => selectAndClose({ id: 'borrowed', name: 'Borrowed Books' })}>
                        👥 Borrowed Books
                    </div>
                </li>
                {#each catalogs as catalog (catalog.id)}
                    <li class="catalog-item {currentCatalog?.id === catalog.id && editingId !== catalog.id ? 'active' : ''}">
                        
                        {#if editingId === catalog.id}
                            <div style="display: flex; gap: 0.5rem; width: 100%;">
                                <input 
                                    type="text" bind:value={editingName} class="input-field" 
                                    style="padding: 0.3rem; font-size: 0.9rem; flex-grow: 1;"
                                    on:keydown={(e) => e.key === 'Enter' && submitRename(catalog.id)} autofocus
                                    maxlength="30"
                                />
                                <button class="btn-primary" style="padding: 0.2rem 0.5rem;" on:click={() => submitRename(catalog.id)}>OK</button>
                                <button class="btn-secondary" style="padding: 0.2rem 0.5rem;" on:click={() => editingId = null}>✕</button>
                            </div>
                        {:else}
                            <div class="catalog-name" on:click={() => selectAndClose(catalog)}> {catalog.name}</div>
                            <div class="catalog-actions">
                                <button class="icon-btn share-btn" style={catalog.is_public ? 'color: var(--accent-amber);' : ''} on:click|stopPropagation={() => onShare(catalog)} title={catalog.is_public ? 'Copy Link' : 'Make Public & Share'}>🔗</button>
                                <button class="icon-btn edit-btn" on:click|stopPropagation={() => startEditing(catalog)} title="Rename">🖊️</button>
                                <button class="icon-btn delete-btn" on:click|stopPropagation={() => onDelete(catalog.id)} title="Delete">🗑️</button>
                            </div>
                        {/if}
                    </li>
                {/each}
            </ul>
            <div class="sidebar-actions" style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                {#if isCreating}
                    <div transition:slide={{ duration: 200 }}>
                        <input type="text" bind:value={newCatalogName} placeholder="Catalog name..." 
                        class="input-field" style="padding: 0.5rem; 
                        font-size: 0.9rem;" 
                        on:keydown={(e) => e.key === 'Enter' && handleCreate()}  
                        maxlength="30" autofocus/>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <button class="btn-primary" style="flex: 1; padding: 0.3rem;" on:click={handleCreate}>Save</button>
                            <button class="btn-secondary" style="flex: 1; padding: 0.3rem;" on:click={() => isCreating = false}>X</button>
                        </div>
                    </div>
                {:else}
                    <button class="btn-secondary" style="width: 100%; border-color: rgba(255,255,255,0.1);" on:click={() => isCreating = true}>+ New Catalog</button>
                {/if}
            </div>
        </aside>

    </div>
{/if}

<style>
    
    .modal-overlay {
        position: fixed;
        top: 0; left: 0; 
        width: 100vw; height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        z-index: 1000;
        padding: 1rem; 
    }

    .sidebar-backdrop {
        position: absolute; 
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
    }
    .sidebar {
        position: relative; 
        display: flex; 
        flex-direction: column;
        z-index: 1001;
        width: 100%; 
        max-width: 260px;
        height: fit-content;       
        max-height: 80dvh;
        border-radius: 1.5rem; 
        padding: 1.5rem;
        background: rgba(122, 122, 141, 0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px -12px rgba(255, 255, 255, 0.5); 
    }
    :global(.light-mode) .sidebar {
        background: rgba(255, 255, 255, 0.46);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 20px -12px rgba(112, 79, 8, 0.5);
    }

    .catalog-list { 
        list-style: none; 
        padding: 0; 
        margin: 0; 
        flex-grow: 1; 
        overflow-y: auto; 
        display: flex; 
        flex-direction: column; 
        gap: 0.5rem; 
        }

    .catalog-item { 
        display: flex; 
        justify-content: 
        space-between; 
        align-items: center; 
        border-radius: var(--radius-sm); 
        transition: all 0.2s ease; 
        font-weight: 500; 
        color: var(--text-secondary); 
        }

    .catalog-item:hover { 
        background: rgba(255, 255, 255, 0.05); 
        color: var(--text-primary); 
        }

    .catalog-item.active { 
        background: rgba(146, 108, 21, 0.2); 
        color: var(--accent-gold); 
        border-left: 3px solid var(--accent-gold); }
    
    .catalog-name { 
        flex-grow: 1; 
        cursor: pointer; 
        padding: 0.75rem 0.5rem; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        }

    .catalog-actions { 
        display: flex; 
        gap: 0.25rem; 
        opacity: 0; 
        transition: opacity 0.2s; }
    
    .catalog-item:hover .catalog-actions { 
        opacity: 1;
         }

    @media (max-width: 768px) { .catalog-actions { opacity: 1; } } 
    
    .icon-btn { 
        background: transparent; 
        border: none; 
        color: var(--text-secondary); 
        cursor: pointer; 
        padding: 0.4rem; 
        border-radius: var(--radius-sm); 
        transition: all 0.2s;
         }
    .icon-btn:hover { 
        background: rgba(255,255,255,0.1); 
        color: var(--text-primary);
         }

    .delete-btn:hover { 
        background: rgba(251, 113, 133, 0.2); 
        color: #fb7185;
         }
    .catalog-list::-webkit-scrollbar { 
        width: 4px; 
        }
    .catalog-list::-webkit-scrollbar-thumb { 
        background: rgba(255,255,255,0.1); 
        border-radius: 4px; 
        }
    .close-btn { 
        background: transparent; 
        border: none; 
        color: var(--text-secondary); 
        font-size: 1.5rem; 
        cursor: pointer; 
        padding: 0.5rem; 
        }
    .close-btn:hover { 
        color: var(--danger-muted);
        }
</style>