<script>
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import BookCard from './lib/BookCard.svelte';
    import AddBookModal from './lib/AddBookModal.svelte'; 
    import { fade, slide, fly } from 'svelte/transition';
    import Analytics from './lib/Analytics.svelte';
    import { supabase } from './lib/supabase.js'
    import LendModal from './lib/LendModal.svelte';
    import DeleteModal from './lib/DeleteModal.svelte';
    import Auth from './lib/Auth.svelte';
    import ProfileModal from './lib/ProfileModal.svelte';
    import Sidebar from './lib/Sidebar.svelte';
    import DeleteCatalogModal from './lib/DeleteCatalogModal.svelte';
    import InfoModal from './lib/InfoModal.svelte';

    let isProfileModalOpen = false;
    let showAnalytics = false;
    let isModalOpen = false; 
    let books = [];
    let isLightMode = false;
    let session = null;
    let editingIndex = null;
    let toasts = [];
    let filterGenre = "All";
    let sortBy = "date-desc";
    let filterShelf = "All";
    let filterFormat = "All";
    let currentEditingBook = null;
    let isLendModalOpen = false;
    let currentLendingBook = null;
    let isDeleteModalOpen = false;
    let currentDeletingBook = null;
    let searchQuery = "";
    let selectedGenre = "All";
    let selectedForm = "All";
    let showOnlyLent = false;
    let showOnlyFavorites = false;
    let profile = null;
    let catalogs = [];
    let currentCatalog = null;
    let isSidebarOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let firstCatalogName = "";
    let isDeleteCatalogModalOpen = false;
    let currentDeletingCatalog = null;
    let isPublicView = false;
    let publicProfile = null;
    let isInfoModalOpen = false;

    function handleCreateFirstCatalog() {
        if (firstCatalogName.trim()) {
            createNewCatalog(firstCatalogName.trim());
            firstCatalogName=  "";
        }
    }

    function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; }
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeDist = touchEndX - touchStartX;
        if (swipeDist > 75 && !isSidebarOpen) isSidebarOpen = true;
        if (swipeDist < -75 && isSidebarOpen) isSidebarOpen = false;
    }

    function openDeleteModal(book) {
        currentDeletingBook = book;
        isDeleteModalOpen = true;
    }

    function closeDeleteModal() {
        currentDeletingBook = null;
        isDeleteModalOpen = false;
    }
    function openLendModal(book) {
        currentLendingBook = book;
        isLendModalOpen = true;
    }

    function closeLendModal() {
        currentLendingBook = null;
        isLendModalOpen = false;
    }
    function openModal(book = null) {
        currentEditingBook = book;
        isModalOpen = true;
    }
    function closeModal() {
        currentEditingBook = null;
        isModalOpen = false;
    }
    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const shareId = urlParams.get('share');
        
        if (shareId) {
            isPublicView = true;
            await loadPublicCatalog(shareId);
            return; 
        }

        const { data } = await supabase.auth.getSession();
        session = data.session;
        if (session) fetchUserData(); 

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
            if (session) {
                fetchUserData(); 
            } else {
                books = []; profile = null; catalogs = []; currentCatalog = null;
            }
        });
        
        const savedTheme = localStorage.getItem('library-theme');
        if (savedTheme === 'light') {
            isLightMode = true;
            document.documentElement.classList.add('light-mode');
        }
    });

    async function fetchUserData() {
        try {
            let { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
            if (!profileData) {
                const tempUsername = session.user.email.split('@')[0];
                const { data: newProf } = await supabase
                    .from('profiles')
                    .insert([{ id: session.user.id, username: tempUsername }])
                    .select()
                    .single();
                profileData = newProf;
            }
            profile = profileData;
            let { data: catalogsData } = await supabase
                .from('catalogs')
                .select('*')
                .order('created_at', { ascending: true });
            if (catalogsData && catalogsData.length > 0) {
                catalogs = catalogsData;
                currentCatalog = catalogs[0];
                fetchBooksForCatalog(currentCatalog.id);
            } else {
                catalogs = [];
                currentCatalog = null;
                books = []; 
            }
        } catch (err) {
            console.error("Critical Data Fetch Error:", err);
            showToast("Failed to load user data.", "error");
        }
    }
    
    async function fetchBooksForCatalog(catalogId) {
        if (catalogId === 'borrowed') {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('borrower_id', session.user.id)
                .order('created_at', { ascending: false });
                
            if (!error) {
                books = data || [];
            } else {
                showToast("Failed to fetch borrowed books.", "error");
            }
        } else {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('catalog_id', catalogId) 
                .order('created_at', { ascending: false });
                
            if (!error) {
                books = data || [];
            } else {
                showToast("Failed to fetch catalog.", "error");
            }
        }
    }
    async function updateProfile(updates) {
        const { error } = await supabase
            .from('profiles')
            .upsert({ id: session.user.id, ...updates }) 
            .select();
        if (!error) {
            profile = { ...profile, ...updates };
            showToast("Profile updated successfully!", "success");
        } else {
            console.error("Profile update error:", error);
            showToast("Failed to update profile.", "error");
        }
    }

    function selectCatalog(catalog) {
        currentCatalog = catalog;
        fetchBooksForCatalog(catalog.id); 
    }

    async function createNewCatalog(name) {
        const { data, error } = await supabase
            .from('catalogs')
            .insert([{ name: name, user_id: session.user.id }])
            .select()
            .single();
        if (!error && data) {
            catalogs = [...catalogs, data]; 
            selectCatalog(data); 
            showToast("Catalog created!", "success");
        } else {
            console.error("Catalog creation error:", error);
            showToast("Failed to create catalog.", "error");
        }
    }
async function loadPublicCatalog(catalogId) {
        const { data: catalogData, error: catError } = await supabase
            .from('catalogs').select('*').eq('id', catalogId).single();
            
        if (catError || !catalogData) {
            showToast("This catalog is private or does not exist.", "error");
            return;
        }
        currentCatalog = catalogData;
        const { data: profileData } = await supabase
            .from('profiles').select('*').eq('id', catalogData.user_id).single();
        publicProfile = profileData;
        const { data: bookData } = await supabase
            .from('books').select('*').eq('catalog_id', catalogId).order('created_at', { ascending: false });
        books = bookData || [];
    }

    async function handleShare(catalog) {
        if (!catalog.is_public) {
            const { error } = await supabase
                .from('catalogs')
                .update({ is_public: true })
                .eq('id', catalog.id);
            if (!error) {
                catalog.is_public = true;
                catalogs = [...catalogs]; 
            } else {
                showToast("Failed to make catalog public.", "error");
                return;
            }
        }

        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${catalog.id}`;
        
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("Share link copied to clipboard!", "success");
        } catch (err) {
            prompt("Copy this link to share your catalog:", shareUrl);
        }
    }
    $: filteredBooks = books
        .filter(b => 
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            b.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(b => filterGenre === "All" || b.genre === filterGenre)
        .filter(b => filterShelf === "All" || b.shelf === filterShelf)
        .filter(b => filterFormat === "All" || b.formFactor === filterFormat)
        .sort((a, b) => {
            if (sortBy === "title-asc") return a.title.localeCompare(b.title);
            if (sortBy === "title-desc") return b.title.localeCompare(a.title);
            if (sortBy === "author-asc") return a.author.localeCompare(b.author);
            if (sortBy === "author-desc") return b.author.localeCompare(a.author);
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            
            if (sortBy === "date-desc") return dateB - dateA; 
            if (sortBy === "date-asc") return dateA - dateB;
            return 0;
        });
    
    function showToast(message, type = 'success') {
        const id = Date.now();
        toasts = [...toasts, { id, message, type }];
        setTimeout(() => {
            toasts = toasts.filter(t => t.id !== id);
        }, 3000);
    }
    async function handleLogout() {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.warn("Server logout failed, forcing local clear:", err);
        } finally {
            session = null;
            profile = null;
            books = [];
            catalogs = [];
            currentCatalog = null;
            window.location.reload();
        }
    }
    $: totalBooks = books.length;
    $: lentOut = books.filter(b => b.borrower).length;
    $: shelfStats = Object.entries(
        books.reduce((acc, book) => {
            const s = book.shelf || 'Unassigned';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]);

    const defaultGenres = ["Sci-Fi", "Fantasy", "General Fiction", "Non-Fiction", "Reference", "Comics", "Magazines"];
    const defaultFormats = ["Small Paperback", "Medium Paperback", "Large Paperback", "Small Hardcover", "Medium Hardcover", "Large Hardcover"];
    
    $: availableGenres = [...new Set([...defaultGenres, ...books.map(b => b.genre).filter(Boolean)])].sort();
    $: availableFormats = [...new Set([...defaultFormats, ...books.map(b => b.formFactor).filter(Boolean)])].sort();
    $: availableShelves = [...new Set(books.map(b => b.shelf).filter(Boolean))].sort();

    onMount(() => {
        const savedTheme = localStorage.getItem('library-theme');
        if (savedTheme === 'light') {
            isLightMode = true;
            document.documentElement.classList.add('light-mode');
        }
    });

    function getAbsoluteIndex(book) {
        return books.findIndex(b => b === book);
    }

    async function saveBook(newBookDetails) {
        try {
            if (newBookDetails.id) {
                const { id, ...updates } = newBookDetails;
                const { error } = await supabase
                    .from('books')
                    .update(updates)
                    .eq('id', id);
                if (error) throw error;
                books = books.map(b => b.id === id ? { ...b, ...updates } : b);
                showToast("Book updated!", "success");
            } else {
                if (!currentCatalog) {
                    showToast("System error: No active catalog selected.", "error");
                    return;
                }
                const bookToInsert = { 
                    ...newBookDetails, 
                    catalog_id: currentCatalog.id 
                };
                const { data, error } = await supabase
                    .from('books')
                    .insert([bookToInsert])
                    .select();
                if (error) throw error;

                if (data && data.length > 0) {
                    books = [data[0], ...books];
                    showToast("Book added!", "success");
                }
            }
        } catch (err) {
            console.error("Database Error:", err);
            showToast(`Error: ${err.message}`, "error");
        } finally {
            closeModal();
        }
    }
    async function renameCatalog(catalogId, newName) {
        const { error } = await supabase
            .from('catalogs')
            .update({ name: newName })
            .eq('id', catalogId);

        if (!error) {
            catalogs = catalogs.map(c => c.id === catalogId ? { ...c, name: newName } : c);
            if (currentCatalog?.id === catalogId) currentCatalog.name = newName;
            showToast("Catalog renamed!", "success");
        } else {
            console.error("Rename Error:", error);
            showToast("Failed to rename catalog.", "error");
        }
    }

    function promptDeleteCatalog(catalogId) {
        currentDeletingCatalog = catalogs.find(c => c.id === catalogId);
        isDeleteCatalogModalOpen = true;
    }

    async function executeDeleteCatalog() {
        if (!currentDeletingCatalog) return;
        const catalogId = currentDeletingCatalog.id;

        const { error } = await supabase
            .from('catalogs')
            .delete()
            .eq('id', catalogId);

        if (!error) {
            catalogs = catalogs.filter(c => c.id !== catalogId);
            
            if (currentCatalog?.id === catalogId) {
                if (catalogs.length > 0) {
                    selectCatalog(catalogs[0]);
                } else {
                    currentCatalog = null;
                    books = [];
                }
            }
            showToast("Catalog deleted.", "success");
        } else {
            console.error("Delete Error:", error);
            showToast("Failed to delete catalog.", "error");
        }
        isDeleteCatalogModalOpen = false;
        currentDeletingCatalog = null;
    }
    async function deleteBook(id) {
        if (!id) {
            showToast("System error: Book ID missing. Please refresh the page.", "error");
            return;
        }

        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id);
        if (!error) {
            books = books.filter(b => b.id !== id);
            showToast("Book removed!", "success");
        } else {
            console.error("Delete Error:", error);
            showToast("Error removing book!", "error");
        }
    }   

    function editBook(book) {
        editingIndex = getAbsoluteIndex(book);
        isModalOpen = true;
    }

  async function updateBookDirectly(id, updates) {
    if (updates.borrower === '' || updates.borrower === null) {
        updates.borrower_id = null;
    }

    const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select(); 

    if (error) {
        console.error("Database sync error:", error);
        showToast("Failed to sync change.", "error");
        return;
    }
    if (!data || data.length === 0) {
        console.error("Update failed: Row Level Security (RLS) blocked it or book not found.");
        showToast("Database blocked the update. Check RLS policies.", "error");
        return;
    }

    const isBeingReturned = updates.borrower === '' || updates.borrower === null;
    
    if (currentCatalog?.id === 'borrowed' && isBeingReturned) {
        books = books.filter(b => b.id !== id);
        showToast("Book returned to owner.", "success");
    } else {
        books = books.map(b => b.id === id ? data[0] : b);
    }
}
    function toggleTheme() {
        isLightMode = !isLightMode;
        if (isLightMode) {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('library-theme', 'light');
        } else {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('library-theme', 'dark');
        }
    }
    
</script>

<svelte:window on:touchstart={handleTouchStart} on:touchend={handleTouchEnd} />

<header in:fade={{ duration: 1000 }}>
    <div class="header-content">
        <div class="title-group">
            <h1 class="brand-font">Granthaprabandha<br>ग्रंथप्रबंध</h1>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button class="theme-toggle" on:click={() => showAnalytics = !showAnalytics} title="View Insights">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            </button>
            <button class="theme-toggle" on:click={toggleTheme} title="Toggle Theme">
                {#if isLightMode}
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                {:else}
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                {/if}
            </button>
            <button class="theme-toggle" on:click={() => isInfoModalOpen = true} title="About the App">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            </button>
        </div>
    </div>
</header>

{#if session}
    <button class="drawer-toggle glass-panel" on:click={() => isSidebarOpen = true} title="Open Catalogs">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    </button>

    <Sidebar 
        {catalogs} 
        {currentCatalog} 
        isOpen={isSidebarOpen}
        onClose={() => isSidebarOpen = false}
        onSelect={selectCatalog} 
        onCreate={createNewCatalog} 
        onRename={renameCatalog}  
        onDelete={promptDeleteCatalog} 
        onShare={handleShare}
        />
{/if}

<main class="container">
    {#if isPublicView}
        <div class="main-content">
            {#if !currentCatalog}
                <div class="empty-state glass-panel">
                    <div class="empty-icon">🔒</div>
                    <h2>Private or Missing Catalog</h2>
                    <p>This link is either invalid, or the owner has made it private.</p>
                </div>
            {:else}
                <header class="app-header" style="flex-direction: column; align-items: center; text-align: center; margin-top: 0.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">📖</div>
                    <h1 class="header-title" style="font-family: 'Playfair Display', serif; color: var(--accent-gold);">
                        {currentCatalog.name}
                    </h1>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                        by <strong>@{publicProfile?.username || 'Unknown User'}</strong>
                    </p>
                </header>
                <Analytics {books} isOpen={showAnalytics} />
                <div class="controls-wrapper glass-panel">
                    <input class="search-input" type="text" bind:value={searchQuery} placeholder="Search {books.length} books..." />
                </div>

                <div class="table-wrapper glass-panel" style="margin-top: 1.5rem;">
                    <table>
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Details</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each filteredBooks as book (book.id)}
                                <tr style="display: contents;" transition:slide={{ duration: 300 }} animate:flip={{ duration: 400 }}>
                                    <BookCard {book} isBorrowed={true} /> 
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    
                    {#if filteredBooks.length === 0}
                        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                            No books match your current search.
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

    {:else}
        {#if !session}
            <Auth />
        {:else}
            <div class="main-content">
                <header class="app-header">
                    <h1 class="header-title" title={currentCatalog?.name || 'Granthaprabandha'}>
                        {currentCatalog?.name || 'Welcome to Granthaprabandha'}
                    </h1>
                    <div class="user-controls">
                        <button class="btn-secondary profile-btn" on:click={() => isProfileModalOpen = true}>
                            <span class="mobile-icon">👤</span>
                            <span class="desktop-text">{profile?.username ? `@${profile.username}` : 'Profile'}</span>
                        </button>
                        <button class="btn-secondary logout-btn" on:click={handleLogout()}>
                            <span class="mobile-icon">→]</span>
                            <span class="desktop-text">Logout</span>
                        </button>
                    </div>
                </header>

                {#if !currentCatalog}
                    <div class="empty-state glass-panel" in:fly={{ y: 20, duration: 600 }}>
                        <div class="empty-icon">📁</div>
                        <h2>Create a Catalog</h2>
                        <p>You don't have any catalogs. Create a catalog to start adding your books.</p>
                        
                        <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.5rem; max-width: 400px; width: 100%; margin-left: auto; margin-right: auto;">
                            <input 
                                type="text" 
                                bind:value={firstCatalogName} 
                                placeholder="e.g., Main Library, To Read..." 
                                class="input-field"
                                maxlength="30"
                                on:keydown={(e) => e.key === 'Enter' && handleCreateFirstCatalog()}
                            />
                            <button class="btn-primary" style="padding: 0.75rem 1.5rem;" on:click={handleCreateFirstCatalog}>
                                Create
                            </button>
                        </div>
                    </div>
                {:else}
                    <Analytics {books} isOpen={showAnalytics} />
                    
                    <div class="controls-wrapper glass-panel">
                        <input class="search-input" type="text" bind:value={searchQuery} placeholder="Search by title or author..." />
                        <div class="filters-grid">
                            <select bind:value={filterGenre}>
                                <option value="All">All Genres</option>
                                {#each availableGenres as genre}{#if genre}<option value={genre}>{genre}</option>{/if}{/each}
                            </select>
                            <select bind:value={filterShelf}>
                                <option value="All">All Shelves</option>
                                {#each availableShelves as shelf}<option value={shelf}>Shelf {shelf}</option>{/each}
                            </select>
                            <select bind:value={filterFormat}>
                                <option value="All">All Formats</option>
                                {#each availableFormats as format}{#if format}<option value={format}>{format}</option>{/if}{/each}
                            </select>
                            <select bind:value={sortBy}>
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="title-asc">Title (A-Z)</option>
                                <option value="title-desc">Title (Z-A)</option>
                                <option value="author-asc">Author (A-Z)</option>
                                <option value="author-desc">Author (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {#if books.length === 0}
                        <div class="empty-state glass-panel" in:fly={{ y: 20, duration: 600 }}>
                            {#if currentCatalog.id === 'borrowed'}
                                <div class="empty-icon">👥</div>
                                <h2>No Borrowed Books</h2>
                                <p>When friends lend books to your <strong>@{profile?.username || 'username'}</strong> account, they will appear here.</p>
                            {:else}
                                <div class="empty-icon">📚</div>
                                <h2>Make your library catalog</h2>
                                <p>Add your first book to start building your catalog!</p>
                                <button class="btn-primary" on:click={() => isModalOpen = true} style="margin-top: 1.5rem; padding: 1rem 2rem; font-size: 1.1rem;">
                                    + Add First Book
                                </button>
                            {/if}
                        </div>
                    {:else}
                        <div class="table-wrapper glass-panel">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cover</th>
                                        <th>Details</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        {#if currentCatalog.id !== 'borrowed'}
                                            <th>Actions</th>
                                        {/if}
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each filteredBooks as book (book.id)}
                                        <tr style="display: contents;" transition:slide={{ duration: 300 }} animate:flip={{ duration: 400 }}>
                                            <BookCard 
                                                {book} 
                                                isBorrowed={currentCatalog.id === 'borrowed'} 
                                                onDelete={() => openDeleteModal(book)} 
                                                onUpdate={(updates) => updateBookDirectly(book.id, updates)}
                                                onEdit={() => openModal(book)}
                                                onOpenLend={() => openLendModal(book)}
                                            />
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                            
                            {#if filteredBooks.length === 0}
                                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                                    No books match your current search and filters.
                                </div>
                            {/if}
                        </div>
                    {/if} 
                {/if} 
            </div> 
        {/if} 
    {/if} 
</main>
{#if currentCatalog && currentCatalog.id !== 'borrowed'}
    <button id="fab" on:click={() => { editingIndex = null; isModalOpen = true; }}>+</button>
{/if}
{#if isDeleteCatalogModalOpen}
    <DeleteCatalogModal 
        catalog={currentDeletingCatalog} 
        onConfirm={executeDeleteCatalog} 
        onClose={() => isDeleteCatalogModalOpen = false} 
    />
{/if}

<div class="toast-container">
    {#each toasts as toast (toast.id)}
        <div 
            class="toast glass-panel {toast.type}" 
            in:fly={{ y: 50, duration: 400 }} 
            out:fade={{ duration: 300 }}
            animate:flip={{ duration: 300 }}
        >
            {#if toast.type === 'success'}
                <span style="color: var(--success-muted);">✓</span>
            {:else}
                <span style="color: var(--danger-muted);">⚠</span>
            {/if}
            {toast.message}
        </div>
    {/each}
</div>

{#if isModalOpen}
    <AddBookModal 
        existingBook={currentEditingBook} 
        onSave={saveBook} 
        onClose={closeModal} 
    />
{/if}
{#if isLendModalOpen}
    <LendModal 
        book={currentLendingBook} 
        onSave={(updates) => updateBookDirectly(currentLendingBook.id, updates)} 
        onClose={closeLendModal} 
    />
{/if}
{#if isDeleteModalOpen}
    <DeleteModal 
        book={currentDeletingBook} 
        onConfirm={() => deleteBook(currentDeletingBook.id)} 
        onClose={closeDeleteModal} 
    />
{/if}
{#if isProfileModalOpen}
    <ProfileModal 
    profile={profile}
    onClose={() => isProfileModalOpen = false} 
    onUpdate={(newData) => {
        profile = { ...profile, ...newData };
    }}
/>
{/if}
{#if isInfoModalOpen}
    <InfoModal onClose={() => isInfoModalOpen = false} />
{/if}
<style>
    .shelf-stat-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 1rem 1.5rem;
    }
    .shelf-list {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        max-height: 70px; 
        overflow-y: auto;
        margin-top: 0.5rem;
        text-align: left;
        padding-right: 0.5rem;
    }
    .shelf-list::-webkit-scrollbar { width: 4px; }
    .shelf-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .shelf-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--text-secondary);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding-bottom: 0.2rem;
    }
    .shelf-row:last-child { 
        border-bottom: none;
         }
    .shelf-count { 
        color: var(--accent-gold); 
        font-weight: 600; 
        }
    
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }
    .title-group {
        text-align: left;
    }
    .theme-toggle {
        background: var(--glass-surface);
        border: 1px solid var(--glass-border);
        color: var(--accent-gold);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.3s var(--ease-out-expo);
        padding: 0;
    }
    .theme-toggle:hover {
        background: var(--glass-surface-hover);
        transform: rotate(15deg) scale(1.1);
        box-shadow: 0 4px 15px var(--accent-gold-glow);
    }
    
    
       

    .toast-container {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 2000;
        pointer-events: none;
    }

    .toast {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        font-weight: 500;
        font-size: 0.95rem;
        color: var(--text-primary);
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .toast.success { 
        border: 1px solid rgba(45, 212, 191, 0.3);
         }
    .toast.error {
         border: 1px solid rgba(251, 113, 133, 0.3); 
         }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem 2rem;
        margin-top: 2rem;
        border: 2px dashed rgba(146, 108, 21, 0.3);
        background: rgba(0, 0, 0, 0.1);
    }
    :global(.light-mode) .empty-state {
        background: rgba(255, 255, 255, 0.3);
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.8;
        filter: drop-shadow(0 0 15px var(--accent-gold-glow));
    }

    .empty-state h2 {
        font-family: 'Playfair Display', serif;
        color: var(--accent-gold);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .empty-state p {
        color: var(--text-secondary);
        max-width: 400px;
        line-height: 1.6;
    }
    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        min-width: 0;
        max-width: 1200px;
        margin: 0 auto; 
        width: 100%; 
        padding-bottom: 6rem;
    }

    .drawer-toggle {
    position: fixed;  
    left: 1.5rem;
    width: 3.5rem; 
    height: 3.5rem;
    bottom: max(2rem, env(safe-area-inset-bottom) + 1rem);
    background: var(--fab); 
    backdrop-filter: blur(16px);       
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
    border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    box-shadow: 0 8px 32px var(--accent-gold-glow);
    text-decoration: none;
    transition: all 0.5s var(--ease-out-expo);
    z-index: 999;
    padding: 0;
}

    .drawer-toggle:hover, .drawer-toggle:active {
         transform: 
         scale(1.1) rotate(180deg); 
         background: var(--accent-gold); 
         color: var(--bg-base);
    }

    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-left: 0;

    }

    .header-title {
        font-size: 1.5rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; 
    }

    .user-controls {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-shrink: 0; 
        margin-top: 0.2rem;
    }

    .profile-btn, .logout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
    }
    
    .profile-btn {
        border-radius: 999px;
        border-color: var(--accent-gold);
    }

    .mobile-icon { display: none; }

    @media (max-width: 600px) {
        .app-header { 
            padding-left: 0; 
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            margin-top: -1.5rem; 
            margin-bottom: 1rem;
        }
        .header-title { 
            font-size: 1.3rem;
            width: 100%; 
            }
        .desktop-text { 
            display: none; 
            }
        .mobile-icon { 
            display: block; 
            font-size: 1.1rem;
             }
        .profile-btn, .logout-btn {
            padding: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
         .header-content { 
            flex-direction: column;
            gap: 1rem; 
            text-align: center; 
            }
        .title-group { 
            text-align: center; }
    
    }
</style>