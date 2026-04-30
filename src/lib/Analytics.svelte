<<<<<<< HEAD

 <script>
    import { slide } from 'svelte/transition';

    export let books = [];
    export let isOpen = false;
    $: totalBooks = books.length;
    $: lentCount = books.filter(b => b.borrower).length;
    
    $: readCount = books.filter(b => b.rating && b.rating > 0).length;
    $: readPercentage = totalBooks === 0 ? 0 : Math.round((readCount / totalBooks) * 100);
    $: topGenres = Object.entries(
        books.reduce((acc, book) => {
            const g = book.genre || 'Uncategorized';
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 4);
    $: shelfStats = Object.entries(
        books.reduce((acc, book) => {
            const s = book.shelf || 'Unassigned';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]);
</script>
{#if isOpen}
    <div class="analytics-panel glass-panel" transition:slide={{ duration: 400 }}>
        <div class="analytics-grid">
            
            <div class="stat-card">
                <h4>Total Books</h4>
                <div class="big-number">{totalBooks}</div>

            </div>

            <div class="stat-card">
                <h4>Currently Lent Out</h4>
                <div class="big-number" style="color: var(--text-secondary);">{lentCount}</div>
                <div class="stat-footer" style="font-size: 1rem; margin-top: -0.5rem; margin-bottom: 1rem;">

                </div>
            </div>

            <div class="stat-card">
                <h4>Reading Progress</h4>
                <div class="big-number">{readCount} <span class="subtext">/ {totalBooks} Read</span></div>
                
                <div class="progress-track">
                    <div class="progress-fill" style="width: {readPercentage}%;"></div>
                </div>
                <div class="stat-footer">{readPercentage}% Completed</div>
            </div>

            <div class="stat-card">
                <h4>Genres</h4>
                <div class="chart-container">
                    {#each topGenres as [genre, count]}
                        <div class="bar-row">
                            <span class="bar-label">{genre}</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: {(count / totalBooks) * 100}%;"></div>
                            </div>
                            <span class="bar-count">{count}</span>
                        </div>
                    {/each}
                    {#if topGenres.length === 0}
                        <p class="empty-text">Add books to see your genres.</p>
                    {/if}
                </div>
            </div>

            <div class="stat-card">
                <h4>Books Per Shelf</h4>
                <div class="chart-container" style="max-height: 120px; overflow-y: auto; padding-right: 0.5rem;">
                    {#each shelfStats as [shelf, count]}
                        <div class="bar-row" style="border-bottom: 1px solid var(--glass-border); padding-bottom: 0.4rem;">
                            <span class="bar-label" style="width: auto; flex: 1;">Shelf {shelf}</span>
                            <span class="bar-count" style="color: var(--accent-gold);">{count}</span>
                        </div>
                    {/each}
                    {#if shelfStats.length === 0}
                        <p class="empty-text">No shelves assigned.</p>
                    {/if}
                </div>
            </div>

        </div>
    </div>
{/if}

<style>
    .analytics-panel {
        margin-bottom: 2rem;
        padding: 2rem;
        background: var(--bg-glow-1);
        border-top: 3px solid var(--accent-gold);
    }

    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 2rem;
    }

    .stat-card h4 {
        margin: 0 0 1rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .big-number { font-size: 2.5rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 1rem; }
    .subtext { font-size: 1rem; color: var(--text-secondary); font-weight: 400; }

    .progress-track { width: 100%; height: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
    :global(.light-mode) .progress-track { background: rgba(0,0,0,0.05); }
    .progress-fill { height: 100%; background: var(--accent-gold); border-radius: 4px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .stat-footer { font-size: 0.85rem; color: var(--text-secondary); text-align: right; }
    .chart-container { display: flex; flex-direction: column; gap: 0.8rem; }
    .chart-container::-webkit-scrollbar { width: 4px; }
    .chart-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    :global(.light-mode) .chart-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }

    .bar-row { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; }
    .bar-label { width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
    .bar-track { flex: 1; height: 6px; background: rgba(0,0,0,0.2); border-radius: 3px; }
    :global(.light-mode) .bar-track { background: rgba(0,0,0,0.05); }
    .bar-fill { height: 100%; background: var(--accent-gold); border-radius: 3px; transition: width 1s ease-out; }
    .bar-count { width: 20px; text-align: right; color: var(--text-secondary); font-weight: 600; }
    .empty-text { color: var(--text-secondary); font-style: italic; font-size: 0.9rem; }
=======

 <script>
    import { slide } from 'svelte/transition';

    export let books = [];
    export let isOpen = false;
    $: totalBooks = books.length;
    $: lentCount = books.filter(b => b.borrower).length;
    
    $: readCount = books.filter(b => b.rating && b.rating > 0).length;
    $: readPercentage = totalBooks === 0 ? 0 : Math.round((readCount / totalBooks) * 100);
    $: topGenres = Object.entries(
        books.reduce((acc, book) => {
            const g = book.genre || 'Uncategorized';
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 4);
    $: shelfStats = Object.entries(
        books.reduce((acc, book) => {
            const s = book.shelf || 'Unassigned';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]);
</script>
{#if isOpen}
    <div class="analytics-panel glass-panel" transition:slide={{ duration: 400 }}>
        <div class="analytics-grid">
            
            <div class="stat-card">
                <h4>Total Books</h4>
                <div class="big-number">{totalBooks}</div>

            </div>

            <div class="stat-card">
                <h4>Currently Lent Out</h4>
                <div class="big-number" style="color: var(--text-secondary);">{lentCount}</div>
                <div class="stat-footer" style="font-size: 1rem; margin-top: -0.5rem; margin-bottom: 1rem;">

                </div>
            </div>

            <div class="stat-card">
                <h4>Reading Progress</h4>
                <div class="big-number">{readCount} <span class="subtext">/ {totalBooks} Read</span></div>
                
                <div class="progress-track">
                    <div class="progress-fill" style="width: {readPercentage}%;"></div>
                </div>
                <div class="stat-footer">{readPercentage}% Completed</div>
            </div>

            <div class="stat-card">
                <h4>Genres</h4>
                <div class="chart-container">
                    {#each topGenres as [genre, count]}
                        <div class="bar-row">
                            <span class="bar-label">{genre}</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: {(count / totalBooks) * 100}%;"></div>
                            </div>
                            <span class="bar-count">{count}</span>
                        </div>
                    {/each}
                    {#if topGenres.length === 0}
                        <p class="empty-text">Add books to see your genres.</p>
                    {/if}
                </div>
            </div>

            <div class="stat-card">
                <h4>Books Per Shelf</h4>
                <div class="chart-container" style="max-height: 120px; overflow-y: auto; padding-right: 0.5rem;">
                    {#each shelfStats as [shelf, count]}
                        <div class="bar-row" style="border-bottom: 1px solid var(--glass-border); padding-bottom: 0.4rem;">
                            <span class="bar-label" style="width: auto; flex: 1;">Shelf {shelf}</span>
                            <span class="bar-count" style="color: var(--accent-gold);">{count}</span>
                        </div>
                    {/each}
                    {#if shelfStats.length === 0}
                        <p class="empty-text">No shelves assigned.</p>
                    {/if}
                </div>
            </div>

        </div>
    </div>
{/if}

<style>
    .analytics-panel {
        margin-bottom: 2rem;
        padding: 2rem;
        background: var(--bg-glow-1);
        border-top: 3px solid var(--accent-gold);
    }

    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 2rem;
    }

    .stat-card h4 {
        margin: 0 0 1rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .big-number { font-size: 2.5rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 1rem; }
    .subtext { font-size: 1rem; color: var(--text-secondary); font-weight: 400; }

    .progress-track { width: 100%; height: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
    :global(.light-mode) .progress-track { background: rgba(0,0,0,0.05); }
    .progress-fill { height: 100%; background: var(--accent-gold); border-radius: 4px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .stat-footer { font-size: 0.85rem; color: var(--text-secondary); text-align: right; }
    .chart-container { display: flex; flex-direction: column; gap: 0.8rem; }
    .chart-container::-webkit-scrollbar { width: 4px; }
    .chart-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    :global(.light-mode) .chart-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }

    .bar-row { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; }
    .bar-label { width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
    .bar-track { flex: 1; height: 6px; background: rgba(0,0,0,0.2); border-radius: 3px; }
    :global(.light-mode) .bar-track { background: rgba(0,0,0,0.05); }
    .bar-fill { height: 100%; background: var(--accent-gold); border-radius: 3px; transition: width 1s ease-out; }
    .bar-count { width: 20px; text-align: right; color: var(--text-secondary); font-weight: 600; }
    .empty-text { color: var(--text-secondary); font-style: italic; font-size: 0.9rem; }
>>>>>>> 3a1a39d (Initial commit- MVP ready for launch)
</style>