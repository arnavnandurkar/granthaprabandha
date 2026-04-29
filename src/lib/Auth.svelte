<script>
    import { supabase } from './supabase.js';
    import { fly } from 'svelte/transition';

    let email = '';
    let password = '';
    let isLogin = true;
    let loading = false;
    let authMessage = '';

    async function handleAuth() {
        loading = true;
        authMessage = '';
        
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                authMessage = "Registration successful! You are now logged in.";
            }
        } catch (error) {
            authMessage = error.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="auth-container" in:fly={{ y: 20, duration: 600 }}>
    <div class="glass-panel auth-card">
        <div class="auth-header">
            <h1>{isLogin ? 'Welcome Back' : 'Begin Your Library'}</h1>
            <p>Enter your credentials to access your library.</p>
        </div>

        <form on:submit|preventDefault={handleAuth} class="auth-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} class="input-field" required />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} class="input-field" required />
            </div>

            {#if authMessage}
                <p class="auth-message">{authMessage}</p>
            {/if}

            <button type="submit" class="btn-primary" disabled={loading} style="width: 100%; justify-content: center; margin-top: 1rem;">
                {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Register')}
            </button>
        </form>

        <div class="auth-toggle">
            <p>
                {isLogin ? "Don't have an account yet?" : "Already have an account?"} 
                <span class="toggle-link" on:click={() => isLogin = !isLogin}>
                    {isLogin ? 'Create one.' : 'Sign in.'}
                </span>
            </p>
        </div>
    </div>
</div>

<style>
    .auth-container {
        display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 1rem;
    }

    .auth-card {
        width: 100%; max-width: 400px; padding: 3rem 2rem; display: flex; flex-direction: column; gap: 2rem;
    }

    .auth-header { text-align: center; }
    .auth-header h1 { color: var(--accent-amber); font-family: 'Playfair Display', serif; margin-bottom: 0.5rem; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .auth-message { color: #583b04; font-size: 0.85rem; text-align: center; background: rgba(255, 107, 107, 0.1); padding: 0.5rem; border-radius: var(--radius-sm); }
    
    .auth-toggle { text-align: center; font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem; }
    .toggle-link { color: var(--accent-amber); cursor: pointer; text-decoration: underline; font-weight: 500; }
</style>
