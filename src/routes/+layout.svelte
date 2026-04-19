<script>
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Learn How To Sing</title>
  <meta name="description" content="AI powered singing teacher that monitors your pitch in real-time." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app-wrapper">
  <header class="navbar glass">
    <div class="container navbar-content">
      <a href="/" class="logo">
        <span class="text-gradient">Simply<br/></span>
        <strong>Sing</strong>Pi
      </a>
      <nav>
        <a href="/practice" class="nav-link">Practice</a>
        <a href="/song" class="nav-link">Songs</a>
      </nav>
    </div>
  </header>

  <main class="main-content">
    {@render children()}
  </main>
</div>

<style>
  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 1rem 0;
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    line-height: 1;
    color: var(--color-text-primary);
  }

  .logo span {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 800;
  }

  .nav-link {
    margin-left: 2rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    font-family: 'Inter', sans-serif;
  }
  
  .nav-link:hover {
    color: var(--color-text-primary);
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
</style>
