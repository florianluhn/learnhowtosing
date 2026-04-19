<script>
  // Home page script
</script>

<div class="hero container animate-slide-up">
  <div class="hero-content">
    <h1 class="title">Find your <span class="text-gradient">True Voice</span>.</h1>
    <p class="subtitle">Real-time pitch detection. Interactive lessons. Right from your browser.</p>
  </div>

  <div class="card-grid">
    <!-- Practice Mode Card -->
    <a href="/practice" class="mode-card glass">
      <div class="card-icon practice-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M3.5 0a.5.5 0 0 1 .5.5H6a.5.5 0 0 1 0 1H4v13h8V1.5a.5.5 0 0 1 1 0V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M4.5 4h7v1h-7V4zm0 3h5v1h-5V7zm0 3h7v1h-7v-1z"/>
        </svg>
      </div>
      <h2>Practice Mode</h2>
      <p>Master your scales. Hit the specific notes we generate, and train your muscle memory.</p>
      <div class="btn-fake">Start Practice</div>
    </a>

    <!-- Song Mode Card -->
    <a href="/song" class="mode-card glass">
      <div class="card-icon song-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
          <path fill-rule="evenodd" d="M9 3v10H8V3h1z"/>
          <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z"/>
        </svg>
      </div>
      <h2>Song Mode</h2>
      <p>Upload a MIDI file and sing along to the melody. Watch your pitch hit the target layout.</p>
      <div class="btn-fake">Upload & Sing</div>
    </a>
  </div>
</div>

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
    padding-bottom: 4rem;
    text-align: center;
  }

  .hero-content {
    margin-bottom: 4rem;
    max-width: 800px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
  }

  .mode-card {
    display: flex;
    flex-direction: column;
    padding: 2.5rem;
    border-radius: var(--border-radius-lg);
    text-align: left;
    transition: all var(--transition-normal);
    color: var(--color-text-primary);
    position: relative;
    overflow: hidden;
  }

  .mode-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2));
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .mode-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    background: var(--color-bg-card-hover);
  }

  .mode-card:hover::before {
    opacity: 1;
  }

  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: var(--border-radius-md);
    margin-bottom: 1.5rem;
  }

  .practice-icon {
    background: rgba(59, 130, 246, 0.2);
    color: var(--color-accent-1);
  }

  .song-icon {
    background: rgba(236, 72, 153, 0.2);
    color: var(--color-accent-3);
  }

  .mode-card h2 {
    font-size: 1.75rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-family: 'Outfit', sans-serif;
  }

  .mode-card p {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
    flex-grow: 1;
  }

  .btn-fake {
    display: inline-block;
    padding: 0.75rem 0;
    color: var(--color-accent-2);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    position: relative;
    align-self: flex-start;
  }
  
  .btn-fake::after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform var(--transition-fast);
    display: inline-block;
  }

  .mode-card:hover .btn-fake::after {
    transform: translateX(5px);
  }
</style>
