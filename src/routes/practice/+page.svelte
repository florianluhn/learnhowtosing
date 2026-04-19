<script>
  import { onMount, onDestroy } from 'svelte';
  import { AudioManager } from '$lib/AudioManager';
  import PitchCanvas from '$lib/PitchCanvas.svelte';

  let audioManager;
  let isRecording = $state(false);
  let noteInfo = $state(null);
  let currentFloatMidi = $state(null);

  // Practice state
  let practiceNotes = [
    { name: "C4", midi: 60 },
    { name: "D4", midi: 62 },
    { name: "E4", midi: 64 },
    { name: "F4", midi: 65 },
    { name: "G4", midi: 67 }
  ];
  let currentPracticeIdx = $state(0);
  let targetMidi = $state(null);
  let targetNoteName = $state("--");

  onMount(() => {
    audioManager = new AudioManager();
  });

  onDestroy(() => {
    if (audioManager) audioManager.stop();
  });

  async function toggleRecording() {
    if (isRecording) {
      audioManager.stop();
      isRecording = false;
      noteInfo = null;
      currentFloatMidi = null;
    } else {
      targetMidi = practiceNotes[currentPracticeIdx].midi;
      targetNoteName = practiceNotes[currentPracticeIdx].name;

      await audioManager.start((info) => {
        noteInfo = info;
        if (info) {
          currentFloatMidi = info.midi + (info.cents / 100);
        } else {
          currentFloatMidi = null;
        }
      });
      isRecording = true;
    }
  }

  function nextNote() {
    currentPracticeIdx = (currentPracticeIdx + 1) % practiceNotes.length;
    targetMidi = practiceNotes[currentPracticeIdx].midi;
    targetNoteName = practiceNotes[currentPracticeIdx].name;
  }

  function prevNote() {
    currentPracticeIdx = (currentPracticeIdx - 1 + practiceNotes.length) % practiceNotes.length;
    targetMidi = practiceNotes[currentPracticeIdx].midi;
    targetNoteName = practiceNotes[currentPracticeIdx].name;
  }
</script>

<div class="container animate-slide-up">
  <div class="header">
    <h1 class="title">Practice <span class="text-gradient">Mode</span></h1>
    <p class="subtitle">Warm up your voice by matching these target notes.</p>
  </div>

  <div class="dashboard glass">
    <div class="controls-panel">
      <div class="target-display">
        <h3>Target Note</h3>
        <div class="big-note">{targetNoteName}</div>
      </div>

      <div class="action-buttons">
        <button class="btn" onclick={toggleRecording}>
          {isRecording ? 'Stop Session' : 'Start Mic'}
        </button>
        {#if isRecording}
          <div class="nav-controls">
            <button class="btn secondary" onclick={prevNote}>&larr; Prev</button>
            <button class="btn secondary" onclick={nextNote}>Next &rarr;</button>
          </div>
        {/if}
      </div>

      <div class="status-panel">
        <p>Your Pitch: <strong>{noteInfo ? noteInfo.name : '--'}</strong></p>
        <p class="cents">{noteInfo ? (noteInfo.cents > 0 ? '+' : '') + noteInfo.cents + ' cents' : 'Waiting...'}</p>
      </div>
    </div>

    <div class="canvas-panel">
      {#if isRecording}
        <PitchCanvas {currentMidi} {targetMidi} />
      {:else}
        <div class="idle-state flex-center">
          <p>Click "Start Mic" to begin visualizing.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    padding-top: 2rem;
    padding-bottom: 2rem;
    height: calc(100vh - 80px); /* Fill most of screen */
    display: flex;
    flex-direction: column;
  }

  .header {
    margin-bottom: 2rem;
  }

  .dashboard {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
    border-radius: var(--border-radius-lg);
    padding: 1.5rem;
    min-height: 400px;
  }

  @media (max-width: 768px) {
    .dashboard {
      grid-template-columns: 1fr;
    }
    .container { height: auto; }
  }

  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .target-display {
    text-align: center;
    background: rgba(0,0,0,0.2);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
  }

  .target-display h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .big-note {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
    font-family: 'Outfit', sans-serif;
    color: var(--color-accent-2);
    text-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-controls {
    display: flex;
    gap: 0.5rem;
  }

  .nav-controls .btn {
    flex: 1;
  }

  .btn.secondary {
    background: rgba(255,255,255,0.1);
    color: var(--color-text-primary);
  }

  .btn.secondary:hover {
    background: rgba(255,255,255,0.2);
  }

  .status-panel {
    margin-top: auto;
    padding: 1rem;
    background: rgba(0,0,0,0.2);
    border-radius: var(--border-radius-sm);
  }

  .status-panel p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .cents {
    font-family: monospace;
    color: var(--color-text-secondary);
  }

  .canvas-panel {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .idle-state {
    width: 100%;
    height: 100%;
    color: var(--color-text-secondary);
    background: rgba(0,0,0,0.3);
  }
</style>
