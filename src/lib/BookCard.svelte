<script>
    import { slide } from 'svelte/transition';

    export let book;
    export let onDelete;
    export let onToggleLent;
    export let onEdit;
    export let onUpdate;
    export let onOpenLend;
    export let isBorrowed = false;

    let isExpanded = false;
    let isLending = false;
    let borrowerName = "";

   function handleLend() {
        const name = prompt("Who are you lending this book to?");
        if (name && name.trim() !== "") {
            onUpdate({ borrower: name }); 
        }
    }

    function handleReturn() {
        if (confirm(`Has ${book.borrower} returned this book?`)) {
            onUpdate({ borrower: "" }); 
        }
    }
   $: isLent = book.borrower && book.borrower.trim() !== "";
   $: displayCover = book.coverUrl 
        ? book.coverUrl 
        : (book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn.trim()}-M.jpg` 
        : 'Untitled.png');
        
    $: currentRating = book.rating || 0;
    function setRating(stars, event) {
        event.stopPropagation();
        book.rating = stars;
        onUpdate(book);
    }
    function formatDate(dateString) {
        if (!dateString) return 'Date not added';
        
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return 'Date not added'; 
            return d.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return 'Date not added';
        }
    }
    async function shareBook() {
        const shareData = {
            title: book.title,
            text: 'I am cataloging my library using Granthaprabha. Here is a book I recommend: "${book.title}" by ${book.author}!',
            url: window.location.href,

        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch(err) {
                console.log('Share cancelled', err);
            } 

        } else {
            navigator.clipboard.writeText('$shareDara.text \n${shareData.url}');
            alert("Copied to clipboard!");
        }
    }
</script>

<tr class="clickable-row {isExpanded ? 'expanded' : ''}" on:click={() => isExpanded = !isExpanded}>
    <td>
        <img 
            src={displayCover} 
            class="book-cover" 
            alt="Cover of {book.title}" 
            on:error={(e) => e.target.src = 'Untitled.png'}
        />
    </td>
    <td data-label="Details">
        <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-primary);">
            {book.title}
        </div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
            {book.author} • {book.genre || 'General'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; opacity: 0.7;">
            ISBN: {book.isbn || 'N/A'}
        </div>
    </td>
    <td data-label="Location">
        <div style="font-weight: 500; color: var(--text-primary);">Shelf: {book.shelf || 'Unassigned'}</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            {book.formFactor || 'Unknown'}
        </div>
    </td>
    <td data-label="Status">
        <span class="status-badge {isLent ? 'status-lent' : 'status-available'}">
            {isLent ? `Lent: ${book.borrower}` : 'Available'}
        </span>
    </td>
    <td data-label="Actions">
       <div class="btn-actions">
        {#if !isBorrowed}
        <button class="btn-danger" on:click={onDelete}>
            Delete
        </button>

        {#if isLent}
            <button class="btn-secondary" style="color: var(--accent-gold);" on:click={() => onUpdate({ borrower: "" })}>
                Mark Returned
            </button>
        {:else}
            <button class="btn-secondary" on:click={onOpenLend}>
                Lend
            </button>
        {/if}

        <button class="btn-secondary" on:click={onEdit}>
            Edit
        </button>
    {/if}
    </div>
    </td>
</tr>
{#if isExpanded}
<tr>
    <td colspan="5" style="padding: 0; border: none;">
        <div class="drawer-content" transition:slide={{ duration: 300 }}>
            <div class="date-section">
                    <span class="drawer-label">Date Acquired</span>
                    <p class="notes-text" style="color: var(--accent-gold);">
                        {formatDate(book.date)}
                    </p>
                </div><br>
            <div class="drawer-grid">
            <div class="rating-section" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <span class="drawer-label">Your Rating</span>
                        <div class="stars">
                            {#each [1, 2, 3, 4, 5] as star}
                                <svg 
                                    on:click={(e) => setRating(star, e)}
                                    class="star-icon {currentRating >= star ? 'filled' : 'empty'}" 
                                    viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            {/each}
                        </div>
                    </div>

                    <button class="btn-secondary" on:click={shareBook} style="display: flex; align-items: center; gap: 0.5rem; width: fit-content;">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share Book
                    </button>
                </div>
                <div class="notes-section">
                    <span class="drawer-label">Your Notes</span>
                    {#if book.notes}
                        <p class="notes-text">{book.notes}</p>
                    {:else}
                        <p class="notes-text empty-notes">No notes added. Click 'Edit' to add your thoughts.</p>
                    {/if}
                </div>
            </div>
        </div>
    </td>
</tr>
{/if}
<style>
    .clickable-row { cursor: pointer; transition: background 0.3s ease; }
    .clickable-row:hover { background: var(--glass-surface-hover); }
    .clickable-row.expanded td { border-bottom: none;}
    
    .drawer-content {
        background: rgba(0, 0, 0, 0.15); 
        border-bottom: 1px solid var(--glass-border);
        padding: 1.5rem 2rem;
        box-shadow: inset 0 8px 10px -10px rgba(0,0,0,0.3);
    }
    :global(.light-mode) .drawer-content { background: rgba(0, 0, 0, 0.03); }
    .drawer-grid { display: flex; gap: 3rem; flex-wrap: wrap; }
    .drawer-label { 
        display: block; font-size: 0.75rem; text-transform: uppercase; 
        letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 600;
    }

    .stars { display: flex; gap: 0.25rem; }
    .star-icon { width: 24px; height: 24px; cursor: pointer; transition: transform 0.2s, color 0.2s; }
    .star-icon:hover { transform: scale(1.2); }
    .star-icon.filled { color: var(--accent-gold); fill: var(--accent-gold); }
    .star-icon.empty { color: var(--text-secondary); fill: transparent; opacity: 0.3; }
    .notes-section { flex: 1; min-width: 250px; border-left: 1px solid var(--glass-border); padding-left: 2rem; }
    .notes-text { color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; margin: 0; }
    .notes-text.empty-notes { color: var(--text-secondary); font-style: italic; opacity: 0.7; }
    
   @media (max-width: 768px) {
        .drawer-grid { 
            flex-direction: column; 
            gap: 1.5rem; 
        }
        
        .notes-section { 
            border-left: none; 
            padding-left: 0; 
            border-top: 1px solid var(--glass-border); 
            padding-top: 1.5rem; 
            min-width: 100%; 
        }
        
        .drawer-content { 
            padding: 1.25rem; 
        }
        
        .rating-section button {
            width: 100% !important;
            justify-content: center;
        }
    }
</style>