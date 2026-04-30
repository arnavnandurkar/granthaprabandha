<script>
    import { fade, fly } from 'svelte/transition';
    export let onClose;
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }} on:click={onClose}>
    <div class="modal-content glass-panel" transition:fly={{ y: 20, duration: 400 }} on:click|stopPropagation>
        <div class="modal-header">
            
            <h2 style="font-family: 'Playfair Display', serif; color: var(--accent-gold); margin-bottom: 0.5rem;">
                Granthaprabandha<br>ग्रंथप्रबंध
            </h2>
            <button class="close-btn" on:click={onClose}>✕</button>
        </div>
        
        <div class="info-section">
            <h3>About</h3>
            <p>Granthaprabandha (Sanskrit for 'book management') is, as the name suggests, 
            a library management system. This is ideal for a physical collection of books.
            I started making it to track my own collection of books,
            which is quite large, but ended up making this comprehensive system which can also be used by
            other users like you. Enjoy!</p><br><p>A project by Arnav Nandurkar, 2026.</p><br>
             <a href="https://github.com/arnavnandurkar/granthaprabandha">
        <button class="btn-secondary">Repository on Github</button>
        </a>
        </div>
       
        <div class="info-section">
            <h3>Features</h3>
            <ul>
                <li>Create multiple catalogs and add books according to shelf</li>
                <li>Add custom genres, shelf names, and formats</li>
                <li>Track books you've lent to people</li>
                <li>Add books by scanning barcodes</li>
                <li>Automatically adds book cover, title, author from ISBN</li>
                <li>Share your catalogs with a link</li>
                
            </ul>
        </div>
        
    </div>
</div>

<style>
    .modal-header {
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 2rem; 
        }
    .modal-header h3 {color: var(--accent-gold); font-family: 'Playfair Display', serif; font-size: 1.8rem; margin: 0; }
    .close-btn { background: transparent; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
    .close-btn:hover { color: var(--danger-muted); }
    .info-section {
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .info-section h3 {
        color: var(--accent-gold);
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 0.25rem;
        font-family: 'Playfair Display', serif;
    }

    .info-section p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-primary);
    }

    .info-section ul {
        text-align: left;
        margin-left: 1.5rem;
        color: var(--text-primary);
        font-size: 0.95rem;
        line-height: 1.8;
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
        max-height: 90vh;
        border-radius: var(--radius-lg);
        background: rgba(122, 122, 141, 0.2); 
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        overflow-y: auto; 
        position: relative;
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
    @media (max-width: 600px) {
        .modal-content {
            padding: 1.5rem;
            max-height: 85vh; 
        }
    }
</style>