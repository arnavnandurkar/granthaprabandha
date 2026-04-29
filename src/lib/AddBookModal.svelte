<script>
    import { fade, fly } from 'svelte/transition';

    export let onClose;
    export let onSave; 
    export let existingBook = null;
    export let showToast; 
    export let availableGenres = [];
    export let availableFormats = [];

    let isbn = existingBook ? existingBook.isbn : "";
    let title = existingBook ? existingBook.title : "";
    let author = existingBook ? existingBook.author : "";
    let shelf = existingBook ? existingBook.shelf : "";
    let date = existingBook ? existingBook.date : "";
    let formFactor = existingBook ? existingBook.formFactor : "";
    let genre = existingBook ? existingBook.genre : "";
    let borrower = existingBook ? existingBook.borrower : "";
    let notes = existingBook && existingBook.notes ? existingBook.notes : "";
    let rating = existingBook && existingBook.rating ? existingBook.rating : 0;
    let isSearching = false;
    let isScanning = false;
    let scannerInstance = null;
    let isEditing = !!existingBook;
    let coverUrl = existingBook && existingBook.coverUrl ? existingBook.coverUrl : "";
    const genres = ["Sci-Fi", "Fantasy", "General Fiction", "Non-Fiction", "Comics", "Reference", "Magazines"]
    const formats = ["Small Paperback", "Medium Paperback", "Large Paperback", "Small Hardcover", "Medium Hardcover", "Large Hardcover", "Leatherbound"]
    async function lookupISBN() {
        const cleanIsbn = isbn.replace(/[- ]/g, "").trim();
        if (!cleanIsbn) return showToast("Please enter an ISBN first.", "error");

        isSearching = true;
        try {
            let found = false;

            const olUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`;
            const olRes = await fetch(olUrl);
            const olData = await olRes.json();
            const bookKey = `ISBN:${cleanIsbn}`;

            if (olData[bookKey]) {
                title = olData[bookKey].title || "";
                author = olData[bookKey].authors ? olData[bookKey].authors[0].name : "Unknown Author";
                coverUrl = olData[bookKey].cover ? olData[bookKey].cover.medium : "";
                found = true;
            }
            if (!found || !title || !coverUrl) {
                const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`;
                const gbRes = await fetch(gbUrl);
                const gbData = await gbRes.json();

                if (gbData.items && gbData.items.length > 0) {
                    const info = gbData.items[0].volumeInfo;
                    title = title || info.title || "";
                    
                    if (author === "Unknown Author" || !author) {
                        author = info.authors ? info.authors.join(", ") : "Unknown Author";
                    }
                    
                    if (!coverUrl && info.imageLinks) {
                        coverUrl = info.imageLinks.thumbnail.replace("http:", "https:");
                    }
                    found = true;
                }
            }

            if (found) {
                showToast("Book details found!", "success");
            } else {
                showToast("Book not found in database.", "error");
            }
        } catch (err) {
            showToast("Network error. Please check your connection.", "error");
        } finally {
            isSearching = false;
        }
    }

    function startScanner() {
        isScanning = true;
        setTimeout(() => {
            scannerInstance = new Html5Qrcode("reader");
            scannerInstance.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 150 } },
                (decodedText) => {
                    isbn = decodedText;
                    stopScanner();
                    showToast("Barcode scanned!", "success");
                    lookupISBN();
                },
                (errorMessage) => {}
            ).catch(err => {
                showToast("Camera error: " + err, "error");
                stopScanner();
            });
        }, 100);
    }

    function stopScanner() {
        if (scannerInstance) {
            scannerInstance.stop().then(() => {
                scannerInstance.clear();
                isScanning = false;
            });
        } else {
            isScanning = false;
        }
    }

    function handleSubmit() {
        if (!title || !author) return showToast("Title and Author are required.", "error");
        
        const payload = { title, author, isbn, shelf, date, formFactor, genre, borrower, notes, rating, coverUrl };
        
        if (existingBook && existingBook.id) {
            payload.id = existingBook.id;
        }

        onSave(payload);
        onClose();
    }
</script>

<svelte:head>
    <script src="https://unpkg.com/html5-qrcode"></script>
</svelte:head>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click|self={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 50, duration: 400, opacity: 0 }}>
        <div class="modal-header">
            <h3>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
            <button class="close-btn" on:click={onClose}>✕</button>
        </div>
<form on:submit|preventDefault={handleSubmit}>
            <div class="input-group">
                <input type="text" bind:value={isbn} placeholder="ISBN Number">
                <button type="button" class="btn-secondary" on:click={lookupISBN} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Lookup API'}
                </button>
                {#if isScanning}
                    <button type="button" class="btn-danger" on:click={stopScanner}>Cancel Scan</button>
                {:else}
                    <button type="button" class="btn-secondary" on:click={startScanner}>
                        Scan Barcode
                    </button>
                {/if}
            </div>
            <div id="reader" style="display: {isScanning ? 'block' : 'none'};"></div>
            <div class="input-group">
                <input type="text" bind:value={title} placeholder="Book Title" required>
                <input type="text" bind:value={author} placeholder="Author Name" required>
            </div>
            <div class="input-group">
                <input list="genre-list" bind:value={genre} placeholder="Genre (Type or Select)">
                <datalist id="genre-list">
                    {#each genres as g}
                        <option value={g}></option>
                    {/each}
                </datalist>
                <input type="text" bind:value={shelf} placeholder="Shelf">
            </div>
            <div class="input-group">
                <input list="format-list" bind:value={formFactor} placeholder="Format (Type or Select)">
                <datalist id="format-list">
                    {#each formats as f}
                        <option value={f}></option>
                    {/each}
                </datalist>
                <input type="date" bind:value={date}>
            </div>
            <div style="display: block; width: 100%; margin-top: 1rem;">
                <textarea 
                    bind:value={notes} 
                    placeholder="Your Notes (Optional)" 
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
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1rem;">
                {isEditing ? 'Save Changes' : 'Add to Catalog'}
            </button>
        </form>
    </div>
</div>
<style>
    ::placeholder{
        colour: var(--text-primary);
        }
    .modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
        display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;
    }
    .modal-content {
        width: 100%; 
        max-width: 600px; 
        padding: 2.5rem;
        border-radius: var(--radius-lg); 
        max-height: 90vh; 
        overflow-y: auto;
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
    .modal-header {display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .modal-header h3 {color: var(--accent-gold); font-family: 'Playfair Display', serif; font-size: 1.8rem; margin: 0; }
    .close-btn { background: transparent; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
    .close-btn:hover { color: var(--danger-muted); }
    #reader { width: 100%; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid var(--accent-gold); margin-bottom: 1.5rem; }
    @media (max-width: 768px) { .modal-content { padding: 1.5rem; } }
    .notes-container {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }
  
    .notes-input {
        width: 100%; 
        padding: 1rem 1.25rem; 
        background: rgba(0, 0, 0, 0.2); 
        border: 1px solid var(--glass-border); 
        border-radius: var(--radius-sm); 
        color: var(--text-primary); 
        font-family: inherit; 
        font-size: 0.95rem;
        resize: vertical; 
        min-height: 80px;
        transition: all 0.3s ease;
    }
    .notes-input:focus {
        outline: none;
        background: rgba(0, 0, 0, 0.4);
        border-color: var(--accent-gold);
        box-shadow: 0 0 0 4px var(--accent-gold-glow);
    }
</style>