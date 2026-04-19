<script>
  import { onMount, onDestroy } from 'svelte';
  import { Midi } from '@tonejs/midi';
  import { AudioManager } from '$lib/AudioManager';
  import SongPitchCanvas from '$lib/SongPitchCanvas.svelte';
  
  let audioManager;
  let isRecording = $state(false);
  let currentFloatMidi = $state(null);
  
  let targetNotes = $state([]);
  let currentTime = $state(0);
  let startTime = $state(0);
  let loopId;

  onMount(() => {
    audioManager = new AudioManager();
  });

  onDestroy(() => {
    if (audioManager) audioManager.stop();
    cancelAnimationFrame(loopId);
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const midiData = new Midi(arrayBuffer);
      
      let bestTrack = null;
      for (const track of midiData.tracks) {
        if (!bestTrack || track.notes.length > bestTrack.notes.length) {
           bestTrack = track;
        }
      }

      if (bestTrack) {
        targetNotes = bestTrack.notes.map(n => ({
          midi: n.midi,
          time: n.time,
          duration: n.duration
        }));
      }
      
      if (isRecording) {
         toggleRecording();
      }
      currentTime = 0; 
    } catch (err) {
      console.error("Failed to parse MIDI:", err);
      alert("Invalid MIDI file. Please try another one.");
    }
  };

  const updateTime = () => {
    if(!isRecording) return;
    const now = performance.now() / 1000;
    currentTime = now - startTime;
    loopId = requestAnimationFrame(updateTime);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      audioManager.stop();
      isRecording = false;
      currentFloatMidi = null;
      cancelAnimationFrame(loopId);
    } else {
      await audioManager.start((info) => {
        if (info) {
          currentFloatMidi = info.midi + (info.cents / 100);
        } else {
          currentFloatMidi = null;
        }
      });
      isRecording = true;
      startTime = (performance.now() / 1000) - currentTime; 
      loopId = requestAnimationFrame(updateTime);
    }
  };

  const restartSong = () => {
     currentTime = 0;
     if (isRecording) {
        startTime = performance.now() / 1000;
     }
  };

</script>

<div class="container animate-slide-up">
  <div class="header">
    <h1 class="title">Song <span class="text-gradient">Mode</span></h1>
    <p class="subtitle">Upload a MIDI file to extract the melody track and sing along to the piano roll.</p>
  </div>

  <div class="dashboard">
    <div class="controls glass">
      <div class="upload-area">
        <label for="midi-upload" class="upload-btn">Upload MIDI File (.mid)</label>
        <input id="midi-upload" type="file" accept=".mid,.midi,audio/midi" onchange={handleFileUpload} />
        <p class="notes-status">
           {#if targetNotes.length > 0}
              Loaded {targetNotes.length} notes.
           {:else}
              No song loaded yet.
           {/if}
        </p>
      </div>

      <div class="playback-controls">
         <button class="btn" disabled={targetNotes.length === 0} onclick={toggleRecording}>
            {isRecording ? 'Stop' : 'Play & Sing'}
         </button>
         <button class="btn secondary" disabled={targetNotes.length === 0} onclick={restartSong}>
            Restart Track
         </button>
      </div>
      
      <div class="time-display">
         <p>Time: <strong>{currentTime.toFixed(1)}s</strong></p>
      </div>
    </div>

    <div class="canvas-wrap">
       <SongPitchCanvas 
          {currentMidi} 
          {targetNotes} 
          {currentTime} 
          isPlaying={isRecording} 
       />
    </div>
  </div>
</div>

<style>
  .container {
    padding-top: 2rem;
    padding-bottom: 2rem;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
  }
  
  .header {
    margin-bottom: 2rem;
  }

  .dashboard {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-radius: var(--border-radius-md);
    flex-wrap: wrap;
    gap: 1rem;
  }

  input[type="file"] {
    display: none;
  }

  .upload-area {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .upload-btn {
    background: rgba(255,255,255,0.1);
    border: 1px dashed rgba(255,255,255,0.3);
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-fast);
  }

  .upload-btn:hover {
    background: rgba(255,255,255,0.15);
    border-color: var(--color-accent-1);
    color: var(--color-accent-1);
  }

  .notes-status {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .playback-controls {
    display: flex;
    gap: 1rem;
  }

  .btn.secondary {
    background: rgba(255,255,255,0.1);
    color: var(--color-text-primary);
  }

  .btn.secondary:hover:not(:disabled) {
    background: rgba(255,255,255,0.2);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.3);
    pointer-events: none;
  }

  .time-display {
    text-align: right;
    min-width: 100px;
    font-family: monospace;
    font-size: 1.1rem;
  }

  .canvas-wrap {
    flex-grow: 1;
    border-radius: var(--border-radius-md);
    min-height: 300px;
  }
</style>
